import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
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
  @ValidateNested({ each: true })
  @Type(() => Array)
  timeSlots: number[][];

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  paidAmount: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  paymentId: string;

  @IsString()
  orderId: string;

  @IsString()
  paymentSignature: string;

  @IsString()
  paymentStatus: string;
}
