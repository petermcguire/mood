import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtToken, oneUser } from './utils';

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
          useValue: {
            findOneByName: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(jwtToken),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockedUserService = module.get<UserService>(UserService);
    mockedJwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    let result: Promise<any>;

    it('should call mocked user service findOneByName once', () => {
      jest.spyOn(mockedUserService, 'findOneByName').mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(mockedUserService.findOneByName).toHaveBeenCalledTimes(1);
    });

    it('should call mocked user service findOneByName with passed username', () => {
      jest.spyOn(mockedUserService, 'findOneByName').mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(mockedUserService.findOneByName).toHaveBeenCalledWith(
        oneUser.name,
      );
    });

    it('should return User without password when user is found and passed in password matches user password', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userMinusPassword } = oneUser;
      jest.spyOn(mockedUserService, 'findOneByName').mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(result).resolves.toEqual(userMinusPassword);
    });

    it('should return null when user is not found', () => {
      jest.spyOn(mockedUserService, 'findOneByName').mockResolvedValue(null);
      result = service.validateUser(oneUser.name, oneUser.password);
      expect(result).resolves.toEqual(null);
    });

    it('should return null when user is found but password dopes not match', () => {
      jest.spyOn(mockedUserService, 'findOneByName').mockResolvedValue(oneUser);
      result = service.validateUser(oneUser.name, oneUser.password + 'bad');
      expect(result).resolves.toEqual(null);
    });
  });

  describe('login', () => {
    let result: string;

    beforeEach(() => {
      result = service.login(oneUser);
    });

    it('should call mocked JWT service sign once', () => {
      expect(mockedJwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should call mocked JWT service sign with proper payload', () => {
      expect(mockedJwtService.sign).toHaveBeenCalledWith({
        username: oneUser.name,
        sub: oneUser.id,
      });
    });

    it('should return proper object', () => {
      expect(result).toEqual(jwtToken);
    });
  });
});
