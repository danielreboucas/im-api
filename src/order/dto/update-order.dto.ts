import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  productId: string;
};

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    required: false,
    example:
      '[{"id": 1, "quantity": 10, "price": 10.0, "productId": "bb32946a-d764-4cf4-8352-4fd4ec9c41a8"}]',
  })
  @IsObject({ each: true })
  @IsOptional()
  items?: OrderItem[];
}
