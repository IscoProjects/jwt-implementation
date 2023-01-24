import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(10)
  cedula: string;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  role: string;

  @IsString()
  user: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
