import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getMe(@Request() { user: { username } }) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put('/me/edit')
  async editMe(
    @Request() { user: { username } },
    @Body()
    {
      username: bodyUsername,
      city,
      state,
      cep,
    }: {
      username: string;
      city: string;
      state: string;
      cep: string;
    },
  ) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.usersService.edit({
      id: user.id,
      city,
      state,
      cep,
      username: bodyUsername,
    });
  }
}
