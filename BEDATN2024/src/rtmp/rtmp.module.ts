import { Module } from '@nestjs/common';
import { RtmpService } from 'src/rtmp/rtmp.service';
import { RtmpController } from './rtmp.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { RecordModule } from 'src/record/record.module';

@Module({
  controllers: [RtmpController],
  providers: [RtmpService],
  imports: [PrismaModule, RecordModule],
  exports: [RtmpService]
})
export class RtmpModule {}
