import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JWTService } from 'src/modules/auth/dto/Jwt.service';
import { JwtPayload } from '../types/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JWTService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let token = request.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authorization token');
    }
    token = token.split(' ')[1];
    const payload: JwtPayload = await this.jwt.verifyAccessToken(token);
    request['user'] = { id: payload.id, role: payload.role };
    console.log('Inside guard');
    return true;
  }
}
