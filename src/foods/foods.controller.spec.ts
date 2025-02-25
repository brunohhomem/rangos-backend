import { Test, TestingModule } from '@nestjs/testing';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';

describe('FoodsController', () => {
  let foodsController: FoodsController;

  const mockFoodService = {};

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
});
