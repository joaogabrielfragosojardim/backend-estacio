import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/schemas/user.schema';
import { BooksModule } from './books/books.module';
import { Book, BookSchema } from './books/schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://estacio-projeto:mongo-estacio@cluster0.f3y5o.mongodb.net/app-estacio',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
    ]),
    AuthModule,
    UsersModule,
    BooksModule,
  ],
})
export class AppModule {}
