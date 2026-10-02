import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4001;
const DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_FILE = path.join(DATA_DIR, 'counters.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

type Counters = Record<string, number>;

function readCounters(): Counters {
  try {
    if (!fs.existsSync(DATA_FILE)) return Object.create(null) as Counters;
    const data: unknown = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) return Object.create(null) as Counters;
    const counters: Counters = Object.create(null);
    for (const [bookId, count] of Object.entries(data)) {
      if (typeof count === 'number' && Number.isFinite(count) && count >= 0) {
        counters[bookId] = count;
      }
    }
    return counters;
  } catch {
    return Object.create(null) as Counters;
  }
}

function writeCounters(counters: Counters): void {
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