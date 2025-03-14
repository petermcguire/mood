import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AllMoodsForUserQueryRangeDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end: Date;
}
