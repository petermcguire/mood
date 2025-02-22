import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { MoodDto } from './dto/mood.dto';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: UserDto): Promise<UserDto> {
    return await this.userService.create(userDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserDto | null> {
    return await this.userService.findOneById(+id);
  }

  @Patch(':id/moods')
  async addMoods(
    @Param('id') id: string,
    @Body() addMoodDtos: MoodDto[],
  ): Promise<MoodDto[]> {
    return await this.userService.addMoods(+id, addMoodDtos);
  }

  @Get(':id/moods')
  async allMoodsForUser(@Param('id') id: string): Promise<MoodDto[]> {
    const moods = await this.userService.allMoodsForUser(+id);
    return moods.map((mood) =>
      plainToInstance(MoodDto, mood, { enableCircularCheck: true }),
    );
  }
}
