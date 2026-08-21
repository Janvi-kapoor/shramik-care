const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'shramikcare.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
      // 1. Workers Table
      db.run(`CREATE TABLE IF NOT EXISTS workers (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        mobile TEXT,
        originState TEXT,
        originDistrict TEXT,
        keralaDistrict TEXT,
        district TEXT,
        worksite TEXT,
        occupation TEXT,
        audioLanguage TEXT,
        bloodGroup TEXT,
        abhaId TEXT,
        awazCardNo TEXT,
        isAwazLinked INTEGER,
        awazCoverageLimit INTEGER,
        awazUtilizedAmount INTEGER,
        allergies TEXT,
        conditions TEXT,
        assignedFacility TEXT
      )`);

      // 2. Doctors Table
      db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT,
        kmcLicense TEXT,
        facility TEXT,
        district TEXT
      )`);

      // 3. Admins Table
      db.run(`CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        name TEXT,
        designation TEXT,
        pin TEXT
      )`);

      // Seed Initial Admin
      db.get("SELECT id FROM admins WHERE id = 'GOVT-ADMIN-01'", [], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO admins (id, name, designation, pin) VALUES 
            ('GOVT-ADMIN-01', 'Dr. Ramesh Nair', 'Chief Health Officer', '1234')`);
        }
      });

      // Seed Initial Doctor
      db.get("SELECT id FROM doctors WHERE id = 'DOC-ALUVA-01'", [], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO doctors (id, name, kmcLicense, facility, district) VALUES 
            ('DOC-ALUVA-01', 'Dr. Mathew Thomas', 'KMC-88214', 'Aluva Taluk Hospital', 'Ernakulam')`);
        }
      });

      // Seed Initial Worker 1 (Ramesh)
      db.get("SELECT id FROM workers WHERE id = 'KL-MIG-78219'", [], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO workers (
            id, name, age, gender, mobile, originState, originDistrict, keralaDistrict, district, worksite, 
            occupation, audioLanguage, bloodGroup, abhaId, awazCardNo, isAwazLinked, awazCoverageLimit, 
            awazUtilizedAmount, allergies, conditions, assignedFacility
          ) VALUES (
            'KL-MIG-78219', 'Ramesh Kumar', 28, 'Male', '9876543210', 'Bihar', 'Patna', 'Ernakulam', 'Ernakulam', 
            'Perumbavoor Plywood Factory', 'Construction Worker', 'hi', 'B+', '91-1234-5678-9012', 
            'AWZ-KL-2025-1199', 1, 50000, 1250, '["Paracetamol (Hives)", "Penicillin"]', '["None"]', 'Aluva Taluk Hospital'
          )`);
        }
      });

      // Seed Initial Worker 2 (Bikash)
      db.get("SELECT id FROM workers WHERE id = 'KL-MIG-88412'", [], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO workers (
            id, name, age, gender, mobile, originState, originDistrict, keralaDistrict, district, worksite, 
            occupation, audioLanguage, bloodGroup, abhaId, awazCardNo, isAwazLinked, awazCoverageLimit, 
            awazUtilizedAmount, allergies, conditions, assignedFacility
          ) VALUES (
            'KL-MIG-88412', 'Bikash Mondal', 34, 'Male', '9876500001', 'West Bengal', 'Malda', 'Ernakulam', 'Ernakulam', 
            'Aluva Construction Site', 'Mason', 'bn', 'O+', '91-9876-5432-1098', 
            'AWZ-KL-2025-2200', 1, 50000, 0, '["No Known Drug Allergies (NKDA)"]', '["None"]', 'Aluva Taluk Hospital'
          )`);
        }
      });
      
      // Seed Worker 3 (KL-MIG-15716)
      db.get("SELECT id FROM workers WHERE id = 'KL-MIG-15716'", [], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO workers (
            id, name, age, gender, mobile, originState, originDistrict, keralaDistrict, district, worksite, 
            occupation, audioLanguage, bloodGroup, abhaId, awazCardNo, isAwazLinked, awazCoverageLimit, 
            awazUtilizedAmount, allergies, conditions, assignedFacility
          ) VALUES (
            'KL-MIG-15716', 'Rahul Sharma', 30, 'Male', '9876500002', 'Uttar Pradesh', 'Lucknow', 'Ernakulam', 'Ernakulam', 
            'Kakkanad IT Park Site', 'Electrician', 'hi', 'A+', '91-1111-2222-3333', 
            'AWZ-KL-2025-3300', 1, 50000, 0, '["No Known Drug Allergies (NKDA)"]', '["None"]', 'Kakkanad PHC'
          )`);
        }
      });

      // 4. Prescriptions Table
      db.run(`CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        workerId TEXT,
        doctorId TEXT,
        doctorName TEXT,
        date TEXT,
        diagnosis TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 5. Prescription Medicines Table
      db.run(`CREATE TABLE IF NOT EXISTS prescription_medicines (
        id TEXT PRIMARY KEY,
        prescriptionId TEXT,
        name TEXT,
        genericName TEXT,
        strength TEXT,
        dosage TEXT,
        frequency TEXT,
        duration TEXT,
        instructions TEXT
      )`);

      // 6. Camps Table
      // Adding purpose, assigned_doctor_ids, created_at, drop old and recreate or use ALTER
      // SQLite doesn't easily alter, so we'll do it if it's easy. Actually it's better to just ensure it's created correctly if it doesn't exist.
      // Wait, let's just create if not exists.
      db.run(`CREATE TABLE IF NOT EXISTS camps (
        id TEXT PRIMARY KEY,
        district TEXT,
        location TEXT,
        date TEXT,
        capacity INTEGER,
        purpose TEXT,
        assigned_doctor_ids TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // Let's try adding the columns if they don't exist
      db.run("ALTER TABLE camps ADD COLUMN purpose TEXT", (err) => {});
      db.run("ALTER TABLE camps ADD COLUMN assigned_doctor_ids TEXT", (err) => {});
      db.run("ALTER TABLE camps ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP", (err) => {});

      // 7. Camp Enrollments Table
      db.run(`CREATE TABLE IF NOT EXISTS camp_enrollments (
        id TEXT PRIMARY KEY,
        campId TEXT,
        workerId TEXT,
        token TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      db.run("ALTER TABLE camp_enrollments ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP", (err) => {});

      // 8. Anonymized Health Events Table
      db.run(`CREATE TABLE IF NOT EXISTS health_events (
        id TEXT PRIMARY KEY,
        district TEXT,
        condition TEXT,
        date TEXT,
        source TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Seed Initial Health Events (Fever, Cough, etc.)
      db.get("SELECT COUNT(*) as count FROM health_events", [], (err, row) => {
        if (row && row.count === 0) {
          const insertStmt = db.prepare(`INSERT INTO health_events (id, district, condition, date, source) VALUES (?, ?, ?, ?, ?)`);
          // Ernakulam Fever cluster
          for(let i=0; i<14; i++) {
            insertStmt.run(`HE-ERN-F-${i}`, 'Ernakulam', 'Fever', new Date().toISOString().split('T')[0], 'doctor_consultation');
          }
          for(let i=0; i<6; i++) {
            insertStmt.run(`HE-ERN-C-${i}`, 'Ernakulam', 'Cough', new Date().toISOString().split('T')[0], 'doctor_consultation');
          }
          // Palakkad cluster
          for(let i=0; i<3; i++) {
            insertStmt.run(`HE-PKD-F-${i}`, 'Palakkad', 'Fever', new Date().toISOString().split('T')[0], 'doctor_consultation');
          }
          insertStmt.finalize();
        }
      });

      // 9. Notifications / Broadcasts
      db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT,
        message TEXT,
        target_district TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // 10. Broadcast Alerts (for multilingual)
      db.run(`CREATE TABLE IF NOT EXISTS broadcast_alerts (
        id TEXT PRIMARY KEY,
        title TEXT,
        message TEXT,
        translations TEXT,
        target_district TEXT,
        priority TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // Let's add priority if missing
      db.run("ALTER TABLE broadcast_alerts ADD COLUMN priority TEXT", (err) => {});

      // Worker Notifications (Per-worker)
      db.run(`CREATE TABLE IF NOT EXISTS worker_notifications (
        id TEXT PRIMARY KEY,
        workerId TEXT,
        broadcastId TEXT,
        title TEXT,
        message TEXT,
        translations TEXT,
        priority TEXT,
        district TEXT,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 11. Claims (AWAZ)
      db.run(`CREATE TABLE IF NOT EXISTS claims (
        id TEXT PRIMARY KEY,
        workerId TEXT,
        amount INTEGER,
        reason TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

    });
  }
});

module.exports = db;
