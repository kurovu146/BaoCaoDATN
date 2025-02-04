import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AppError } from 'utils/error';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      if (!user.isEmailConfirmed) {
        throw new AppError('Please confirm your email before logging in.', HttpStatus.FORBIDDEN);
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      token: this.jwtService.sign(payload),
      avatar: user.avatar,
      email: user.email,
      id: user.id,
      role: user.role
    };
  }
}
