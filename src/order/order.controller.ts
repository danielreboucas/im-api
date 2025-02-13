import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @GetUser() user) {
    return await this.orderService.create(createOrderDto, user);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page?: number,
    @Query('per_page', ParseIntPipe) per_page?: number,
  ) {
    return await this.orderService.findAll(page, per_page);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.remove(id);
  }

  @Post('/complete/:id')
  async completeOrder(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.completeOrder(id);
  }

  @Post('/cancel/:id')
  async cancelOrder(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.cancelOrder(id);
  }
}
