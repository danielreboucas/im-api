import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createProductDto: CreateProductDto,
    user,
  ): Promise<Partial<Product>> {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        quantity: createProductDto.quantity,
        description: createProductDto.description,
        userId: user.sub,
      },
    });

    const { userId, ...result } = product;
    return result;
  }

  async findAll(
    page: number = 1,
    per_page: number = 10,
    product_name: string = '',
    sort_by?: 'asc' | 'desc',
  ): Promise<{ data: Partial<Product>[]; total: number }> {
    const offset = (page - 1) * per_page;
    const [products, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip: offset,
        take: per_page,
        where: { name: { contains: product_name, mode: 'insensitive' } },
        orderBy: { quantity: sort_by },
      }),
      this.prisma.product.count(),
    ]);
    const result = products.map(
      ({ userId, createdAt, updatedAt, ...result }) => result,
    );
    return {
      data: result,
      total: count,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Partial<Product>> {
    const product = await this.prisma.product.update({
      where: { id: id },
      data: {
        ...(updateProductDto.name ? { name: updateProductDto.name } : {}),
        ...(updateProductDto.description
          ? { description: updateProductDto.description }
          : {}),
        ...(updateProductDto.quantity
          ? { quantity: updateProductDto.quantity }
          : {}),
      },
    });

    const { createdAt, updatedAt, userId, ...result } = product;

    return result;
  }

  async remove(id: string): Promise<Partial<Product>> {
    const product = await this.prisma.product.delete({ where: { id: id } });
    const { createdAt, updatedAt, userId, ...result } = product;

    return result;
  }
}
