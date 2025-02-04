import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AppError extends HttpException {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
  ) {
    super(
      message,
      statusCode,
    );
  }
}
