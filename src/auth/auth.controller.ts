import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    const user = await this.usersService.findByUsername(
      authCredentialsDto.username,
    );
    if (!user) {
      throw new Error('User not found');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() authCredentialsDto: AuthCredentialsDto) {
    const hasUserWithUsername = await this.usersService.findByUsername(
      authCredentialsDto.username,
    );
    if (hasUserWithUsername) {
      throw new ConflictException('This user already has an account');
    }

    const user = await this.usersService.create(
      authCredentialsDto.username,
      authCredentialsDto.password,
    );

    return this.authService.login(user);
  }
}
