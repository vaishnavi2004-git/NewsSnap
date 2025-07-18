const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'your_jwt_secret'; // Use env var in production
const db = new sqlite3.Database('./news-summary.db');

// Create tables if not exist
// Users
// Saved stories

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);
db.run(`CREATE TABLE IF NOT EXISTS saved_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  headline TEXT,
  summary TEXT,
  url TEXT,
  category TEXT,
  image TEXT
)`);

// News API route (update)
app.get('/api/news', async (req, res) => {
  // Accept category, q (search), state, city
  let { category, q, state, city } = req.query;
  try {
    // Compose search query
    let searchTerms = [];
    if (city) searchTerms.push(city);
    if (state) searchTerms.push(state);
    if (q) searchTerms.push(q);
    let searchString = searchTerms.join(' ').trim();
    let url = `https://newsdata.io/api/1/news?apikey=pub_c97ab7221ff1461d830873d445b6bcc0&country=in&language=en,hi`;
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));