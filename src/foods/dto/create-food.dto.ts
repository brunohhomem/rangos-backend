import { FoodSource } from '@prisma/client';
import { Food } from '../entities/food.entity';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateFoodDto extends Food {
  @IsString()
  food: string;

  @IsEnum(FoodSource)
  foodSource: FoodSource;

  @IsNumber()
  calories: number;

  @IsNumber()
  carbohydrate: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  lipids: number;

  @IsNumber()
  cholesterol: number;

  @IsNumber()
  fiber: number;

  @IsBoolean()
  isVeg: boolean;

  @IsBoolean()
  isVegan: boolean;
}
