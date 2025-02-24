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
    let totalPrice: number = 0;
    if (createSaleDto.items && Array.isArray(createSaleDto.items)) {
      totalPrice += createSaleDto.items.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0,
      );
    }

    let saleItems: { quantity: number; price: number; productId: string }[] =
      [];

    if (createSaleDto.items) {
      const productIds = createSaleDto.items.map((item) => item.productId);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, quantity: true },
      });

      const insufficientStock = createSaleDto.items.find(
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
        createSaleDto.items.map((item) =>
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

      saleItems = createSaleDto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
          productName: product?.name,
        };
      });
    }

    const sale = await this.prisma.sale.create({
      data: {
        name: createSaleDto.name,
        description: createSaleDto.description,
        items: { create: saleItems },
        userId: user.sub,
      },
    });

    const { userId, ...result } = sale;
    return result;
  }

  async findAll(
    page: number = 1,
    per_page: number = 10,
    sale_name: string = '',
    sort_by?: 'asc' | 'desc',
  ): Promise<{ data: Partial<Sale>[]; total: number }> {
    const offset = (page - 1) * per_page;
    const [sales, count] = await this.prisma.$transaction([
      this.prisma.sale.findMany({
        skip: offset,
        take: per_page,
        where: { name: { contains: sale_name, mode: 'insensitive' } },
        orderBy: { totalPrice: sort_by },
        include: {
          items: true,
          _count: true,
        },
      }),
      this.prisma.sale.count(),
    ]);

    const result = sales.map(
      ({ userId, createdAt, updatedAt, ...result }) => result,
    );

    return {
      data: result,
      total: count,
    };
  }

  async findOne(id: string): Promise<Partial<Sale>> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: id },
      include: {
        items: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    const { userId, createdAt, updatedAt, ...result } = sale;
    return result;
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
