const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/active', (req, res) => {
  db.all('SELECT * FROM camps WHERE status = "Active" ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
