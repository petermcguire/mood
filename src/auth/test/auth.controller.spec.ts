import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { loginReturn, mockAuthService } from './utils';
import { oneUser } from '../../user/test/utils';

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
    let result: Promise<any>;

    beforeEach(() => {
      result = controller.login({ user: oneUser });
    });

    it('should call mocked service login once', () => {
      expect(mockedAuthService.login).toBeCalledTimes(1);
    });

    it('should call mocked service login with expected User', () => {
      expect(mockedAuthService.login).toBeCalledWith(oneUser);
    });

    it('should return expected object', () => {
      expect(result).resolves.toEqual(loginReturn);
    });
  });
});
