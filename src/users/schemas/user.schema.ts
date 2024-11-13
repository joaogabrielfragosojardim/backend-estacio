import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type UserWithId = User & { id: string };

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  cep: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
