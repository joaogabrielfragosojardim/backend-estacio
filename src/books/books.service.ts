import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async editBook({
    name,
    media,
    description,
    username,
    id,
  }: {
    name: string;
    media: string;
    description: string;
    username: string;
    id: string;
  }) {
    const user = await this.userService.findByUsername(username);

    return this.bookModel
      .findByIdAndUpdate(
        id,
        { name, media, description, userId: user.id },
        { new: true },
      )
      .exec();
  }

  async deleteBook({ id, username }: { id: string; username: string }) {
    const user = await this.userService.findByUsername(username);

    const book = await this.bookModel.findById(id).exec();

    if (!book) {
      throw new ConflictException('Livro não encontrado');
    }

    if (book.userId.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar este livro',
      );
    }

    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
