import type { BookForm, BookData } from "../../types/book-form";
import express from "express";
import path from "path";
import fs from "fs";
import Book from "../../models/book";
import upload from "../../middleware/upload";

const router = express.Router();

function getBookData(body: BookForm): BookData {
  return {
    title: body.title,
    description: body.description || '',
    authors: body.authors || '',
    favorite: body.favorite === true || body.favorite === 'true' || body.favorite === 'on',
    fileCover: body.fileCover || '',
    fileName: body.fileName || ''
  };
}

router.get('/', async (_req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });

    if (!book || !book.fileBook) {
      return res.status(404).send('Book file not found');
    }

    const filePath = path.join(__dirname, '../../../uploads', book.fileBook);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Book file not found');
    }

    return res.download(filePath, book.fileName || book.fileBook);
  } catch (error) {
    return res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    return res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

router.post('/', upload.single('fileBook'), async (req, res) => {
  try {
    const data = getBookData(req.body);

    if (!data.title) {
      return res.status(400).json({ error: 'title is required' });
    }

    if (req.file) {
      data.fileBook = req.file.filename;
      data.fileName = req.file.originalname;
    }

    const book = await Book.create(data);
    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

router.put('/:id', upload.single('fileBook'), async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const data = getBookData(req.body);

    Object.assign(book, data);

    if (req.file) {
      if (book.fileBook) {
        const oldPath = path.join(__dirname, '../../../uploads', book.fileBook);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      book.fileBook = req.file.filename;
      book.fileName = req.file.originalname;
    }

    await book.save();
    return res.json(book);
  } catch (error) {
    return res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.fileBook) {
      const filePath = path.join(__dirname, '../../../uploads', book.fileBook);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Book.deleteOne({ id: req.params.id });
    return res.send('ok');
  } catch (error) {
    return res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

export default router;