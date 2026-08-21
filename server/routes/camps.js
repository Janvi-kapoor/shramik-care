const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/active', (req, res) => {
  db.all('SELECT * FROM camps WHERE status = "Active" ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/doctor/:doctorId', (req, res) => {
  db.all('SELECT * FROM camps WHERE doctorId = ? ORDER BY created_at DESC', [req.params.doctorId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:campId/workers', (req, res) => {
  db.all(`
    SELECT w.* FROM workers w
    JOIN camp_enrollments e ON w.id = e.workerId
    WHERE e.campId = ?
  `, [req.params.campId], (err, rows) => {
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

module.exports = router;
