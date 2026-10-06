import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book } from './book';
import { CreateBookDto, UpdateBookDto } from './book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  getBooks() {
    return this.bookModel.find().exec();
  }

  private validateId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid book ID');
    }
  }

  async getBook(id: string) {
    this.validateId(id);
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  createBook(data: CreateBookDto) {
    return this.bookModel.create(data);
  }

  async updateBook(id: string, data: UpdateBookDto) {
    this.validateId(id);
    const book = await this.bookModel
      .findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async deleteBook(id: string) {
    this.validateId(id);
    const book = await this.bookModel.findByIdAndDelete(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
}
