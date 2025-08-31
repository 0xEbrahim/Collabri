import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshToken } from 'src/common/decorators/refreshToken.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return await this.authService.register(signUpDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }

  @Post('refresh')
  async refresh(@RefreshToken() refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }

  @Patch('verifyEmail/:code')
  async verifyEmail(@Param('code') code: string) {
    return await this.authService.verifyEmail(code);
  }
}
