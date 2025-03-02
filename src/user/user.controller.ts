import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { MoodDto } from './dto/mood.dto';
import { Public } from '../auth/constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async createUser(@Body() userDto: UserDto): Promise<UserDto> {
    return await this.userService.createUser(userDto);
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
    return await this.userService.allMoodsForUser(+id);
  }
}
