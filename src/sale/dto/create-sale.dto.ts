import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  NotEquals,
  ValidateIf,
} from 'class-validator';

type SaleItem = {
  id: string;
  quantity: number;
  price: number;
  productId: string;
};

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

  @ApiProperty({
    required: false,
    example:
      '[{"id": 1, "quantity": 10, "price": 10.0, "productId": "bb32946a-d764-4cf4-8352-4fd4ec9c41a8"}]',
  })
  @IsObject({ each: true })
  @IsOptional()
  items?: SaleItem[];
}
