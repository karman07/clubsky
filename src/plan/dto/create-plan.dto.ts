import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNumber()
  @IsNotEmpty()
  hours: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
