import { Test, TestingModule } from '@nestjs/testing';
import {
  SALT_ROUNDS,
  userDoesNotExistError,
  UserService,
} from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import {
  allMoods,
  oneUser,
  oneUserDto,
  moodDtos,
  startTimestamp,
  endTimestamp, queryRange, oneMoodDto,
} from './utils';
import { Mood } from '../entities/mood.entity';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { MoodDto } from '../dto/mood.dto';

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
          useValue: {
            save: jest.fn().mockResolvedValue(oneUser),
            create: jest.fn().mockReturnValue(oneUser),
            findOneBy: jest.fn().mockResolvedValue(oneUser),
          },
        },
        {
          provide: moodRepoToken,
          useValue: {
            create: jest.fn().mockReturnValue(allMoods),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockedUserRepo = module.get<Repository<User>>(userRepoToken);
    mockedMoodRepo = module.get<Repository<Mood>>(moodRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    let result: UserDto;
    let bcryptSpy: jest.SpyInstance;

    beforeEach(async () => {
      bcryptSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('pass'));
      result = await service.createUser(oneUserDto);
    });

    it('should call bcrypt hash with proper args', () => {
      expect(bcryptSpy).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledWith(oneUserDto.password, SALT_ROUNDS);
    });

    it('should call mocked user repo save once with proper user', () => {
      expect(mockedUserRepo.save).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.save).toHaveBeenCalledWith(oneUser);
    });

    it('should call mocked user repo create once with proper UserDto', () => {
      expect(mockedUserRepo.create).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.create).toHaveBeenCalledWith(oneUserDto);
    });

    it('should return expected User', () => {
      expect(result).toEqual(oneUserDto);
    });
  });

  describe('findOneById', () => {
    it('should return correct User', async () => {
      const id = oneUser.id;
      const result = await service.findOneById(id);
      // we call find once
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledWith({ id: id });
      // we observe resolved response
      expect(result).toEqual(oneUserDto);
    });

    it('should return null if user not found', async () => {
      const id = oneUser.id;
      jest.clearAllMocks();
      jest.spyOn(mockedUserRepo, 'findOneBy').mockResolvedValue(null);
      const result = await service.findOneById(id);
      // we observe resolved response
      expect(result).toEqual(null);
    });
  });

  describe('findOneByName', () => {
    it('should return correct User', async () => {
      const name = oneUser.name;
      const result = await service.findOneByName(name);
      // we call find once
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledWith({ name: name });
      // we observe resolved response
      expect(result).toEqual(oneUser);
    });
  });

  describe('hasUser', () => {
    it('should call findOneBy with correct id', async () => {
      const result = await service.hasUser(oneUser.id);
      // we call find once
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockedUserRepo.findOneBy).toHaveBeenCalledWith({ id: oneUser.id });
      // we observe resolved response
      expect(result).toEqual(oneUser);
    });

    it('should throw error on user not found', () => {
      jest.spyOn(mockedUserRepo, 'findOneBy').mockResolvedValue(null);
      const result = service.hasUser(oneUser.id);
      // we observe resolved response
      expect(result).rejects.toThrow(userDoesNotExistError);
    });
  });

  describe('addMoods', () => {
    it('should properly call mocked save once and return moods added', async () => {
      jest
        .spyOn(service, 'hasUser')
        .mockResolvedValue(structuredClone(oneUser));
      const result = await service.addMoods(oneUser.id, moodDtos);
      expect(mockedUserRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(moodDtos);
    });

    it('should call create and save with proper stuff', async () => {
      jest
        .spyOn(service, 'hasUser')
        .mockResolvedValue(structuredClone(oneUser));
      await service.addMoods(oneUser.id, moodDtos);
      // const expectedUser = JSON.parse(JSON.stringify(oneUser));
      // expectedUser.moods = expectedUser.moods.concat(allMoods);
      expect(mockedMoodRepo.create).toHaveBeenCalledTimes(1);
      expect(mockedMoodRepo.create).toHaveBeenCalledWith(moodDtos);
      expect(mockedUserRepo.save).toHaveBeenCalledTimes(1);
      // expect(mockedUserRepo.save).toHaveBeenCalledWith(expectedUser);
    });

    it("should throw error when user isn't found", () => {
      jest.spyOn(service, 'hasUser').mockRejectedValue(userDoesNotExistError);
      const result = service.addMoods(oneUser.id, moodDtos);
      expect(result).rejects.toThrow(userDoesNotExistError);
    });
  });

  describe('allMoodsForUser', () => {
    it('should properly call mocked findOneBy once and return expected User', async () => {
      jest.spyOn(service, 'hasUser').mockResolvedValue(oneUser);
      const result = await service.allMoodsForUser(oneUser.id);
      expect(service.hasUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(oneUserDto.moods);
    });

    it("should throw error when user isn't found", () => {
      jest.spyOn(service, 'hasUser').mockRejectedValue(userDoesNotExistError);
      const result = service.allMoodsForUser(oneUser.id);
      expect(result).rejects.toThrow(userDoesNotExistError);
    });
  });

  describe('allMoodsForUserInRange', () => {
    it('should properly call mocked findOneBy once and return expected MoodDto', async () => {
      jest.spyOn(service, 'hasUser').mockResolvedValue(oneUser);
      const result = await service.allMoodsForUserInRange(
        oneUser.id,
        queryRange,
      );
      expect(service.hasUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual([oneMoodDto]);
    });

    it('should properly fail if user does not exist', () => {
      jest.spyOn(service, 'hasUser').mockRejectedValue(userDoesNotExistError);
      const result = service.allMoodsForUserInRange(oneUser.id, queryRange);
      expect(result).rejects.toThrow(userDoesNotExistError);
    });
  });
});
