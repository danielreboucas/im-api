import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { CreateSaleDto } from './create-sale.dto';

type SaleItem = {
  id: string;
  quantity: number;
  price: number;
  productId: string;
};

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({
    required: false,
    example:
      '[{"id": 1, "quantity": 10, "price": 10.0, "productId": "bb32946a-d764-4cf4-8352-4fd4ec9c41a8"}]',
  })
  @IsObject({ each: true })
  @IsOptional()
  items?: SaleItem[];
}
