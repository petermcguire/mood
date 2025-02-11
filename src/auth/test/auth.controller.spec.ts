import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { authResponse, oneUser, mockAuthService } from './utils';
import { AuthResponseDto } from '../dto/authResponse.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockedAuthService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockedAuthService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    let result: AuthResponseDto;

    beforeEach(() => {
      result = controller.login({ user: oneUser });
    });

    it('should call mocked service login once', () => {
      expect(mockedAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should call mocked service login with expected User', () => {
      expect(mockedAuthService.login).toHaveBeenCalledWith(oneUser);
    });

    it('should return expected object', () => {
      expect(result).toEqual(authResponse);
    });
  });
});
