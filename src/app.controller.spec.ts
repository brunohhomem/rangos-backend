import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

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

    appController = module.get<AppController>(AppController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('getHealthCheck', async () => {
    await appController.getHealthCheck();

    expect(mockAppService.getHealthCheck).toHaveBeenCalledTimes(1);
    expect(mockAppService.getHealthCheck).toHaveBeenCalledWith();
    expect(mockAppService.getHealthCheck).toHaveReturned();
  });
});
