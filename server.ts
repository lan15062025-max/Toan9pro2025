import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';
const db = new Database('database.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    school TEXT,
    class TEXT,
    targetScore REAL,
    targetSchool TEXT,
    avatar TEXT,
    phoneNumber TEXT,
    gender TEXT,
    dateOfBirth TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    date TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    chapterId TEXT NOT NULL,
    details TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
      const result = stmt.run(email, hashedPassword, name);
      
      const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ id: result.lastInsertRowid, email, name });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ id: user.id, email: user.email, name: user.name });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user: any = db.prepare('SELECT id, email, name, school, class, targetScore, targetSchool, avatar, phoneNumber, gender, dateOfBirth FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  });

  app.put('/api/profile', authenticateToken, (req: any, res) => {
    const { name, school, class: userClass, targetScore, targetSchool, avatar, phoneNumber, gender, dateOfBirth } = req.body;
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, school = ?, class = ?, targetScore = ?, targetSchool = ?, avatar = ?, phoneNumber = ?, gender = ?, dateOfBirth = ?
      WHERE id = ?
    `);
    stmt.run(name, school, userClass, targetScore, targetSchool, avatar, phoneNumber, gender, dateOfBirth, req.user.id);
    res.json({ message: 'Profile updated' });
  });

  app.get('/api/results', authenticateToken, (req: any, res) => {
    const results = db.prepare('SELECT * FROM quiz_results WHERE userId = ? ORDER BY date DESC LIMIT 50').all(req.user.id);
    res.json(results.map((r: any) => ({ ...r, details: JSON.parse(r.details) })));
  });

  app.post('/api/results', authenticateToken, (req: any, res) => {
    const { date, score, total, chapterId, details } = req.body;
    const stmt = db.prepare('INSERT INTO quiz_results (userId, date, score, total, chapterId, details) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(req.user.id, date, score, total, chapterId, JSON.stringify(details));
    res.json({ message: 'Result saved' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
