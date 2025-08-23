import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from '../create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let passwordService: PasswordService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
    roles: [],
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'newuser@example.com',
    name: 'New User',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            // 直接设置返回值，所有测试都返回相同数据，不够真实，无法测试边界情况
            // findOneBy: jest.fn().mockResolvedValue(mockUser),
            // 只创建函数，不设置返回值
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hash: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    passwordService = module.get(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should find user by email successfully', async () => {
      const email = 'test@example.com';
      const findOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      const result = await service.findOneByEmail(email);
      // Verifies the repository was called with correct parameters
      expect(findOneBySpy).toHaveBeenCalledWith({ email });
      // Verifies the service returned the expected user
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      const findOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);
      const result = await service.findOneByEmail(email);

      expect(findOneBySpy).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const hashedPassword = 'hashed_password_123';
      const createdUser = {
        ...mockUser,
        ...mockCreateUserDto,
        password: hashedPassword,
      };

      // Mocks password hashing to return our expected hash
      const hashSpy = jest
        .spyOn(passwordService, 'hash')
        .mockResolvedValue(hashedPassword);
      // Mocks repository.create to return our user object
      const createSpy = jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(createdUser as User);
      // Mocks repository.save to return the saved user
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(createdUser as User);

      const result = await service.createUser(mockCreateUserDto);
      // Verifies password service was called with plain password
      expect(hashSpy).toHaveBeenCalledWith(mockCreateUserDto.password);
      // Verifies repository.create was called with correct parameters
      expect(createSpy).toHaveBeenCalledWith({
        ...mockCreateUserDto,
        password: hashedPassword,
      });
      // Verifies repository.save was called with the correct user
      expect(saveSpy).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should handle password hashing error', async () => {
      const hashSpy = jest
        .spyOn(passwordService, 'hash')
        .mockRejectedValue(new Error('Hashing failed'));

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        'Hashing failed',
      );
      expect(hashSpy).toHaveBeenCalledWith(mockCreateUserDto.password);
    });
  });

  describe('findOne', () => {
    it('should find user by id successfully', async () => {
      const userId = '1';
      const findOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(mockUser as User);

      const result = await service.findOne(userId);

      expect(findOneBySpy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by id', async () => {
      const userId = '999';
      const findOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = await service.findOne(userId);

      expect(findOneBySpy).toHaveBeenCalledWith({ id: userId });
      expect(result).toBeNull();
    });
  });
});
