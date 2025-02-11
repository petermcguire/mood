import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { MoodDto } from './mood.dto';

@Exclude()
export class UserDto {
  @Expose()
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @ValidateNested()
  @IsArray()
  @Type(() => MoodDto)
  @IsOptional()
  moods: MoodDto[];
}
