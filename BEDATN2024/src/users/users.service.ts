import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { AppError } from 'utils/error';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService
  ) {}
  
  async create(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const confirmationToken = randomBytes(32).toString('hex');
    const newUser: Prisma.UserCreateInput = {
      email: user.email,
      password: hashedPassword,
      isEmailConfirmed: false,
      confirmationToken,
    };

    await this.prisma.user.create({data: newUser});
    return newUser;
  }

  async findOne(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email
      }
    });
  }

  async findByConfirmationToken(token: string) {
    return this.prisma.user.findFirst({
      where: {
        confirmationToken: token
      }
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    try {
      await this.prisma.user.update({where: { id }, data });

      return `Update user ID: ${id} successfully!`;
    } catch (error) {
      throw new AppError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async confirmEmail(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (user) {
      await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          confirmationToken: null,
          isEmailConfirmed: true
        },
      })
    }

    return user;
  }
}
