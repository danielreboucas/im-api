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
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(
    @Query('page', ParseIntPipe) page?: number,
    @Query('per_page', ParseIntPipe) per_page?: number,
    @Query('user_id') user_id?: string,
  ) {
    return await this.userService.getAll(page, per_page, user_id);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.get(userId);
  }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.delete(userId);
  }
}
