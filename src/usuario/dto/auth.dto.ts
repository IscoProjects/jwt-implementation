import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  user: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
