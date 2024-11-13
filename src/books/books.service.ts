import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/books/schemas/book.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>,
    private userService: UsersService,
  ) {}

  async getBooks(username: string) {
    const user = await this.userService.findByUsername(username);
    const books = await this.bookModel.find({ userId: { $ne: user.id } });
    return books;
  }

  async getUserBooks(username: string) {
    const user = await this.userService.findByUsername(username);
    const books = await this.bookModel.find({ userId: user.id });
    return books;
  }

  async creteBook({
    name,
    media,
    description,
    username,
  }: {
    name: string;
    media: string;
    description: string;
    username: string;
  }) {
    const user = await this.userService.findByUsername(username);

    const createBook = new this.bookModel({
      name,
      media,
      description,
      userId: user.id,
    });
    return createBook.save();
  }
}
