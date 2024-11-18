import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { Mood } from '../entities/mood.entity';
import { UserDto } from '../dto/user.dto';
import { MoodDto } from '../dto/mood.dto';

export const startTimestamp = '2024-02-04T22:44:30.652Z';
export const endTimestamp = '2024-05-04T22:44:30.652Z';

export const oneMoodDto = new MoodDto();
oneMoodDto.level = 1;
oneMoodDto.timestamp = '2013-02-04T22:44:30.652Z';

export const anotherMoodDto = new MoodDto();
anotherMoodDto.level = 2;
anotherMoodDto.timestamp = '2013-03-04T22:44:30.652Z';

export const oneUserDto = new UserDto();
oneUserDto.name = 'OneUser';
oneUserDto.moods = [oneMoodDto, anotherMoodDto];

export const oneUser = new User();
oneUser.name = oneUserDto.name;

export const oneMood = new Mood();
oneMood.level = oneMoodDto.level;
oneMood.user = oneUser;
oneMood.timestamp = new Date(oneMoodDto.timestamp);

export const anotherMood = new Mood();
anotherMood.level = anotherMoodDto.level;
anotherMood.user = oneUser;
anotherMood.timestamp = new Date(anotherMoodDto.timestamp);

export const moodDtos = [oneMoodDto, anotherMoodDto];

export const allMoods = [oneMood, anotherMood];

oneUser.moods = allMoods;

export const deleteResult: DeleteResult = new DeleteResult();
export const updateResult: UpdateResult = new UpdateResult();
