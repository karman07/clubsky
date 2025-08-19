import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  hours: number;

  @IsNumber()
  price: number;
}
