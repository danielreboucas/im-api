// export class UpdateUserDto implements PartialType {}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: true, example: 'John' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: 'Doe' })
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiProperty({ required: true, example: 'john@gmail.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: '2000-02-24' })
  @IsOptional()
  @IsString()
  birth_date: string;

  @ApiProperty({ required: true, example: '123456' })
  @IsOptional()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: true, example: ['admin', 'user'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  role: string[];
}
