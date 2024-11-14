import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserWithId } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create({
    phone,
    username,
    password,
    city,
    state,
    cep,
  }: {
    phone: string;
    username: string;
    password: string;
    city: string;
    state: string;
    cep: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username,
      password: hashedPassword,
      city,
      state,
      cep,
      phone,
    });
    return createdUser.save();
  }

  async edit({
    id,
    username,
    city,
    state,
    cep,
    phone,
  }: {
    id: string;
    username?: string;
    city?: string;
    state?: string;
    cep?: string;
    phone?: string;
  }): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { username, city, state, cep, phone },
        { new: true },
      )
      .select('-password')
      .exec();
  }

  async findByUsername(username: string): Promise<UserWithId | undefined> {
    const user = await this.userModel
      .findOne({ username })
      .select('-password')
      .lean()
      .exec();
    if (!user) return undefined;
    const id = user._id as string;
    return { ...user, id };
  }

  async findbyId(id: string): Promise<UserWithId | undefined> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .lean()
      .exec();
    if (!user) return undefined;
    return { ...user, id };
  }

  async findFullUserByUsername(
    username: string,
  ): Promise<UserWithId | undefined> {
    const user = await this.userModel.findOne({ username }).lean().exec();
    const id = user._id as string;
    return { ...user, id };
  }
}
