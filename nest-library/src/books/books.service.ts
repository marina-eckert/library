import { Injectable } from '@nestjs/common';
import { Book } from './book';

@Injectable()
export class BooksService {
  private readonly books: Book[] = [
    {
      id: 1,
      title: 'Мастер и Маргарита',
      description: 'Роман Михаила Булгакова',
      authors: 'Михаил Булгаков',
      favorite: false,
      fileCover: '',
      fileName: '',
      fileBook: '',
    },
    {
      id: 2,
      title: 'Евгений Онегин',
      description: 'Роман в стихах',
      authors: 'Александр Пушкин',
      favorite: true,
      fileCover: '',
      fileName: '',
      fileBook: '',
    },
  ];

  getBooks(): Book[] {
    return this.books.map((book) => ({ ...book }));
  }

  getBook(id: number): Book | undefined {
    const book = this.books.find((book) => book.id === id);
    return book ? { ...book } : undefined;
  }
}
