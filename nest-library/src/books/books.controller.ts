import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    const book = this.booksService.getBook(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
}
