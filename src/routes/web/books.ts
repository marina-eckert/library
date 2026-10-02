import express from "express";
import Book from "../../models/book";

const router = express.Router();

async function getCounter(bookId: string): Promise<number | null> {
  const counterUrl = process.env.COUNTER_URL || 'http://localhost:4001';

  try {
    await fetch(`${counterUrl}/counter/${bookId}/incr`, { method: 'POST' });
    const response = await fetch(`${counterUrl}/counter/${bookId}`);
    const data = await response.json() as { count?: number };
    return data.count || 0;
  } catch (error) {
    console.error('Counter service is unavailable:', (error instanceof Error ? error.message : String(error)));
    return null;
  }
}

router.get('/', async (_req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.render('index', { books, user: _req.user });
});

router.get('/books/create', (_req, res) => {
  res.render('create', { user: _req.user });
});

router.get('/books/:id/edit', async (req, res) => {
  const book = await Book.findOne({ id: req.params.id });

  if (!book) return res.status(404).send('Book not found');

  res.render('update', { book, user: req.user });
});

router.get('/books/:id', async (req, res) => {
  const book = await Book.findOne({ id: req.params.id });

  if (!book) return res.status(404).send('Book not found');

  const views = await getCounter(book.id);

  res.render('view', {
    book,
    views,
    user: req.user
  });
});

export default router;