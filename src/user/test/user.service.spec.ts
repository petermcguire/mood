import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import {
  allMoods,
  oneUser,
  oneUserDto,
  moodDtos,
  startTimestamp,
  endTimestamp,
} from './utils';
import { Mood } from '../entities/mood.entity';

const mockUserServiceRepo = {
  save: jest.fn().mockResolvedValue(oneUser),
  create: jest.fn().mockReturnValue(oneUser),
  findOneBy: jest.fn().mockResolvedValue(oneUser),
};

const mockMoodServiceRepo = {
  create: jest.fn().mockReturnValue(allMoods),
};

describe('UserService', () => {
  let service: UserService;
  let mockedUserRepo: Repository<User>;
  let mockedMoodRepo: Repository<Mood>;
  const userRepoToken = getRepositoryToken(User);
  const moodRepoToken = getRepositoryToken(Mood);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: userRepoToken,
          useValue: mockUserServiceRepo,
        },
        {
          provide: moodRepoToken,
          useValue: mockMoodServiceRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockedUserRepo = module.get<Repository<User>>(userRepoToken);
    mockedMoodRepo = module.get<Repository<Mood>>(moodRepoToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: Promise<User>;

    beforeEach(() => {
      result = service.create(oneUserDto);
    });

    it('should call mocked user repo create once', () => {
      expect(mockedUserRepo.create).toBeCalledTimes(1);
    });

    it('should call mocked user repo save once', () => {
      expect(mockedUserRepo.save).toBeCalledTimes(1);
    });

    it('should call mocked user repo save with correctly built User', () => {
      expect(mockedUserRepo.save).toBeCalledWith(oneUser);
    });

    it('should return expected User', () => {
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('findOneById', () => {
    it('should return correct User', () => {
      const id = oneUser.id;
      const result = service.findOneById(id);
      // we call find once
      expect(mockedUserRepo.findOneBy).toBeCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toBeCalledWith({ id: id });
      // we observe resolved response
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('findOneByName', () => {
    it('should return correct User', () => {
      const name = oneUser.name;
      const result = service.findOneByName(name);
      // we call find once
      expect(mockedUserRepo.findOneBy).toBeCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toBeCalledWith({ name: name });
      // we observe resolved response
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('addMoods', () => {
    let result: Promise<User>;

    beforeEach(() => {
      result = service.addMoods(oneUser.id, moodDtos);
    });

    it('should properly call mocked save once and return expected User', () => {
      expect(mockedUserRepo.save).toBeCalledTimes(1);
      expect(result).resolves.toEqual(oneUser);
    });

    it('should call save with properly built user', () => {
      const expectedUser = structuredClone(oneUser);
      expectedUser.moods = expectedUser.moods.concat(allMoods);
      expect(mockedUserRepo.save).toBeCalledWith(expectedUser);
    });
  });

  describe('allMoodsForUser', () => {
    let result: Promise<Mood[]>;

    beforeEach(() => {
      result = service.allMoodsForUser(oneUser.id);
    });

    it('should properly call mocked findOneBy once and return expected User', () => {
      expect(mockedUserRepo.findOneBy).toBeCalledTimes(1);
      expect(result).resolves.toEqual(oneUser.moods);
    });
  });

  describe('allMoodsForUserBetweenTimestamps', () => {
    let result: Promise<Mood[]>;

    beforeEach(() => {
      result = service.allMoodsForUserBetweenTimestamps(
        oneUser.id,
        startTimestamp,
        endTimestamp,
      );
    });

    it('should properly call mocked findOneBy once and return expected User', () => {
      expect(mockedUserRepo.findOneBy).toBeCalledTimes(1);
      expect(result).resolves.toEqual(oneUser.moods);
    });
  });
});
