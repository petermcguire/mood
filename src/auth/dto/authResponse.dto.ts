import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class AuthResponseDto {
  @Expose()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Expose()
  @IsString()
  access_token: string;
}
