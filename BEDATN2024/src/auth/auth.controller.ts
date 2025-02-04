import { Controller, Post, Body, Query, UnauthorizedException, UseGuards, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/common/email.service';
import { AppError } from '../../utils/error';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @Post('signup')
  async signup(@Body() user) {
    const newUser = await this.usersService.create(user);
    await this.emailService.sendConfirmationEmail(newUser.email, newUser.confirmationToken);

    return { message: 'Registration successful. Please check your email to confirm your account.' };
  }

  @Post('login')
  async login(@Body() req) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      throw new AppError('Email or password is invalid!', HttpStatus.NOT_FOUND);
    }
    
    return this.authService.login(user);
  }

  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    const user = await this.usersService.findByConfirmationToken(token);
    if (!user) {
      return { message: 'Invalid confirmation token' };
    }
    await this.usersService.confirmEmail(user.id);
    
    return { message: 'Email confirmed successfully' };
  }
}
