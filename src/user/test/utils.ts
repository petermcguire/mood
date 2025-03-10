import { User } from '../entities/user.entity';
import { Mood } from '../entities/mood.entity';
import { UserDto } from '../dto/user.dto';
import { MoodDto } from '../dto/mood.dto';
import { AllMoodsForUserQueryRangeDto } from '../dto/all-moods-for-user-query-range.dto';

export const startTimestamp = '2024-02-04T22:44:30.652Z';
export const betweenTimestamp = '2024-03-10T22:44:30.652Z';
export const endTimestamp = '2024-05-04T22:44:30.652Z';
export const outsideTimestamp = '2024-05-10T22:44:30.652Z';

export const queryRange = new AllMoodsForUserQueryRangeDto();
queryRange.start = new Date(startTimestamp);
queryRange.end = new Date(endTimestamp);

export const oneMoodDto = new MoodDto();
oneMoodDto.level = 1;
oneMoodDto.timestamp = new Date(betweenTimestamp);

export const anotherMoodDto = new MoodDto();
anotherMoodDto.level = 2;
anotherMoodDto.timestamp = new Date(outsideTimestamp);

export const oneUserDto = new UserDto();
oneUserDto.name = 'OneUser';
oneUserDto.password = 'pass';
oneUserDto.moods = [oneMoodDto, anotherMoodDto];

export const oneUser = new User();
oneUser.name = oneUserDto.name;
oneUser.password = oneUserDto.password;

export const oneMood = new Mood();
oneMood.level = oneMoodDto.level;
oneMood.user = oneUser;
oneMood.timestamp = oneMoodDto.timestamp;

export const anotherMood = new Mood();
anotherMood.level = anotherMoodDto.level;
anotherMood.user = oneUser;
anotherMood.timestamp = anotherMoodDto.timestamp;

export const moodDtos = [oneMoodDto, anotherMoodDto];

export const allMoods = [oneMood, anotherMood];

oneUser.moods = allMoods;

export const mockUserService = {
  create: jest.fn().mockResolvedValue(oneUser),
  allMoodsForUser: jest.fn().mockResolvedValue(oneUser.moods),
  findOneById: jest.fn().mockResolvedValue(oneUser),
  findOneByName: jest.fn().mockResolvedValue(oneUser),
  addMoods: jest.fn().mockResolvedValue(oneUser.moods),
};

export const mockUserServiceRepo = {
  save: jest.fn().mockResolvedValue(oneUser),
  create: jest.fn().mockReturnValue(oneUser),
  findOneBy: jest.fn().mockResolvedValue(oneUser),
};

export const mockMoodServiceRepo = {
  create: jest.fn().mockReturnValue(allMoods),
};
