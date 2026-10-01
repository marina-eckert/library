import express, { Request, Response } from "express";
import { container } from "../container";
import { BooksRepository } from "../repositories/books-repository";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const repo = container.get(BooksRepository);
  const books = repo.getBooks();

  res.json(books);
});

router.get("/:id", (req: Request, res: Response) => {
  const repo = container.get(BooksRepository);
  const id = Number(req.params.id);

  const book = repo.getBook(id);

  if (!book) {
    res.status(404).json({
      message: "Book not found",
    });
    return;
  }

  res.json(book);
});

export default router;
