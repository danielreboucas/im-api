import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Sale } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto, user): Promise<Partial<Sale>> {
    const sale = await this.prisma.sale.create({
      data: {
        name: createSaleDto.name,
        description: createSaleDto.description,
        items: {},
        userId: user.sub,
      },
    });

    const { userId, ...result } = sale;
    return result;
  }

  async findAll(
    page: number = 1,
    per_page: number = 10,
  ): Promise<{ data: Sale[]; total: number }> {
    const offset = (page - 1) * per_page;
    const sales = await this.prisma.sale.findMany({
      skip: offset,
      take: per_page,
      include: {
        items: true,
      },
    });
    return {
      data: sales,
      total: sales.length,
    };
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: id },
      include: {
        items: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: id },
    });

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    let totalPrice: number = sale?.totalPrice ? sale?.totalPrice : 0;
    if (updateSaleDto.items && Array.isArray(updateSaleDto.items)) {
      totalPrice += updateSaleDto.items.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0,
      );
    }

    let saleItems: { quantity: number; price: number; productId: string }[] =
      [];

    if (updateSaleDto.items) {
      const productIds = updateSaleDto.items.map((item) => item.productId);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, quantity: true },
      });

      const insufficientStock = updateSaleDto.items.find(
        (item) =>
          (products.find((p) => p.id === item.productId)?.quantity ?? 0) <
          item.quantity,
      );

      if (insufficientStock) {
        throw new BadRequestException(
          'O produto não possui estoque suficiente',
        );
      }

      await this.prisma.$transaction(
        updateSaleDto.items.map((item) =>
          this.prisma.product.update({
            where: {
              id: item.productId,
              quantity: { gte: item.quantity },
            },
            data: {
              quantity: { decrement: item.quantity },
            },
          }),
        ),
      );

      saleItems = updateSaleDto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
          productName: product?.name,
        };
      });
    }

    return await this.prisma.sale.update({
      where: { id: id },
      data: {
        name: updateSaleDto?.name,
        description: updateSaleDto?.description,
        items: { create: saleItems },
        totalPrice: totalPrice,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.sale.delete({ where: { id: id } });
  }
}
