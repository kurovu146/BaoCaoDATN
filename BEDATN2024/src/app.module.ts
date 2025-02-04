import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CameraModule } from './camera/camera.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecordModule } from './record/record.module';
import { RtmpModule } from './rtmp/rtmp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để các biến môi trường có thể truy cập toàn bộ ứng dụng
    }),
    CameraModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    RtmpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
