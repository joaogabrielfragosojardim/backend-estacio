import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: User) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
