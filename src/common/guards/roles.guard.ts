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
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private async _handleGqlRoleGuard(
    ctx: GqlExecutionContext,
    roles: USER_ROLE[],
  ): Promise<boolean> {
    const { req } = ctx.getContext();
    return this._checkCorrectRole(req, roles);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }
    if (context.getType<GqlContextType>() === 'graphql') {
      return this._handleGqlRoleGuard(
        GqlExecutionContext.create(context),
        roles,
      );
    }
    const request = context.switchToHttp().getRequest<Request>();
    return this._checkCorrectRole(request, roles);
  }

  private _checkCorrectRole(req: any, roles: USER_ROLE[]): boolean {
    const user: JwtPayload = req['User'];
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('You are not authorized to do this action.');
    }
    return true;
  }
}
