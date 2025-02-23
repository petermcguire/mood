import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Mood } from './entities/mood.entity';
import { UserDto } from './dto/user.dto';
import { MoodDto } from './dto/mood.dto';
import { plainToInstance } from 'class-transformer';

export const userDoesNotExistError = new Error('User does not exist');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mood)
    private readonly moodRepository: Repository<Mood>,
  ) {}

  async create(userDto: UserDto): Promise<UserDto> {
    const createdUser = this.userRepository.create(userDto);
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
    const hasUser = structuredClone(
      await this.userRepository.findOneBy({ id }),
    );
    if (!hasUser) throw userDoesNotExistError;
    return hasUser;
  }

  async addMoods(userId: number, moodDtos: MoodDto[]): Promise<MoodDto[]> {
    const hasUser = await this.hasUser(userId);
    const moods = this.moodRepository.create(moodDtos);
    hasUser.moods = hasUser.moods.concat(moods);

    await this.userRepository.save(hasUser);

    return moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }

  async allMoodsForUser(userId: number): Promise<MoodDto[]> {
    const hasUser = await this.hasUser(userId);
    return hasUser.moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }

  async allMoodsForUserBetweenTimestamps(
    userId: number,
    startTimestamp: string,
    endTimestamp: string,
  ): Promise<Mood[]> {
    const hasUser = await this.hasUser(userId);
    return hasUser.moods;
  }
}
