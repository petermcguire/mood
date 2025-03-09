import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtToken, oneUser } from './utils';
import * as bcrypt from 'bcrypt';

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
    let bcryptSpy: jest.SpyInstance;

    describe('Success', () => {
      beforeEach(() => {
        jest
          .spyOn(mockedUserService, 'findOneByName')
          .mockResolvedValue(oneUser);
        bcryptSpy = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => Promise.resolve(true));
      });

      it('should call mocked user service findOneByName once with correct args', async () => {
        result = await service.validateUser(oneUser.name, oneUser.password);
        expect(mockedUserService.findOneByName).toHaveBeenCalledTimes(1);
        expect(mockedUserService.findOneByName).toHaveBeenCalledWith(
          oneUser.name,
        );
      });

      it('should call bcrypt compare with proper args', async () => {
        result = await service.validateUser(oneUser.name, oneUser.password);
        expect(bcryptSpy).toHaveBeenCalledTimes(1);
        expect(bcryptSpy).toHaveBeenCalledWith(
          oneUser.password,
          oneUser.password,
        );
      });

      it('should return User without password when user is found and passed in password matches user password', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userMinusPassword } = oneUser;
        result = service.validateUser(oneUser.name, oneUser.password);
        expect(result).resolves.toEqual(userMinusPassword);
      });
    });

    describe('Failure', () => {
      it('should return null when user is not found', () => {
        jest.spyOn(mockedUserService, 'findOneByName').mockResolvedValue(null);
        result = service.validateUser(oneUser.name, oneUser.password);
        expect(result).resolves.toEqual(null);
      });

      it('should return null when user is found but password does not match', () => {
        bcryptSpy = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => Promise.resolve(false));
        jest
          .spyOn(mockedUserService, 'findOneByName')
          .mockResolvedValue(oneUser);
        // doesn't REALLY matter as we depend on bcrypt compare and our passwords aren't encrypted
        // we assume encryption works, which is fair
        result = service.validateUser(oneUser.name, oneUser.password + 'bad');
        expect(result).resolves.toEqual(null);
      });
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
