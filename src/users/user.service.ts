import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidDate } from 'utils/validations/validateDate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getAll(
    page: number = 1,
    per_page: number = 10,
  ): Promise<{ data: User[]; total: number }> {
    const offset = (page - 1) * per_page;
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: per_page,
    });

    return {
      data: users,
      total: users.length,
    };
  }

  async get(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        last_name: createUserDto.last_name,
        email: createUserDto.email,
        birth_date: format(new Date(createUserDto.birth_date), 'dd-MM-yyyy'),
      },
    });
    return user;
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(updateUserDto.name ? { name: updateUserDto.name } : {}),
        ...(updateUserDto.last_name
          ? { last_name: updateUserDto.last_name }
          : {}),
        ...(updateUserDto.email ? { email: updateUserDto.email } : {}),
        ...(updateUserDto.birth_date && isValidDate(updateUserDto.birth_date)
          ? {
              birth_date: updateUserDto.birth_date,
            }
          : {}),
      },
    });
  }

  delete(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }
}
