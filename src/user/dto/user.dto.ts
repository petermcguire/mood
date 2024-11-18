import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MoodDto } from './mood.dto';

export class UserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @IsArray()
  @Type(() => MoodDto)
  @IsOptional()
  moods: MoodDto[];
}
