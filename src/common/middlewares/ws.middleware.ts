import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../types/types';
import { JWTService } from 'src/modules/auth/dto/Jwt.service';

@Injectable()
export class SocketAuthMiddleware {
  constructor(private readonly jwtService: JWTService) {}

  use = async (client: any, next: (err?: any) => void) => {
    try {
      let token = client.handshake.headers.authorization;
      if (!token || !token.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Invalid or missing authorization token',
        );
      }
      token = token.split(' ')[1];
      const payload: JwtPayload = await this.jwtService.verifyAccessToken(token);
      client['user'] = { id: payload.id, role: payload.role };
      next();
    } catch (err) {
      next(err);
    }
  };
}
