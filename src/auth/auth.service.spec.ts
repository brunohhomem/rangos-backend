import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_jwt_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validate user', () => {
    it('should return user without password when credentials are correct', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
        isActive: true,
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);

      const result = await authService.validateUser(
        mockUser.email,
        mockUser.password,
      );

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: undefined,
        createdAt: expect.any(Date),
        isActive: true,
      });
    });

    it('should throw unauthorized error when credentials are incorrect', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.validateUser('invalid@example.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('login', () => {
    it('should generate a valid JTW token', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        password: 'hashedpassword123', // Adicione esta linha
      };

      const result = authService.login(mockUser);

      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
        name: 'Test',
      });
    });
  });
});
