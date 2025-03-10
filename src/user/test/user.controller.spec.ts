import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { moodDtos, oneUser, oneUserDto, queryRange } from './utils';
import { UserDto } from '../dto/user.dto';
import { MoodDto } from '../dto/mood.dto';
import { AllMoodsForUserQueryRangeDto } from '../dto/all-moods-for-user-query-range.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockedUserService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(oneUserDto),
            allMoodsForUser: jest.fn().mockResolvedValue(oneUserDto.moods),
            allMoodsForUserInRange: jest
              .fn()
              .mockResolvedValue(oneUserDto.moods),
            findOneById: jest.fn().mockResolvedValue(oneUserDto),
            findOneByName: jest.fn().mockResolvedValue(oneUserDto),
            addMoods: jest.fn().mockResolvedValue(moodDtos),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockedUserService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    let result: UserDto;

    beforeEach(async () => {
      result = await controller.createUser(oneUserDto);
    });

    it('should call mocked service create once', () => {
      expect(mockedUserService.createUser).toHaveBeenCalledTimes(1);
    });

    it('should call mocked service create with expected CreateUserDto', () => {
      expect(mockedUserService.createUser).toHaveBeenCalledWith(oneUserDto);
    });

    it('should return expected User', () => {
      expect(result).toEqual(oneUserDto);
    });
  });

  describe('findOneById', () => {
    let result: UserDto;
    const id = String(oneUser.id);

    beforeEach(async () => {
      result = await controller.findOneById(id);
    });

    it('should call mocked service findOneById once', () => {
      expect(mockedUserService.findOneById).toHaveBeenCalledTimes(1);
    });

    it('should call mocked service findOneById with expected id', () => {
      expect(mockedUserService.findOneById).toHaveBeenCalledWith(+id);
    });

    it('should return expected User', () => {
      expect(result).toEqual(oneUserDto);
    });
  });

  describe('addMoods', () => {
    let result: MoodDto[];
    const id = String(oneUser.id);

    beforeEach(async () => {
      result = await controller.addMoods(id, moodDtos);
    });

    it('should call mocked service addMoods once', () => {
      expect(mockedUserService.addMoods).toHaveBeenCalledTimes(1);
    });

    it('should call mocked service addMoods with expected id and CreateMoodDtos', () => {
      expect(mockedUserService.addMoods).toHaveBeenCalledWith(+id, moodDtos);
    });

    it('should return expected User', () => {
      expect(result).toEqual(oneUserDto.moods);
    });
  });

  describe('allMoodsForUser', () => {
    let result: MoodDto[];
    const id = String(oneUser.id);

    describe('without query range', () => {
      beforeEach(async () => {
        result = await controller.allMoodsForUser(id);
      });

      it('should call mocked service allMoodsForUser once with id', async () => {
        expect(mockedUserService.allMoodsForUser).toHaveBeenCalledTimes(1);
        expect(mockedUserService.allMoodsForUser).toHaveBeenCalledWith(+id);
      });

      it('should return expected moods', () => {
        expect(result).toEqual(oneUserDto.moods);
      });
    });

    describe('with query range', () => {
      it('should call allMoodsForUserInRange once with id and query range and return result', async () => {
        const result = await controller.allMoodsForUser(id, queryRange);
        expect(mockedUserService.allMoodsForUserInRange).toHaveBeenCalledTimes(
          1,
        );
        expect(mockedUserService.allMoodsForUserInRange).toHaveBeenCalledWith(
          +id,
          queryRange,
        );
        expect(result).toEqual(oneUserDto.moods);
      });

      it('should call allMoodsForUser once with id and return result', async () => {
        const result = await controller.allMoodsForUser(
          id,
          new AllMoodsForUserQueryRangeDto(),
        );
        expect(mockedUserService.allMoodsForUser).toHaveBeenCalledTimes(1);
        expect(mockedUserService.allMoodsForUser).toHaveBeenCalledWith(+id);
        expect(result).toEqual(oneUserDto.moods);
      });
    });
  });
});
