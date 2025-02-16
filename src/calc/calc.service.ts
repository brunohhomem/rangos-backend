import { Injectable } from '@nestjs/common';
import { FoodsService } from 'src/foods/foods.service';
import { FoodData } from './models/FoodData';
import { CalculationError } from './errors/calculation.error';

@Injectable()
export class CalcService {
  constructor(private readonly foodService: FoodsService) {}

  async FoodWeight(foodId: number, foodQuantity: number): Promise<FoodData> {
    const food = await this.foodService.findById(foodId);

    if (foodQuantity === 0 || foodQuantity === null) {
      throw new CalculationError('Food quantity invalid!');
    }

    if (!food) {
      throw new CalculationError(`Food id: ${foodId}, not found!`);
    }

    const factor = foodQuantity / 100;

    return {
      id: food.id,
      food: food.food,
      calories: food.calories * factor,
      carbohydrate: food.carbohydrate * factor,
      protein: food.protein * factor,
      lipids: food.lipids * factor,
      cholesterol: food.cholesterol * factor,
      fiber: food.fiber * factor,
    };
  }
}
