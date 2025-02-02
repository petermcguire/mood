import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(), // Mock the validateUser method
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if credentials are valid', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await localStrategy.validate('testuser', 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith(
        'testuser',
        'password123',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        localStrategy.validate('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'testuser',
        'wrongpassword',
      );
    });
  });
});
