import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/AuthRequest';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  const user = {
    email: 'butters@email.com',
    password: 'sacheDe@Atum2',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should login', () => {
    const req: AuthRequest = { user } as AuthRequest;

    mockAuthService.login.mockReturnValue({ access_token: 'mocked_token' });

    const result = authController.login(req);

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ access_token: 'mocked_token' });
  });
});
