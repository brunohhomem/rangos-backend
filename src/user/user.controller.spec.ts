import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        name: 'Butters',
        email: 'butter@email.com',
        password: 'sacheDe@Atum2',
      };

      await userController.create(userDto);

      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledWith(userDto);
    });
  });

  describe('find', () => {
    it('should find a user by email', async () => {
      await userController.findOne('butter@email.com');

      expect(mockUserService.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'butter@email.com',
      );
    });
  });
});
