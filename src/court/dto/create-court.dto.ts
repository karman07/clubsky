import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  activity: string;
}
