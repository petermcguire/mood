import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtToken, oneUser } from './utils';

const mockUserService = {
  findOneByName: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue(jwtToken),
};

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: UserService;
  let mockedJwtService: JwtService;

  beforeEach(async () => {
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

    service = module.get<AuthService>(AuthService);
    mockedUserService = module.get<UserService>(UserService);
    mockedJwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    let result: Promise<any>;

    it('should call mocked user service findOneByName once', () => {
      mockUserService.findOneByName.mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(mockedUserService.findOneByName).toBeCalledTimes(1);
    });

    it('should call mocked user service findOneByName with passed username', () => {
      mockUserService.findOneByName.mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(mockedUserService.findOneByName).toBeCalledWith(oneUser.name);
    });

    it('should return User without password when user is found and passed in password matches user password', () => {
      const { password, ...userMinusPassword } = oneUser;
      mockUserService.findOneByName.mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(result).resolves.toEqual(userMinusPassword);
    });

    it('should return null when user is not found', () => {
      mockUserService.findOneByName.mockResolvedValue(null);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(result).resolves.toEqual(null);
    });

    it('should return null when user is found but password dopes not match', () => {
      mockUserService.findOneByName.mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password + 'bad');
      expect(result).resolves.toEqual(null);
    });
  });

  describe('login', () => {
    let result: Promise<any>;

    beforeEach(() => {
      result = service.login(oneUser);
    });

    it('should call mocked JWT service sign once', () => {
      expect(mockedJwtService.sign).toBeCalledTimes(1);
    });

    it('should call mocked JWT service sign with proper payload', () => {
      expect(mockedJwtService.sign).toBeCalledWith({
        username: oneUser.name,
        sub: oneUser.id,
      });
    });

    it('should return proper object', () => {
      expect(result).resolves.toEqual({ access_token: jwtToken });
    });
  });
});
