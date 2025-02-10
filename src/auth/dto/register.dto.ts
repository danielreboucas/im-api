import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true, example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ required: true, example: 'john@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: '2000-01-01' })
  @IsString()
  @IsNotEmpty()
  birth_date: string;

  @ApiProperty({ required: true, example: '123456' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter 6 ou mais caracteres' })
  @IsNotEmpty()
  password: string;
}
