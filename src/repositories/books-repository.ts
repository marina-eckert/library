import { injectable } from "inversify";
import { Book } from "../types/book";

@injectable()
export class BooksRepository {
  private books: Book[] = [];

  createBook(book: Book): void {
    this.books.push(book);
  }

  getBook(id: number): Book | null {
    return this.books.find((book) => book.id === id) || null;
  }

  getBooks(): Book[] {
    return this.books;
  }

  updateBook(id: number, updatedBook: Book): void {
    const index = this.books.findIndex((book) => book.id === id);

    if (index !== -1) {
      this.books[index] = updatedBook;
    }
  }

  deleteBook(id: number): void {
    this.books = this.books.filter((book) => book.id !== id);
  }
}
