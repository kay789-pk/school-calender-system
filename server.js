const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'school_calendar_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Database setup
const db = new sqlite3.Database('./school_calendar.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'teacher', 'student')),
    full_name TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location TEXT,
    responsible_person TEXT,
    event_type TEXT NOT NULL CHECK(event_type IN ('academic', 'student_activity', 'external', 'meeting', 'exam', 'hr', 'admin', 'policy_plan')),
    target_group TEXT NOT NULL CHECK(target_group IN ('admin', 'teacher', 'student', 'all')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    status_note TEXT,
    status_updated_by INTEGER,
    status_updated_at DATETIME,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id),
    FOREIGN KEY (status_updated_by) REFERENCES users (id)
  )`);

  // Event history table
  db.run(`CREATE TABLE IF NOT EXISTS event_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    action TEXT NOT NULL CHECK(action IN ('create', 'update', 'delete')),
    user_id INTEGER,
    changes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create default users
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const teacherPassword = bcrypt.hashSync('teacher123', 10);
  const studentPassword = bcrypt.hashSync('student123', 10);
  
  db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name, email) 
          VALUES ('admin', ?, 'admin', 'ผู้ดูแลระบบ', 'admin@sabklaiwittayakom.ac.th')`, 
          [adminPassword]);
          
  db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name, email) 
          VALUES ('teacher', ?, 'teacher', 'อาจารย์ทดสอบ', 'teacher@sabklaiwittayakom.ac.th')`, 
          [teacherPassword]);
          
  db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name, email) 
          VALUES ('student', ?, 'student', 'นักเรียนทดสอบ', 'student@sabklaiwittayakom.ac.th')`, 
          [studentPassword]);

  // Insert sample events
  setTimeout(() => {
    const sampleEvents = [
      {
        title: 'การสอบกลางภาค ภาคเรียนที่ 1',
        description: 'การสอบกลางภาคเรียนของนักเรียนทุกระดับชั้น',
        start_date: '2025-02-10 08:00:00',
        end_date: '2025-02-14 16:00:00',
        location: 'ห้องเรียนทุกห้อง',
        responsible_person: 'ฝ่ายวิชาการ',
        event_type: 'exam',
        target_group: 'all',
        created_by: 1
      },
      {
        title: 'กิจกรรมหน้าเสาธง',
        description: 'กิจกรรมหน้าเสาธงประจำสัปดาห์',
        start_date: '2025-02-03 07:30:00',
        end_date: '2025-02-03 08:00:00',
        location: 'ลานกิจกรรม',
        responsible_person: 'ฝ่ายกิจการนักเรียน',
        event_type: 'student_activity',
        target_group: 'all',
        created_by: 1
      },
      {
        title: 'ประชุมครูประจำเดือน',
        description: 'ประชุมครูประจำเดือนกุมภาพันธ์ 2568',
        start_date: '2025-02-05 13:30:00',
        end_date: '2025-02-05 16:00:00',
        location: 'ห้องประชุมใหญ่',
        responsible_person: 'ผู้อำนวยการ',
        event_type: 'meeting',
        target_group: 'teacher',
        created_by: 1
      },
      {
        title: 'ทัศนศึกษาพิพิธภัณฑ์วิทยาศาสตร์',
        description: 'กิจกรรมทัศนศึกษาสำหรับนักเรียนชั้น ม.4-ม.6',
        start_date: '2025-02-15 08:00:00',
        end_date: '2025-02-15 17:00:00',
        location: 'พิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ',
        responsible_person: 'ครูวิทยาศาสตร์',
        event_type: 'external',
        target_group: 'student',
        created_by: 1
      },
      {
        title: 'อบรมเชิงปฏิบัติการ ICT',
        description: 'อบรมการใช้เทคโนโลジีในการเรียนการสอน',
        start_date: '2025-02-20 09:00:00',
        end_date: '2025-02-20 16:00:00',
        location: 'ห้องคอมพิวเตอร์',
        responsible_person: 'ฝ่าย ICT',
        event_type: 'academic',
        target_group: 'teacher',
        created_by: 1
      },
      {
        title: 'ประชุมคณะกรรมการบุคคล',
        description: 'ประชุมพิจารณาการแต่งตั้งและโยกย้ายบุคลากร',
        start_date: '2025-02-12 09:00:00',
        end_date: '2025-02-12 12:00:00',
        location: 'ห้องประชุมผู้บริหาร',
        responsible_person: 'ฝ่ายบุคคล',
        event_type: 'hr',
        target_group: 'admin',
        created_by: 1
      },
      {
        title: 'ตรวจสอบงบประมาณประจำเดือน',
        description: 'การตรวจสอบและรายงานการใช้งบประมาณของโรงเรียน',
        start_date: '2025-02-25 13:00:00',
        end_date: '2025-02-25 16:00:00',
        location: 'ห้องการเงิน',
        responsible_person: 'ฝ่ายบริหารทั่วไป',
        event_type: 'admin',
        target_group: 'admin',
        created_by: 1
      },
      {
        title: 'ประชุมวางแผนยุทธศาสตร์โรงเรียน',
        description: 'การประชุมเพื่อวางแผนและกำหนดนโยบายการพัฒนาโรงเรียน',
        start_date: '2025-02-28 08:30:00',
        end_date: '2025-02-28 16:30:00',
        location: 'ห้องประชุมใหญ่',
        responsible_person: 'ฝ่ายนโยบายและแผน',
        event_type: 'policy_plan',
        target_group: 'admin',
        created_by: 1
      }
    ];

    sampleEvents.forEach(event => {
      db.run(`INSERT OR IGNORE INTO events (title, description, start_date, end_date, location, responsible_person, event_type, target_group, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [event.title, event.description, event.start_date, event.end_date, event.location, event.responsible_person, event.event_type, event.target_group, event.created_by]);
    });
  }, 1000);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password: '***' });

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('User found:', user ? { id: user.id, username: user.username, role: user.role } : 'No user found');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.username);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name
      }
    });
  });
});

// Get events
app.get('/api/events', authenticateToken, (req, res) => {
  const { month, year, type, target_group } = req.query;
  let query = 'SELECT * FROM events WHERE 1=1';
  const params = [];

  if (month && year) {
    query += ' AND strftime("%m", start_date) = ? AND strftime("%Y", start_date) = ?';
    params.push(month.padStart(2, '0'), year);
  }

  if (type) {
    query += ' AND event_type = ?';
    params.push(type);
  }

  if (target_group) {
    query += ' AND (target_group = ? OR target_group = "all")';
    params.push(target_group);
  }

  query += ' ORDER BY start_date ASC';

  db.all(query, params, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(events);
  });
});

// Create event
app.post('/api/events', authenticateToken, (req, res) => {
  const { title, description, start_date, end_date, location, responsible_person, event_type, target_group } = req.body;

  if (req.user.role === 'student') {
    return res.status(403).json({ error: 'Students cannot create events' });
  }

  const query = `INSERT INTO events (title, description, start_date, end_date, location, responsible_person, event_type, target_group, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [title, description, start_date, end_date, location, responsible_person, event_type, target_group, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Log history
    db.run('INSERT INTO event_history (event_id, action, user_id, changes) VALUES (?, ?, ?, ?)',
           [this.lastID, 'create', req.user.id, JSON.stringify(req.body)]);

    res.json({ id: this.lastID, message: 'Event created successfully' });
  });
});

// Update event
app.put('/api/events/:id', authenticateToken, (req, res) => {
  const eventId = req.params.id;
  const { title, description, start_date, end_date, location, responsible_person, event_type, target_group } = req.body;

  if (req.user.role === 'student') {
    return res.status(403).json({ error: 'Students cannot update events' });
  }

  const query = `UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, 
                 location = ?, responsible_person = ?, event_type = ?, target_group = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;

  db.run(query, [title, description, start_date, end_date, location, responsible_person, event_type, target_group, eventId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Log history
    db.run('INSERT INTO event_history (event_id, action, user_id, changes) VALUES (?, ?, ?, ?)',
           [eventId, 'update', req.user.id, JSON.stringify(req.body)]);

    res.json({ message: 'Event updated successfully' });
  });
});

// Delete event
app.delete('/api/events/:id', authenticateToken, (req, res) => {
  const eventId = req.params.id;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can delete events' });
  }

  db.run('DELETE FROM events WHERE id = ?', [eventId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Log history
    db.run('INSERT INTO event_history (event_id, action, user_id) VALUES (?, ?, ?)',
           [eventId, 'delete', req.user.id]);

    res.json({ message: 'Event deleted successfully' });
  });
});

// Update event status
app.put('/api/events/:id/status', authenticateToken, (req, res) => {
  const eventId = req.params.id;
  const { status, status_note } = req.body;

  if (req.user.role === 'student') {
    return res.status(403).json({ error: 'Students cannot update event status' });
  }

  const query = `UPDATE events SET status = ?, status_note = ?, status_updated_by = ?, status_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;

  db.run(query, [status, status_note, req.user.id, eventId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Log history
    db.run('INSERT INTO event_history (event_id, action, user_id, changes) VALUES (?, ?, ?, ?)',
           [eventId, 'status_update', req.user.id, JSON.stringify({ status, status_note })]);

    res.json({ message: 'Event status updated successfully' });
  });
});

// Get events by status
app.get('/api/events/status/:status', authenticateToken, (req, res) => {
  const status = req.params.status;
  
  let query = `SELECT e.*, u.full_name as status_updated_by_name 
               FROM events e 
               LEFT JOIN users u ON e.status_updated_by = u.id 
               WHERE e.status = ?`;
  const params = [status];

  // Filter by user role if not admin
  if (req.user.role !== 'admin') {
    query += ' AND (e.target_group = ? OR e.target_group = "all")';
    params.push(req.user.role);
  }

  query += ' ORDER BY e.start_date ASC';

  db.all(query, params, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(events);
  });
});

// Get event status summary
app.get('/api/events/status-summary', authenticateToken, (req, res) => {
  let query = `SELECT status, COUNT(*) as count FROM events`;
  const params = [];

  // Filter by user role if not admin
  if (req.user.role !== 'admin') {
    query += ' WHERE (target_group = ? OR target_group = "all")';
    params.push(req.user.role);
  }

  query += ' GROUP BY status';

  db.all(query, params, (err, summary) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(summary);
  });
});

// Get event history
app.get('/api/events/:id/history', authenticateToken, (req, res) => {
  const eventId = req.params.id;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const query = `SELECT eh.*, u.full_name as user_name 
                 FROM event_history eh 
                 JOIN users u ON eh.user_id = u.id 
                 WHERE eh.event_id = ? 
                 ORDER BY eh.timestamp DESC`;

  db.all(query, [eventId], (err, history) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(history);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});