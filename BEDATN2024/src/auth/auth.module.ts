import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/common/email.service';
import { UserGuard } from './user.guard';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      })
    }),
    PrismaModule
  ],
  providers: [AuthService, UsersService, EmailService, UserGuard],
  controllers: [AuthController],
})
export class AuthModule {}
