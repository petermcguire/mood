import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { MoodDto } from './dto/mood.dto';
import { Mood } from './entities/mood.entity';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: UserDto): Promise<UserDto> {
    const user = await this.userService.create(userDto);
    return plainToInstance(UserDto, user, { enableCircularCheck: true });
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserDto | null> {
    const user = await this.userService.findOneById(+id);
    return user
      ? plainToInstance(UserDto, user, { enableCircularCheck: true })
      : null;
  }

  @Patch(':id/moods')
  async addMoods(
    @Param('id') id: string,
    @Body() addMoodDtos: MoodDto[],
  ): Promise<MoodDto[]> {
    const moods = await this.userService.addMoods(+id, addMoodDtos);

    return moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }

  @Get(':id/moods')
  async allMoodsForUser(@Param('id') id: string): Promise<MoodDto[]> {
    const moods = await this.userService.allMoodsForUser(+id);
    return moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }
}
