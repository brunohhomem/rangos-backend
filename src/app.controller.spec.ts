import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  const mockAppService = {
    getHealthCheck: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getHealthCheck', async () => {
    await controller.getHealthCheck();

    expect(mockAppService.getHealthCheck).toHaveBeenCalledTimes(1);
    expect(mockAppService.getHealthCheck).toHaveBeenCalledWith();
    expect(mockAppService.getHealthCheck).toHaveReturned();
  });
});
