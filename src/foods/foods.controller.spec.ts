import { Test, TestingModule } from '@nestjs/testing';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodSource } from '@prisma/client';
import { Food } from './entities/food.entity';

describe('FoodsController', () => {
  let foodsController: FoodsController;

  const mockFoodService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findFoods: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  };

  const foodDto: CreateFoodDto = {
    food: 'Alimento X',
    foodSource: FoodSource.TACO,
    calories: 99,
    carbohydrate: 99,
    protein: 99,
    lipids: 99,
    cholesterol: 99,
    fiber: 99,
    isVeg: true,
    isVegan: true,
    isActive: true,
    createdAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsController],
      providers: [
        {
          provide: FoodsService,
          useValue: mockFoodService,
        },
      ],
    }).compile();

    foodsController = module.get<FoodsController>(FoodsController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(foodsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new food', async () => {
      await foodsController.create(foodDto);

      expect(mockFoodService.create).toHaveBeenCalledTimes(1);
      expect(mockFoodService.create).toHaveBeenCalledWith(foodDto);
    });
  });

  describe('find', () => {
    it('should list all foods', async () => {
      await foodsController.findAll();

      expect(mockFoodService.findAll).toHaveBeenCalledTimes(1);
      expect(mockFoodService.findAll).toHaveReturned();
    });

    it('should find a food', async () => {
      await foodsController.findOne('1');

      expect(mockFoodService.findById).toHaveBeenCalledTimes(1);
      expect(mockFoodService.findById).toHaveBeenCalledWith(Number('1'));
      expect(mockFoodService.findById).toHaveReturned();
    });

    it('should list foods with query parameters', async () => {
      const mockQuery = {
        search: 'apple',
        page: '2',
        pageSize: '5',
        orderBy: 'name' as keyof Food,
        order: 'desc',
        isVeg: 'true',
        isVegan: 'false',
      };

      await foodsController.findFoods(
        mockQuery.search,
        mockQuery.page,
        mockQuery.pageSize,
        mockQuery.orderBy,
        mockQuery.order as 'asc' | 'desc',
        mockQuery.isVeg,
        mockQuery.isVegan,
      );

      expect(mockFoodService.findFoods).toHaveBeenCalledTimes(1);
      expect(mockFoodService.findFoods).toHaveBeenCalledWith(
        'apple', // search
        2, // page
        5, // pageSize
        'name', // orderBy
        'desc', // order
        true, // isVeg
        false, // isVegan
      );
    });

    it('should call service with default values when no query params are provided', async () => {
      await foodsController.findFoods(
        '',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );

      expect(mockFoodService.findFoods).toHaveBeenCalledTimes(1);
      expect(mockFoodService.findFoods).toHaveBeenCalledWith(
        '', // search default
        1, // default page
        10, // default pageSize
        'food', // default orderBy
        'asc', // default order
        undefined, // isVeg default
        undefined, // isVegan default
      );
    });
  });

  describe('remove', () => {
    it('should remove a requested food by id', () => {
      foodsController.remove('1');

      expect(mockFoodService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
