import { IsInt, IsISO8601, IsNotEmpty, Max, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MoodDto {
  @Expose()
  @IsInt()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  level: number;

  @Expose()
  @IsISO8601()
  @IsNotEmpty()
  timestamp: Date;
}
