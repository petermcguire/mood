import { IsISO8601, IsOptional } from 'class-validator';

export class AllMoodsForUserQueryRangeDto {
  @IsISO8601()
  @IsOptional()
  start: Date;

  @IsISO8601()
  @IsOptional()
  end: Date;
}
