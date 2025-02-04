import { IsNumber, IsString } from "class-validator";

export class CreateRecordDTO {
  @IsNumber()
  userId: number;

  @IsString()
  url: string;
}