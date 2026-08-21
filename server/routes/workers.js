const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM workers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const parsedRows = rows.map(r => ({
      ...r,
      allergies: r.allergies ? JSON.parse(r.allergies) : [],
      conditions: r.conditions ? JSON.parse(r.conditions) : [],
      isAwazLinked: !!r.isAwazLinked,
    }));
    
    res.json(parsedRows);
  });
});
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM workers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Worker not found' });
    
    row.allergies = row.allergies ? JSON.parse(row.allergies) : [];
    row.conditions = row.conditions ? JSON.parse(row.conditions) : [];
    row.isAwazLinked = !!row.isAwazLinked;
    res.json(row);
  });
});

// Get prescriptions for a worker
router.get('/:id/prescriptions', (req, res) => {
  db.all('SELECT * FROM prescriptions WHERE workerId = ? ORDER BY timestamp DESC', [req.params.id], (err, prescriptions) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // We need to fetch medicines for each prescription
    const promises = prescriptions.map(p => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM prescription_medicines WHERE prescriptionId = ?', [p.id], (err, medicines) => {
          if (err) reject(err);
          p.medicines = medicines;
          resolve(p);
        });
      });
    });

    Promise.all(promises)
      .then(results => res.json(results))
      .catch(e => res.status(500).json({ error: e.message }));
  });
});

// Save a new prescription
router.post('/:id/prescriptions', (req, res) => {
  const { doctorName, date, diagnosis, medicines } = req.body;
  const workerId = req.params.id;
  const prescriptionId = 'RX-' + Date.now();
  const doctorId = 'DOC-UNKNOWN'; // could come from session if doctor is logging it

  db.run(`INSERT INTO prescriptions (id, workerId, doctorId, doctorName, date, diagnosis) 
          VALUES (?, ?, ?, ?, ?, ?)`, 
    [prescriptionId, workerId, doctorId, doctorName, date, diagnosis], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      if (medicines && medicines.length > 0) {
        const stmt = db.prepare(`INSERT INTO prescription_medicines 
          (id, prescriptionId, name, genericName, strength, dosage, frequency, duration, instructions) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          
        medicines.forEach((m, idx) => {
          const medId = prescriptionId + '-M' + idx;
          stmt.run(medId, prescriptionId, m.name, m.genericName, m.strength, m.dosage, m.frequency, m.duration, m.instructions);
        });
        stmt.finalize();
      }
      
      res.json({ success: true, prescriptionId });
  });
});

// Enroll in a camp
router.post('/enroll-camp', (req, res) => {
  const { workerId, campId } = req.body;
  const enrollId = 'ENR-' + Date.now();
  const token = 'TK-' + Math.floor(Math.random() * 10000);
  
  const db = require('../db');
  
  // Check for duplicates
  db.get(`SELECT id FROM camp_enrollments WHERE workerId = ? AND campId = ?`, [workerId, campId], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) {
      return res.status(400).json({ error: 'Worker is already enrolled in this camp' });
    }
    
    db.run(`INSERT INTO camp_enrollments (id, campId, workerId, token, status) VALUES (?, ?, ?, ?, 'Registered')`,
      [enrollId, campId, workerId, token],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, token });
      }
    );
  });
});

// Get notifications for a worker
router.get('/:id/notifications', (req, res) => {
  db.all('SELECT * FROM worker_notifications WHERE workerId = ? ORDER BY created_at DESC', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const parsedRows = rows.map(r => ({
      ...r,
      translations: r.translations ? JSON.parse(r.translations) : {},
      is_read: !!r.is_read
    }));
    
    res.json(parsedRows);
  });
});

// Mark notification as read
router.put('/:id/notifications/:notifId/read', (req, res) => {
  db.run('UPDATE worker_notifications SET is_read = 1 WHERE id = ? AND workerId = ?', [req.params.notifId, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
