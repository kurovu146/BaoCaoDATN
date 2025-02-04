import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRecordDTO } from './dto/create-record.dto';

@Injectable()
export class RecordService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(data: CreateRecordDTO) {
    return this.prisma.record.create({data});
  }
}
