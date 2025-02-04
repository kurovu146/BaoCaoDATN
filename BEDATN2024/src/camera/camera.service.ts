import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CameraService {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  async createCamera(streamKey: string, url: string, userId: number, lat: string, lng: string, country: string, city: string, district: string) {
    return this.prisma.camera.create({
      data: {
        streamKey,
        url,
        userId,
        lat,
        lng,
        country,
        city,
        district
      },
    });
  }

  async getAllCamera(userId?: number) {
    const whereCondition = userId ? { userId } : {};
    return this.prisma.camera.findMany({
      where: whereCondition
    });
  }

  async deleteAll() {
    return this.prisma.camera.deleteMany();
  }
}
