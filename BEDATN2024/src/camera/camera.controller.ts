import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/auth/user.guard';
import { CameraService } from './camera.service';

@Controller('cameras')
export class CameraController {
  constructor(
    private readonly cameraService: CameraService
  ) {}

  @UseGuards(UserGuard)
  @Post()
  async createCamera(@Body() body) {
    return this.cameraService.createCamera(body.streamKey, body.url, body.userId, body.lat, body.lng, body.country, body.city, body.district);
  }

  @UseGuards(UserGuard)
  @Get()
  async getAllCamera(@Query() body) {
    return this.cameraService.getAllCamera(+body.userId);
  }

  @Delete()
  deleteAll() {
    return this.cameraService.deleteAll();
  }
}
