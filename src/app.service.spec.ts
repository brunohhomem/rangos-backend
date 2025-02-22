import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppService', () => {
  let appService: AppService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('Health Check', () => {
    it('should check health status and call the database query', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue(['1']);

      await appService.getHealthCheck();

      expect(mockPrismaService.$queryRaw).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(
        expect.arrayContaining(['SELECT 1']),
      );
    });

    it('should return error message when database query fails', async () => {
      mockPrismaService.$queryRaw.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await appService.getHealthCheck();

      expect(result.database).toContain('Error ❌ - Database error');
    });
  });
});
