import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: true, example: 'Pencil' })
  @IsString()
  @IsNotEmpty({ message: 'Nome não deve ser vazio' })
  name: string;

  @ApiProperty({ required: false, example: 10 })
  @IsInt()
  @IsOptional()
  quantity: number;

  @ApiProperty({ required: false, example: 'Blue pencil' })
  @IsString()
  description: string;
}
