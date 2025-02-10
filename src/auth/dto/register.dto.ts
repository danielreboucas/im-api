import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  birth_date: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter 6 ou mais caracteres' })
  @IsNotEmpty()
  password: string;
}
