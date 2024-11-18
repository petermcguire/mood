import { IsInt, IsISO8601, IsNotEmpty, Max, Min } from 'class-validator';

export class MoodDto {
  @IsInt()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  level: number;

  @IsISO8601()
  @IsNotEmpty()
  timestamp: string;
}
