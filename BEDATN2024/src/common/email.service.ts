import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Hoặc cấu hình SMTP phù hợp
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${process.env.API_URL}/api/auth/confirm?token=${token}`;
    await this.transporter.sendMail({
      from: '"Your App" <your-email@gmail.com>',
      to: email,
      subject: 'Email Confirmation',
      text: `Please confirm your email by clicking on the following link: ${confirmUrl}`,
      html: ` <div>Please confirm your email by clicking on the following link:</div>
              <a href="${confirmUrl}">Confirm your email</a>
            `,
    });
  }
}
