import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { RtmpService } from 'src/rtmp/rtmp.service';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CameraService } from './camera.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CameraController],
  providers: [CameraService]
})
export class CameraModule {}
