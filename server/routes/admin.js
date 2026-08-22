const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "shramik-care-super-secret-key";

router.use((req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const session = jwt.verify(token, JWT_SECRET);
    if (session.role !== "admin")
      return res
        .status(403)
        .json({ error: "Government admin access required" });
    next();
  } catch {
    res.status(401).json({ error: "Valid government admin session required" });
  }
});

// AI Disease Outbreak & Heatmap
router.get("/outbreak", (req, res) => {
  const { district } = req.query;
  const threshold = 10;

  let query = `
    SELECT district, condition as symptom, COUNT(*) as count
    FROM health_events
    GROUP BY district, condition
    ORDER BY count DESC
  `;
  let params = [];

  if (district && district !== "All Districts") {
    query = `
      SELECT district, condition as symptom, COUNT(*) as count
      FROM health_events
      WHERE district = ?
      GROUP BY district, condition
      ORDER BY count DESC
    `;
    params.push(district);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const activeOutbreaks = rows.filter((r) => r.count >= threshold);
    res.json({
      success: true,
      outbreaks: activeOutbreaks,
      allData: rows,
    });
  });
});

// Get real aggregated health overview
router.get("/health-overview", (req, res) => {
  const { district } = req.query; // optional filter

  let workerQuery = "SELECT COUNT(*) as total FROM workers";
  let workerParams = [];

  let campsQuery =
    'SELECT COUNT(*) as total FROM camps WHERE status = "Active"';
  let campsParams = [];

  let reportsQuery = `
    SELECT district, condition, COUNT(*) as count
    FROM health_events
    GROUP BY district, condition
    ORDER BY count DESC
  `;

  if (district && district !== "All Districts") {
    workerQuery += " WHERE district = ?";
    workerParams.push(district);
    campsQuery += " AND district = ?";
    campsParams.push(district);
    reportsQuery = `
      SELECT district, condition, COUNT(*) as count
      FROM health_events
      WHERE district = ?
      GROUP BY district, condition
      ORDER BY count DESC
    `;
  }

  // Execute queries in parallel
  Promise.all([
    new Promise((resolve, reject) =>
      db.get(workerQuery, workerParams, (err, row) =>
        err ? reject(err) : resolve(row.total),
      ),
    ),
    new Promise((resolve, reject) =>
      db.get(campsQuery, campsParams, (err, row) =>
        err ? reject(err) : resolve(row.total),
      ),
    ),
    new Promise((resolve, reject) =>
      db.all(
        reportsQuery,
        district && district !== "All Districts" ? [district] : [],
        (err, rows) => (err ? reject(err) : resolve(rows)),
      ),
    ),
    new Promise((resolve, reject) =>
      db.get(
        "SELECT COUNT(*) as total FROM health_events" +
          (district && district !== "All Districts"
            ? " WHERE district = ?"
            : ""),
        district && district !== "All Districts" ? [district] : [],
        (err, row) => (err ? reject(err) : resolve(row.total)),
      ),
    ),
    new Promise((resolve, reject) =>
      db.all(
        "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows)),
      ),
    ),
  ])
    .then(
      ([
        totalWorkers,
        activeCamps,
        clusterData,
        totalReports,
        notifications,
      ]) => {
        // Generate alerts dynamically from clusterData if threshold (e.g. 10) is exceeded
        const activeAlerts = clusterData
          .filter((c) => c.count >= 10)
          .map((c) => ({
            id: `ALT-${c.district}-${c.condition}`,
            district: c.district,
            condition: c.condition,
            count: c.count,
            status: "High Activity",
            message: `${c.condition} activity is above the configured monitoring threshold.`,
          }));

        res.json({
          metrics: {
            totalWorkers,
            activeCamps,
            activeAlerts: activeAlerts.length,
            totalReports,
          },
          alerts: activeAlerts,
          clusters: clusterData,
          notifications,
        });
      },
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Doctors
router.get("/doctors", (req, res) => {
  db.all("SELECT * FROM doctors", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Camps
router.get("/camps", (req, res) => {
  db.all("SELECT * FROM camps ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Fetch enrollment counts
    const promises = rows.map((camp) => {
      return new Promise((resolve) => {
        db.get(
          "SELECT COUNT(*) as count FROM camp_enrollments WHERE campId = ?",
          [camp.id],
          (err, row) => {
            camp.enrolled = row ? row.count : 0;
            camp.available = Math.max(0, (camp.capacity || 0) - camp.enrolled);
            camp.resources = camp.resources ? JSON.parse(camp.resources) : [];
            resolve(camp);
          },
        );
      });
    });

    Promise.all(promises).then((camps) => res.json(camps));
  });
});

router.post("/camps", (req, res) => {
  const {
    name,
    district,
    location,
    date,
    capacity,
    purpose,
    assigned_doctor_ids,
    resources,
  } = req.body;
  const campId = "CAMP-" + Date.now();

  db.run(
    `INSERT INTO camps (id, name, district, location, date, capacity, purpose, assigned_doctor_ids, resources, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
    [
      campId,
      name || purpose,
      district,
      location,
      date,
      capacity,
      purpose,
      assigned_doctor_ids,
      JSON.stringify(resources || []),
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.all(
        "SELECT id FROM workers WHERE LOWER(district) = LOWER(?) OR LOWER(keralaDistrict) = LOWER(?)",
        [district, district],
        (workerErr, workers) => {
          if (workerErr || !workers.length)
            return res.json({ success: true, campId, recipientCount: 0 });
          const statement = db.prepare(
            "INSERT INTO worker_notifications (id, workerId, broadcastId, title, message, translations, priority, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          );
          workers.forEach((worker) =>
            statement.run(
              `WNOTIF-${campId}-${worker.id}`,
              worker.id,
              campId,
              "New health camp available",
              `New health camp available in ${district}: ${name || purpose}`,
              "{}",
              "Important",
              district,
            ),
          );
          statement.finalize(() =>
            res.json({ success: true, campId, recipientCount: workers.length }),
          );
        },
      );
    },
  );
});

// Broadcast (Multilingual with Gemini)
const { GoogleGenAI } = require("@google/genai");
router.post("/broadcast", async (req, res) => {
  const { title, message, target_district, target_languages, priority } =
    req.body;
  const notifId = "NOTIF-" + Date.now();
  const alertPriority = priority || "Important";

  let translations = {};

  if (target_languages && Array.isArray(target_languages)) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      for (const lang of target_languages) {
        try {
          const prompt = `Translate the following text to ${lang}. Return ONLY the translated text.\nText: "${message}"`;
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { temperature: 0.1 },
          });
          translations[lang] = response.text.trim();
        } catch (e) {
          console.error("Translation error", e);
        }
      }
    }
  }

  const translationsStr = JSON.stringify(translations);

  db.run(
    `INSERT INTO broadcast_alerts (id, title, message, translations, target_district, priority) VALUES (?, ?, ?, ?, ?, ?)`,
    [notifId, title, message, translationsStr, target_district, alertPriority],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Now find eligible workers and insert per-worker notifications
      let workerQuery = "SELECT id FROM workers";
      let params = [];
      if (target_district !== "all") {
        // Simple case-insensitive like match or exact match depending on data
        workerQuery +=
          " WHERE LOWER(district) = LOWER(?) OR LOWER(keralaDistrict) = LOWER(?)";
        params = [target_district, target_district];
      }

      db.all(workerQuery, params, (err, workers) => {
        if (err || !workers.length) {
          return res.json({
            success: true,
            notifId,
            translations,
            recipientCount: 0,
          });
        }

        const stmt = db.prepare(
          `INSERT INTO worker_notifications (id, workerId, broadcastId, title, message, translations, priority, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        );

        workers.forEach((w) => {
          stmt.run(
            "WNOTIF-" + w.id + "-" + Date.now(),
            w.id,
            notifId,
            title,
            message,
            translationsStr,
            alertPriority,
            target_district,
          );
        });

        stmt.finalize((err) => {
          res.json({
            success: true,
            notifId,
            translations,
            recipientCount: workers.length,
          });
        });
      });
    },
  );
});

// AWAZ Insurance Claim Settlement
router.get("/claims", (req, res) => {
  db.all("SELECT * FROM claims ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.put("/claims/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE claims SET status = "Settled" WHERE id = ?',
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

module.exports = router;
