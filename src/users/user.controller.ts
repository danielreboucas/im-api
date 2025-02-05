import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.get(userId);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return { createUserDto };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return { id: userId, ...updateUserDto };
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) userId: number) {
    return { id: userId };
  }
}
