import { FoodSource } from '@prisma/client';

export class Food {
  id?: number;
  food: string;
  foodSource: FoodSource;
  calories: number;
  carbohydrate: number;
  protein: number;
  lipids: number;
  cholesterol: number;
  fiber: number;
  isVeg: boolean;
  isVegan: boolean;
  createdAt: Date;
  isActive: boolean;
}
