const express = require("express");
const jwt = require("jsonwebtoken");
const { GoogleGenAI } = require("@google/genai");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "shramik-care-super-secret-key";

function requireDoctor(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "doctor")
      return res.status(403).json({ error: "Doctor access required" });
    req.doctor = payload;
    next();
  } catch {
    res.status(401).json({ error: "Valid doctor session required" });
  }
}

function parseWorker(row) {
  if (!row) return row;
  return {
    ...row,
    allergies: row.allergies ? JSON.parse(row.allergies) : [],
    conditions: row.conditions ? JSON.parse(row.conditions) : [],
    isAwazLinked: !!row.isAwazLinked,
  };
}

function getReport(workerId) {
  return Promise.all([
    new Promise((resolve, reject) =>
      db.get("SELECT * FROM workers WHERE id = ?", [workerId], (err, row) =>
        err ? reject(err) : resolve(parseWorker(row)),
      ),
    ),
    new Promise((resolve, reject) =>
      db.all(
        "SELECT * FROM consultations WHERE workerId = ? ORDER BY date DESC, created_at DESC",
        [workerId],
        (err, rows) => (err ? reject(err) : resolve(rows)),
      ),
    ),
    new Promise((resolve, reject) =>
      db.all(
        "SELECT * FROM prescriptions WHERE workerId = ? ORDER BY timestamp DESC",
        [workerId],
        (err, rows) => (err ? reject(err) : resolve(rows)),
      ),
    ),
    new Promise((resolve, reject) =>
      db.all(
        `SELECT p.id AS prescriptionId, pm.* FROM prescriptions p JOIN prescription_medicines pm ON pm.prescriptionId = p.id WHERE p.workerId = ? ORDER BY p.timestamp DESC`,
        [workerId],
        (err, rows) => (err ? reject(err) : resolve(rows)),
      ),
    ),
    new Promise((resolve, reject) =>
      db.all(
        `SELECT c.* FROM camps c JOIN camp_enrollments e ON e.campId = c.id WHERE e.workerId = ? ORDER BY c.date DESC`,
        [workerId],
        (err, rows) => (err ? reject(err) : resolve(rows)),
      ),
    ),
  ]).then(([worker, consultations, prescriptions, medicines, camps]) => ({
    worker,
    consultations,
    prescriptions: prescriptions.map((p) => ({
      ...p,
      medicines: medicines.filter((m) => m.prescriptionId === p.id),
    })),
    camps,
  }));
}

router.get("/patients", requireDoctor, (req, res) => {
  const search = `%${(req.query.search || "").trim()}%`;
  db.all(
    `SELECT id, name, district, audioLanguage, allergies, conditions FROM workers WHERE name LIKE ? COLLATE NOCASE OR id LIKE ? COLLATE NOCASE ORDER BY name LIMIT 50`,
    [search, search],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows.map(parseWorker));
    },
  );
});

router.get("/patients/:id/report", requireDoctor, async (req, res) => {
  try {
    const report = await getReport(req.params.id);
    if (!report.worker)
      return res.status(404).json({ error: "Worker not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/dashboard", requireDoctor, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [
      patientsSeenToday,
      consultationsToday,
      recentPatients,
      upcomingCamps,
    ] = await Promise.all([
      new Promise((resolve, reject) =>
        db.get(
          "SELECT COUNT(DISTINCT workerId) AS count FROM consultations WHERE date = ?",
          [today],
          (e, r) => (e ? reject(e) : resolve(r.count)),
        ),
      ),
      new Promise((resolve, reject) =>
        db.get(
          "SELECT COUNT(*) AS count FROM consultations WHERE date = ?",
          [today],
          (e, r) => (e ? reject(e) : resolve(r.count)),
        ),
      ),
      new Promise((resolve, reject) =>
        db.all(
          `SELECT w.id, w.name, w.district, MAX(c.date) AS lastConsultation, (SELECT diagnosis FROM consultations c2 WHERE c2.workerId = w.id ORDER BY c2.date DESC, c2.created_at DESC LIMIT 1) AS diagnosis FROM workers w JOIN consultations c ON c.workerId = w.id GROUP BY w.id ORDER BY lastConsultation DESC LIMIT 8`,
          [],
          (e, r) => (e ? reject(e) : resolve(r)),
        ),
      ),
      new Promise((resolve, reject) =>
        db.all(
          `SELECT * FROM camps WHERE status = 'Active' AND assigned_doctor_ids LIKE ? ORDER BY date ASC LIMIT 5`,
          [`%${req.doctor.id}%`],
          (e, r) => (e ? reject(e) : resolve(r)),
        ),
      ),
    ]);
    res.json({
      patientsSeenToday,
      consultationsToday,
      recentPatients,
      upcomingCamps,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/patients/:id/consultations", requireDoctor, (req, res) => {
  const { diagnosis, notes, publicHealthCondition } = req.body;
  const date = new Date().toISOString().slice(0, 10);
  const id = `CONS-${Date.now()}`;
  db.get(
    "SELECT district FROM workers WHERE id = ?",
    [req.params.id],
    (lookupErr, worker) => {
      if (lookupErr) return res.status(500).json({ error: lookupErr.message });
      if (!worker) return res.status(404).json({ error: "Worker not found" });
      db.run(
        "INSERT INTO consultations (id, workerId, doctorId, diagnosis, notes, date) VALUES (?, ?, ?, ?, ?, ?)",
        [id, req.params.id, req.doctor.id, diagnosis || "", notes || "", date],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          if (!publicHealthCondition)
            return res.json({ success: true, consultationId: id });
          db.run(
            "INSERT INTO health_events (id, district, condition, date, source) VALUES (?, ?, ?, ?, ?)",
            [
              `HE-${Date.now()}`,
              worker.district,
              publicHealthCondition,
              date,
              "doctor_consultation",
            ],
            (eventErr) =>
              eventErr
                ? res.status(500).json({ error: eventErr.message })
                : res.json({ success: true, consultationId: id }),
          );
        },
      );
    },
  );
});

router.post("/patients/:id/summary", requireDoctor, async (req, res) => {
  try {
    const report = await getReport(req.params.id);
    if (!report.worker)
      return res.status(404).json({ error: "Worker not found" });
    const facts = `${report.consultations.length} consultations; diagnoses: ${
      report.consultations
        .map((c) => c.diagnosis)
        .filter(Boolean)
        .join(", ") || "none recorded"
    }; ${report.prescriptions.length} prescriptions; ${report.prescriptions.reduce((n, p) => n + p.medicines.length, 0)} prescribed medicines.`;
    if (!process.env.GEMINI_API_KEY)
      return res.json({ summary: `Record summary: ${facts}` });
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize only these medical record facts in one concise sentence. Do not diagnose or infer anything: ${facts}`,
    });
    res.json({ summary: response.text.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
