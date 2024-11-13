import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

export type BookWithId = Book & { id: string };

@Schema()
export class Book {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  media: string;

  @Prop({ required: true })
  userId: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
