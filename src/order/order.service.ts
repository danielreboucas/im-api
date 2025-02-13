import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from 'utils/enums/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, user): Promise<Partial<Order>> {
    const order = await this.prisma.order.create({
      data: {
        name: createOrderDto.name,
        description: createOrderDto.description,
        items: {},
        userId: user.sub,
      },
    });

    const { userId, ...result } = order;
    return result;
  }

  async findAll(
    page: number = 1,
    per_page: number = 10,
  ): Promise<{ data: Order[]; total: number }> {
    const offset = (page - 1) * per_page;
    const orders = await this.prisma.order.findMany({
      skip: offset,
      take: per_page,
      include: {
        items: true,
      },
    });
    return {
      data: orders,
      total: orders.length,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Compra não encontrada');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
    });

    if (!order) {
      throw new NotFoundException('Compra não encontrada');
    }

    let totalPrice: number = order?.totalPrice ? order?.totalPrice : 0;
    if (updateOrderDto.items && Array.isArray(updateOrderDto.items)) {
      totalPrice += updateOrderDto.items.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0,
      );
    }

    let orderItems: { quantity: number; price: number; productId: string }[] =
      [];

    if (updateOrderDto.items) {
      const productIds = updateOrderDto.items.map((item) => item.productId);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      });

      orderItems = updateOrderDto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
          productName: product?.name,
        };
      });
    }

    return await this.prisma.order.update({
      where: { id: id },
      data: {
        name: updateOrderDto?.name,
        description: updateOrderDto?.description,
        items: { create: orderItems },
        totalPrice: totalPrice,
      },
      include: {
        items: true,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.order.delete({ where: { id: id } });
  }

  async completeOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Compra não encontrada');
    }

    if (order.status === OrderStatus.PENDING) {
      await this.prisma.$transaction(
        order.items.map((item) =>
          this.prisma.product.update({
            where: {
              id: item.productId,
            },
            data: {
              quantity: { increment: item.quantity },
            },
          }),
        ),
      );

      return await this.prisma.order.update({
        where: { id: id },
        data: { status: OrderStatus.COMPLETED },
        include: {
          items: true,
        },
      });
    } else {
      throw new BadRequestException('Compra possui um status inválido');
    }
  }

  async cancelOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Compra não encontrada');
    }

    if (order.status === OrderStatus.PENDING) {
      return await this.prisma.order.update({
        where: { id: id },
        data: { status: OrderStatus.CANCELLED },
        include: {
          items: true,
        },
      });
    } else {
      throw new BadRequestException('Compra possui um status inválido');
    }
  }
}
