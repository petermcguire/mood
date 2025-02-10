import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Mood } from './entities/mood.entity';
import { UserDto } from './dto/user.dto';
import { MoodDto } from './dto/mood.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mood)
    private readonly moodRepository: Repository<Mood>,
  ) {}

  create(userDto: UserDto): Promise<User> {
    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByName(name: string): Promise<User | null> {
    return this.userRepository.findOneBy({ name });
  }

  async hasUser(userId: number): Promise<User> {
    const hasUser = structuredClone(await this.findOneById(userId));
    if (!hasUser) throw new Error('User does not exist');
    return hasUser;
  }

  async addMoods(userId: number, moodDtos: MoodDto[]): Promise<Mood[]> {
    const hasUser = await this.hasUser(userId);
    const moods = this.moodRepository.create(moodDtos);
    hasUser.moods = hasUser.moods.concat(moods);
    await this.userRepository.save(hasUser);
    return moods;
  }

  async allMoodsForUser(userId: number): Promise<Mood[]> {
    const hasUser = await this.hasUser(userId);
    return hasUser.moods;
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
