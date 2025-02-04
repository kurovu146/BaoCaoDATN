import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { RtmpService } from "./rtmp.service";
import { AppError } from "utils/error";
import { RecordService } from "src/record/record.service";

@Controller('rtmp')
export class RtmpController {
  constructor(
    private readonly rtmpService: RtmpService,
    private readonly recordService: RecordService
  ) {}

  // @UseGuards(UserGuard)
  @Post('start')
  async startRecording(
    @Body('body') body: any
  ) {
    if (!body.streamKey) {
      throw new AppError('Stream path is required', HttpStatus.BAD_REQUEST);
    }
    return this.rtmpService.startRecord(body.userId, body.streamKey);
  }

  // @UseGuards(UserGuard)
  @Post('stop')
  async stopRecording(@Body('body') body: any) {
    if (!body.streamKey) {
      throw new AppError('Stream path is required', HttpStatus.BAD_REQUEST);
    }
    await this.rtmpService.stopRecord(body.streamKey);
    return { message: 'Recording stopped' };
  }
}