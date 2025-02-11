import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: true, example: 'Pencil' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 10 })
  @IsInt()
  @IsOptional()
  quantity: number;

  @ApiProperty({ required: false, example: 'Blue pencil' })
  @IsString()
  description: string;
}
