import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from './foods.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FoodsService', () => {
  let foodsService: FoodsService;

  const mockPrismaService = {
    food: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    foodsService = module.get<FoodsService>(FoodsService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(foodsService).toBeDefined();
  });
});
