import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/user/entities/user.entity';
import { Request } from 'express';
import { JwtPayload } from '../types/types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user: JwtPayload = request['User'];
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('You are not authorized to do this action.');
    }
    return true;
  }
}
