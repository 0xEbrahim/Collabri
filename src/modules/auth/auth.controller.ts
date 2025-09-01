import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshToken } from 'src/common/decorators/refreshToken.decorator';
import { GoogleOAuthGuard } from 'src/common/guards/google.guard';
import type { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entity/token.entity';
import { Repository } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(TokenEntity)
    private TokenRepository: Repository<TokenEntity>,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return await this.authService.register(signUpDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('jwt');
    let token = this.TokenRepository.create({
      token: req.headers.authorization?.split(' ')[1],
    });
    token = await this.TokenRepository.save(token);
    res.status(200).json({
      status: 'Success',
      message: "You've been logged out successfully.",
    });
  }

  @Post('refresh')
  async refresh(@RefreshToken() refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() req: Request) {
    return this.authService.handleGoogleOAuth(req['user'] as any);
  }

  @Patch('verifyEmail/:code')
  async verifyEmail(@Param('code') code: string) {
    return await this.authService.verifyEmail(code);
  }
}
