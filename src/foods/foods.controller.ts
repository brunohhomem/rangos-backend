import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';

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
  async getFoods(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.foodsService.findByFood(
      search || '',
      Number(page),
      Number(pageSize),
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.foodsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
  //   return this.foodsService.update(+id, updateFoodDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.foodsService.remove(+id);
  // }
}
