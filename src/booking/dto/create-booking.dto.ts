import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  courtId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsArray()
  @Type(() => Array)
  timeSlots: number[][];

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  paidAmount: number;
}
