import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() req: LoginDto) {
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() req: RegisterDto) {
    return this.authService.register(req);
  }
}
