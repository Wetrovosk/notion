const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Set up EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./glucose_tracker.db');

// Create tables
db.serialize(() => {
  // Food intake table
  db.run(`CREATE TABLE IF NOT EXISTS food_intake (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_name TEXT NOT NULL,
    description TEXT,
    carbs REAL,
    protein REAL,
    fat REAL,
    calories REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Water intake table
  db.run(`CREATE TABLE IF NOT EXISTS water_intake (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount_ml INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Glucose readings table
  db.run(`CREATE TABLE IF NOT EXISTS glucose_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reading INTEGER NOT NULL,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Combined tracking table
  db.run(`CREATE TABLE IF NOT EXISTS tracking_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_type TEXT NOT NULL, -- 'food', 'water', 'glucose'
    meal_name TEXT,
    description TEXT,
    carbs REAL,
    protein REAL,
    fat REAL,
    calories REAL,
    amount_ml INTEGER,
    glucose_reading INTEGER,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/tracking-entries', (req, res) => {
  const { startDate, endDate, type } = req.query;
  let sql = 'SELECT * FROM tracking_entries';
  const conditions = [];
  const params = [];

  if (startDate && endDate) {
    conditions.push('timestamp BETWEEN ? AND ?');
    params.push(startDate, endDate);
  }

  if (type) {
    conditions.push('entry_type = ?');
    params.push(type);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY timestamp DESC LIMIT 50';

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/food', (req, res) => {
  const { meal_name, description, carbs, protein, fat, calories } = req.body;
  
  // Insert into food_intake table
  const stmt1 = db.prepare('INSERT INTO food_intake (meal_name, description, carbs, protein, fat, calories) VALUES (?, ?, ?, ?, ?, ?)');
  stmt1.run([meal_name, description, carbs, protein, fat, calories]);
  stmt1.finalize();

  // Insert into tracking_entries table
  const stmt2 = db.prepare('INSERT INTO tracking_entries (entry_type, meal_name, description, carbs, protein, fat, calories) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt2.run(['food', meal_name, description, carbs, protein, fat, calories]);
  stmt2.finalize();

  res.json({ message: 'Food entry added successfully' });
});

app.post('/api/water', (req, res) => {
  const { amount_ml } = req.body;
  
  // Insert into water_intake table
  const stmt1 = db.prepare('INSERT INTO water_intake (amount_ml) VALUES (?)');
  stmt1.run([amount_ml]);
  stmt1.finalize();

  // Insert into tracking_entries table
  const stmt2 = db.prepare('INSERT INTO tracking_entries (entry_type, amount_ml) VALUES (?, ?)');
  stmt2.run(['water', amount_ml]);
  stmt2.finalize();

  res.json({ message: 'Water entry added successfully' });
});

app.post('/api/glucose', (req, res) => {
  const { reading, notes } = req.body;
  
  // Insert into glucose_readings table
  const stmt1 = db.prepare('INSERT INTO glucose_readings (reading, notes) VALUES (?, ?)');
  stmt1.run([reading, notes]);
  stmt1.finalize();

  // Insert into tracking_entries table
  const stmt2 = db.prepare('INSERT INTO tracking_entries (entry_type, glucose_reading, notes) VALUES (?, ?, ?)');
  stmt2.run(['glucose', reading, notes]);
  stmt2.finalize();

  res.json({ message: 'Glucose reading added successfully' });
});

app.get('/entries', (req, res) => {
  res.render('entries');
});

app.get('/stats', (req, res) => {
  res.render('stats');
});

// Start server
app.listen(PORT, () => {
  console.log(`Glucose Tracker app listening at http://localhost:${PORT}`);
});