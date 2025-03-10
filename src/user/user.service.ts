import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Mood } from './entities/mood.entity';
import { UserDto } from './dto/user.dto';
import { MoodDto } from './dto/mood.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { AllMoodsForUserQueryRangeDto } from './dto/all-moods-for-user-query-range.dto';

export const userDoesNotExistError = new Error('User does not exist');

export const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mood)
    private readonly moodRepository: Repository<Mood>,
  ) {}

  async createUser(userDto: UserDto): Promise<UserDto> {
    const password = await bcrypt.hash(userDto.password, SALT_ROUNDS);
    const encryptUserDto = { ...userDto, password };
    const createdUser = this.userRepository.create(encryptUserDto);
    const user = await this.userRepository.save(createdUser);
    return plainToInstance(UserDto, user, { enableCircularCheck: true });
  }

  async findOneById(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    return user
      ? plainToInstance(UserDto, user, { enableCircularCheck: true })
      : null;
  }

  findOneByName(name: string): Promise<User | null> {
    return this.userRepository.findOneBy({ name });
  }

  async hasUser(id: number): Promise<User> {
    const hasUser = await this.userRepository.findOneBy({ id });
    if (!hasUser) throw userDoesNotExistError;
    return hasUser;
  }

  async addMoods(userId: number, moodDtos: MoodDto[]): Promise<MoodDto[]> {
    // this is going to get HEAVY as many moods will be appended to user
    // better to save moods to db with user id set
    const hasUser = await this.hasUser(userId);
    const moods = this.moodRepository.create(moodDtos);
    hasUser.moods = hasUser.moods.concat(moods);

    await this.userRepository.save(hasUser);

    return moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }

  async allMoodsForUser(userId: number): Promise<MoodDto[]> {
    // this is going to get HEAVY as many moods will be appended to user
    const hasUser = await this.hasUser(userId);
    return hasUser.moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }

  async allMoodsForUserInRange(
    userId: number,
    range: AllMoodsForUserQueryRangeDto,
  ): Promise<MoodDto[]> {
    const hasUser = await this.hasUser(userId);
    const moodsInRange = hasUser.moods.filter((mood) => {
      return mood.timestamp >= range.start && mood.timestamp <= range.end;
    });
    return moodsInRange.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }
}
