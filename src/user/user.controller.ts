import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete, Patch
} from "@nestjs/common";
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { MoodDto } from "./dto/mood.dto";
import { UpdateMoodDto } from "./dto/update-mood.dto";
import { Mood } from "./entities/mood.entity";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userDto: UserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOneById(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<User> {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<DeleteResult> {
  //   return this.userService.remove(+id);
  // }

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
