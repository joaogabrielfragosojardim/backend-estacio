import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { Public } from 'src/constants';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @Public()
  @Post('login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    const user = await this.usersService.findFullUserByUsername(
      authCredentialsDto.username,
    );
    if (
      !user ||
      !(await bcrypt.compare(authCredentialsDto.password, user.password))
    ) {
      throw new UnauthorizedException('Usuário ou senha inválido');
    }
    return this.authService.login(user);
  }
  @Public()
  @Post('register')
  async register(
    @Body()
    authCredentialsDto: AuthCredentialsDto & {
      city: string;
      state: string;
      cep: string;
    },
  ) {
    const hasUserWithUsername = await this.usersService.findByUsername(
      authCredentialsDto.username,
    );
    if (hasUserWithUsername) {
      throw new ConflictException('This user already has an account');
    }

    const user = await this.usersService.create({
      username: authCredentialsDto.username,
      password: authCredentialsDto.password,
      city: authCredentialsDto.city,
      state: authCredentialsDto.state,
      cep: authCredentialsDto.cep,
    });

    return this.authService.login(user);
  }
}
