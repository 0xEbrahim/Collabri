import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JWTService } from 'src/modules/auth/dto/Jwt.service';
import { JwtPayload } from '../types/types';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/modules/auth/entity/token.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JWTService,
    @InjectRepository(TokenEntity)
    private TokenRepository: Repository<TokenEntity>,
  ) {}

  private async _handleWSAuthGuard(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const tk = client.handshake.headers.authorization;
    const token = this._extractToken(tk);
    const payload: JwtPayload = await this.jwt.verifyAccessToken(token);
    client['User'] = { id: payload.id, role: payload.role };
    return true;
  }

  private async _handleGqlAuthGuard(
    ctx: GqlExecutionContext,
  ): Promise<boolean> {
    const { req } = ctx.getContext();
    let tk = req.headers.authorization;
    const token = this._extractToken(tk);
    const payload: JwtPayload = await this.jwt.verifyAccessToken(token);
    req['User'] = { id: payload.id, role: payload.role };
    return true;
  }
  private _extractToken(token: any) {
    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authorization token');
    }
    token = token.split(' ')[1];
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<GqlContextType>() === 'graphql') {
      return this._handleGqlAuthGuard(GqlExecutionContext.create(context));
    }
    if (context.getType() === 'ws') {
      return this._handleWSAuthGuard(context);
    }
    const request = context.switchToHttp().getRequest<Request>();
    let tk = request.headers.authorization;
    const token = this._extractToken(tk);
    const tokenBlocked = await this.TokenRepository.findOneBy({ token: token });
    if (tokenBlocked) {
      throw new UnauthorizedException('Invalid or missing authorization token');
    }
    const payload: JwtPayload = await this.jwt.verifyAccessToken(token);
    request['User'] = { id: payload.id, role: payload.role };
    return true;
  }
}
