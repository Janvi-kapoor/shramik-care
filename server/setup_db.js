const db = require('./server/db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS broadcast_alerts (
    id TEXT PRIMARY KEY,
    title TEXT,
    message TEXT,
    translations TEXT,
    target_district TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    workerId TEXT,
    amount INTEGER,
    reason TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log("Tables created successfully");
});
