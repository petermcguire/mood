import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { oneUser } from '../user/test/utils';

const mockUserService = {
  create: jest.fn().mockResolvedValue(oneUser),
  allMoodsForUser: jest.fn().mockResolvedValue(oneUser.moods),
  findOneById: jest.fn().mockResolvedValue(oneUser),
  findOneByName: jest.fn().mockResolvedValue(oneUser),
  addMoods: jest.fn().mockResolvedValue(oneUser),
};

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockedUserService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
