import { PartialType } from '@nestjs/mapped-types';
import { MoodDto } from './mood.dto';

export class UpdateMoodDto extends PartialType(MoodDto) {}
