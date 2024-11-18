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

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async addMoods(userId: number, moodDtos: MoodDto[]): Promise<User> {
    const hasUser = structuredClone(await this.findOne(userId));
    if (!hasUser) throw new Error('User does not exist');
    const moods = this.moodRepository.create(moodDtos);
    hasUser.moods = hasUser.moods.concat(moods);
    return this.userRepository.save(hasUser);
  }

  async allMoodsForUser(userId: number): Promise<Mood[]> {
    const hasUser = await this.findOne(userId);
    if (!hasUser) throw new Error('User does not exist');
    return hasUser.moods;
  }

  async allMoodsForUserBetweenTimestamps(
    userId: number,
    startTimestamp: string,
    endTimestamp: string,
  ): Promise<Mood[]> {
    const hasUser = await this.findOne(userId);
    if (!hasUser) throw new Error('User does not exist');
    return hasUser.moods;
  }
}
