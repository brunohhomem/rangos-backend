import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { Food } from './entities/food.entity';

@Controller('/api/v1/foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @Get('food')
  async findFoods(
    @Query('search') search: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('orderBy') orderBy: keyof Food = 'food',
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('isVeg') isVeg?: string,
    @Query('isVegan') isVegan?: string,
  ) {
    return await this.foodsService.findFoods(
      search || '',
      Number(page),
      Number(pageSize),
      orderBy,
      order,
      isVeg ? isVeg === 'true' : undefined,
      isVegan ? isVegan === 'true' : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findById(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
  //   return this.foodsService.update(+id, updateFoodDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(+id);
  }
}
