import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, NotEquals, ValidateIf } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ required: true, example: 'Pencil Sale' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Sale for Amazon' })
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  description?: string;
}
