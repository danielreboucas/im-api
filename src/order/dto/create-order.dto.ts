import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, NotEquals, ValidateIf } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ required: true, example: 'Pencil Order' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Order from Amazon' })
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  description?: string;
}
