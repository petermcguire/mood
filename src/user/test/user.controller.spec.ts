import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { moodDtos, oneUser, oneUserDto } from './utils';
import { User } from '../entities/user.entity';
import { Mood } from '../entities/mood.entity';

const mockUserService = {
  create: jest.fn().mockResolvedValue(oneUser),
  allMoodsForUser: jest.fn().mockResolvedValue(oneUser.moods),
  findOne: jest.fn().mockResolvedValue(oneUser),
  addMoods: jest.fn().mockResolvedValue(oneUser),
};

describe('UserController', () => {
  let controller: UserController;
  let mockedUserService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockedUserService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    let result: Promise<User>;

    beforeEach(() => {
      result = controller.create(oneUserDto);
    });

    it('should call mocked service create once', () => {
      expect(mockedUserService.create).toBeCalledTimes(1);
    });

    it('should call mocked service create with expected CreateUserDto', () => {
      expect(mockedUserService.create).toBeCalledWith(oneUserDto);
    });

    it('should return expected User', () => {
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('findOne', () => {
    let result: Promise<User>;
    const id = String(oneUser.id);

    beforeEach(() => {
      result = controller.findOne(id);
    });

    it('should call mocked service findOne once', () => {
      expect(mockedUserService.findOne).toBeCalledTimes(1);
    });

    it('should call mocked service findOne with expected id', () => {
      expect(mockedUserService.findOne).toBeCalledWith(+id);
    });

    it('should return expected User', () => {
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('addMoods', () => {
    let result: Promise<User>;
    const id = String(oneUser.id);

    beforeEach(() => {
      result = controller.addMoods(id, moodDtos);
    });

    it('should call mocked service addMoods once', () => {
      expect(mockedUserService.addMoods).toBeCalledTimes(1);
    });

    it('should call mocked service addMoods with expected id and CreateMoodDtos', () => {
      expect(mockedUserService.addMoods).toBeCalledWith(+id, moodDtos);
    });

    it('should return expected User', () => {
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('allMoodsForUser', () => {
    let result: Promise<Mood[]>;
    const id = String(oneUser.id);

    beforeEach(() => {
      result = controller.allMoodsForUser(id);
    });

    it('should call mocked service allMoodsForUser once', () => {
      expect(mockedUserService.allMoodsForUser).toBeCalledTimes(1);
    });

    it('should call mocked service allMoodsForUser with expected id', () => {
      expect(mockedUserService.allMoodsForUser).toBeCalledWith(+id);
    });

    it('should return expected moods', () => {
      expect(result).resolves.toEqual(oneUser.moods);
    });
  });
});
