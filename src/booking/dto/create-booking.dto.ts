import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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

  // NOTE: controller normalizes timeSlots; keep optional validation here if used elsewhere
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  timeSlots?: number[][];

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  orderId?: string;

  @IsString()
  @IsOptional()
  paymentSignature?: string;

  @IsString()
  @IsOptional()
  paymentStatus?: string;
}
