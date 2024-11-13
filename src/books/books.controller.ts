import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('api/books')
export class BooksController {
  constructor(private bookSerice: BooksService) {}

  @Get()
  async getBooks(@Request() { user: { username } }) {
    return await this.bookSerice.getBooks(username);
  }

  @Get('/me')
  async getUserBooks(@Request() { user: { username } }) {
    return await this.bookSerice.getUserBooks(username);
  }

  @Post()
  async createBook(
    @Request() { user: { username } },
    @Body()
    {
      name,
      media,
      description,
    }: {
      name: string;
      media: string;
      description: string;
    },
  ) {
    return await this.bookSerice.creteBook({
      name,
      media,
      description,
      username,
    });
  }
}
