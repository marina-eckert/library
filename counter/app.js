const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4001;
const DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_FILE = path.join(DATA_DIR, 'counters.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

function readCounters() {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeCounters(counters) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(counters, null, 2));
}

app.post('/counter/:bookId/incr', (req, res) => {
  const counters = readCounters();
  counters[req.params.bookId] = (counters[req.params.bookId] || 0) + 1;
  writeCounters(counters);

  res.json({
    bookId: req.params.bookId,
    count: counters[req.params.bookId]
  });
});

app.get('/counter/:bookId', (req, res) => {
  const counters = readCounters();

  res.json({
    bookId: req.params.bookId,
    count: counters[req.params.bookId] || 0
  });
});

app.listen(PORT, () => {
  console.log(`Counter service is running on port ${PORT}`);
});