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

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
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
        email: 'butters@email.com',
        name: 'Butters',
        password: await bcrypt.hash('sacheDe@Atum2', 10),
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
        email: 'butters@email.com',
        name: 'Butters',
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
        email: 'butters@email.com',
        name: 'Butters',
        password: 'sacheDe@Atum2', // Adicione esta linha
      };

      const result = authService.login(mockUser);

      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'butters@email.com',
        name: 'Butters',
      });
    });
  });
});
