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
  mockUserServiceRepo,
  mockMoodServiceRepo,
} from './utils';
import { Mood } from '../entities/mood.entity';

describe('UserService', () => {
  let service: UserService;
  let mockedUserRepo: Repository<User>;
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
      expect(mockedUserRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should call mocked user repo save once', () => {
      expect(mockedUserRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should call mocked user repo save with correctly built User', () => {
      expect(mockedUserRepo.save).toHaveBeenCalledWith(oneUser);
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
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledWith({ id: id });
      // we observe resolved response
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('findOneByName', () => {
    it('should return correct User', () => {
      const name = oneUser.name;
      const result = service.findOneByName(name);
      // we call find once
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledWith({ name: name });
      // we observe resolved response
      expect(result).resolves.toEqual(oneUser);
    });
  });

  describe('hasUser', () => {
    it('should call findOneById with correct id', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(oneUser);
      const result = await service.hasUser(oneUser.id);
      // we call find once
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(service.findOneById).toHaveBeenCalledWith(oneUser.id);
      // we observe resolved response
      expect(result).toEqual(oneUser);
    });

    it('should throw error on user not found', () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      const result = service.hasUser(oneUser.id);
      // we observe resolved response
      expect(result).rejects.toThrow(Error('User does not exist'));
    });
  });

  describe('addMoods', () => {
    it('should properly call mocked save once and return expected User', async () => {
      const result = await service.addMoods(oneUser.id, moodDtos);
      expect(mockedUserRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(oneUser.moods);
    });

    it('should call save with properly built user', async () => {
      await service.addMoods(oneUser.id, moodDtos);
      const expectedUser = structuredClone(oneUser);
      expectedUser.moods = expectedUser.moods.concat(allMoods);
      expect(mockedUserRepo.save).toHaveBeenCalledWith(expectedUser);
    });

    it("should throw error when user isn't found", () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      const result = service.addMoods(oneUser.id, moodDtos);
      expect(result).rejects.toThrow(Error('User does not exist'));
    });
  });

  describe('allMoodsForUser', () => {
    it('should properly call mocked findOneBy once and return expected User', async () => {
      const result = await service.allMoodsForUser(oneUser.id);
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(oneUser.moods);
    });

    it("should throw error when user isn't found", () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      const result = service.allMoodsForUser(oneUser.id);
      expect(result).rejects.toThrow(Error('User does not exist'));
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
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(result).resolves.toEqual(oneUser.moods);
    });
  });
});
