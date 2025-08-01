import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://newsnap-client.onrender.com' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Configuration
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'pub_c97ab7221ff1461d830873d445b6bcc0';

// Database setup
const db = new sqlite3.Database(
  process.env.NODE_ENV === 'production'
    ? '/data/news-summary.db'
    : './news-summary.db',
  (err) => {
    if (err) {
      console.error('Database connection error:', err);
      process.exit(1);
    }
    console.log('Connected to SQLite database');
  }
);

// Create tables if not exist
db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created/verified');
  });

  // Create saved_stories table
  db.run(`CREATE TABLE IF NOT EXISTS saved_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    headline TEXT,
    summary TEXT,
    url TEXT,
    category TEXT,
    image TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating saved_stories table:', err);
      return;
    }
    console.log('Saved_stories table created/verified');
  });
}); // End of db.serialize()

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// News API route (update)
app.get('/api/news', async (req, res, next) => {
  // Accept category, q (search), state, city
  let { category, q, state, city } = req.query;
  try {
    // Compose search query
    let searchTerms = [];
    if (city) searchTerms.push(city);
    if (state) searchTerms.push(state);
    if (q) searchTerms.push(q);
    let searchString = searchTerms.join(' ').trim();
    let url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=in&language=en,hi`;
    if (category) url += `&category=${category}`;
    if (searchString) url += `&q=${encodeURIComponent(searchString)}`;
    
    const response = await axios.get(url);
    // Summarize: get first 2 sentences from description
    const summarized = response.data.results.map(article => ({
      headline: article.title,
      summary: article.description
        ? article.description.split('. ').slice(0, 2).join('. ') + '.'
        : '',
      url: article.link,
      category: article.category,
      image: article.image_url,
    }));
    res.json(summarized);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    const token = jwt.sign({ id: this.lastID, username }, SECRET);
    res.json({ token });
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username }, SECRET);
    res.json({ token });
  });
});

// Middleware to verify JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Save a story
app.post('/api/saved', auth, (req, res) => {
  const { headline, summary, url, category, image } = req.body;
  db.run(
    'INSERT INTO saved_stories (user_id, headline, summary, url, category, image) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, headline, summary, url, category, image],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to save' });
      res.json({ success: true });
    }
  );
});

// Get saved stories
app.get('/api/saved', auth, (req, res) => {
  db.all('SELECT * FROM saved_stories WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch' });
    res.json(rows);
  });
});

// Root test route
app.get('/', (req, res) => res.send('API running'));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});