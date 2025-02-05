import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'Daniel' },
    { id: 2, name: 'Jorge' },
    { id: 3, name: 'Alysson' },
  ];

  getAll() {
    return this.users;
  }

  get(id: number) {
    return { id };
  }

  create(createUserDto: CreateUserDto) {
    return { createUserDto };
  }

  update(userId: number, updateUserDto: UpdateUserDto) {
    return { id: userId, ...updateUserDto };
  }

  delete(userId: number) {
    return { id: userId };
  }
}
