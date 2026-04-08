import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: any) {
    if (!dto.email || !dto.newPassword) {
      throw new UnauthorizedException('Email and newPassword are required');
    }
    return this.authService.resetPassword(dto.email, dto.newPassword);
  }
}
