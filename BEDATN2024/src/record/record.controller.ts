import { Body, Controller, Post } from "@nestjs/common";
import { CreateRecordDTO } from "./dto/create-record.dto";
import { RecordService } from "./record.service";


@Controller('records')
export class RecordController {
  constructor(
    private recordService: RecordService
  ) {}
  @Post()
  async create(@Body() data: CreateRecordDTO) {
    return this.recordService.create(data);
  }
}
