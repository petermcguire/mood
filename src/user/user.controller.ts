import { Controller, Get, Post, Body, Param, Patch } from "@nestjs/common";
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { MoodDto } from './dto/mood.dto';
import { Mood } from './entities/mood.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userDto: UserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOneById(+id);
  }

  @Patch(':id/moods')
  addMoods(
    @Param('id') id: string,
    @Body() addMoodDtos: MoodDto[],
  ): Promise<User> {
    return this.userService.addMoods(+id, addMoodDtos);
  }

  @Get(':id/moods')
  allMoodsForUser(@Param('id') id: string): Promise<Mood[]> {
    return this.userService.allMoodsForUser(+id);
  }
}
