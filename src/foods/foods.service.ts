import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Food } from './entities/food.entity';

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

  findByFood(
    food: string,
    page: number = 1,
    pageSize: number = 10,
    orderBy: keyof Food = 'food',
    order: 'asc' | 'desc' = 'asc',
    isVeg?: boolean,
    isVegan?: boolean,
  ) {
    return this.prisma.food.findMany({
      where: {
        food: { contains: food, mode: 'insensitive' },
        isActive: true, // Apenas alimentos ativos
        ...(isVeg !== undefined && { isVeg }),
        ...(isVegan !== undefined && { isVegan }),
      },
      orderBy: { [orderBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  // update(id: number) {
  //   const food = this.prisma.food.update({
  //     where: {id},
  //   })

  // }

  remove(id: number) {
    this.prisma.food.delete({
      where: { id },
    });
  }
}
