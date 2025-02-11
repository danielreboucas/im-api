import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() req: LoginDto) {
    return this.authService.login(req);
  }

  @Public()
  @Post('register')
  @ApiOkResponse({
    type: RegisterDto,
    description: 'The record has been successfully created.',
    isArray: false,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: RegisterDto,
    description: 'Json structure for user object',
  })
  async register(@Body() req: RegisterDto) {
    return this.authService.register(req);
  }
}
