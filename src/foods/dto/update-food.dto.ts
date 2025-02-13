import { PartialType } from '@nestjs/swagger';
import { CreateFoodDto } from './create-food.dto';
import { IsBoolean } from 'class-validator';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @IsBoolean()
  isActive: boolean;
}
