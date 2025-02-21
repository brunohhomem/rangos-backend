import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserError } from './errors/user.error';

describe('UserService', () => {
  let userService: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const userDto: CreateUserDto = {
    name: 'Butters',
    email: 'butters@email.com',
    password: 'sacheDe@Atum2',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('User already exists', async () => {
      mockPrismaService.user.findUnique.mockReturnValueOnce(userDto);

      try {
        await userService.create(userDto);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(UserError);
        expect(error.message).toBe('User already exists');
      }

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userDto.email },
      });

      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(0);
    });

    it('Create User', async () => {
      mockPrismaService.user.findUnique.mockReturnValueOnce(null);

      await userService.create(userDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userDto.email },
      });

      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: userDto.email,
          name: userDto.name,
          password: expect.any(String), //Valida que é uma string (hash)
        },
      });

      // Confirma que o hash gerado é diferente da senha original
      const { password: hashedPassword } =
        mockPrismaService.user.create.mock.calls[0][0].data;
      expect(hashedPassword).not.toBe(userDto.password);
    });
  });

  it('Find By Email', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(userDto);

    const user = await userService.findByEmail(userDto.email);

    expect(user).toEqual(expect.objectContaining(userDto));
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: userDto.email },
    });
  });
});
