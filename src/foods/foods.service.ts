import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFoodDto: CreateFoodDto) {
    const data = createFoodDto;

    const createdFood = await this.prisma.food.create({ data });

    return { createdFood };
  }

  async findAll() {
    return await this.prisma.food.findMany();
  }

  async findById(id: number) {
    return await this.prisma.food.findUnique({
      where: { id },
    });
  }

  findByFood(food: string, page: number = 1, pageSize: number = 10) {
    return this.prisma.food.findMany({
      where: {
        food: { contains: food, mode: 'insensitive' },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  // update(id: number, updateFoodDto: UpdateFoodDto) {
  //   return `This action updates a #${id} food`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} food`;
  // }
}
