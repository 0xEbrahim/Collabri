import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/types';

@Injectable()
export class JWTService {
  constructor(
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload) {
    return await this.jwt.signAsync(payload, {
      secret: this.cfg.get<string>('ACC_SECRET'),
      expiresIn: this.cfg.get<string>('ACC_EXP'),
    });
  }

  async verifyAccessToken(token: string) {
    return await this.jwt.verifyAsync(token, {
      secret: this.cfg.get<string>('ACC_SECRET'),
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return await this.jwt.signAsync(payload, {
      secret: this.cfg.get<string>('REF_SECRET'),
      expiresIn: this.cfg.get<string>('REF_EXP'),
    });
  }

  async verifyRefreshToken(token: string) {
    return await this.jwt.verifyAsync(token, {
      secret: this.cfg.get<string>('REF_SECRET'),
    });
  }
}
