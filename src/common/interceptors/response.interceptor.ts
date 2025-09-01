import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { IResponse } from '../types/types';
import { GqlContextType } from '@nestjs/graphql';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.getType<GqlContextType>() === 'graphql') {
      return next.handle();
    }
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: IResponse) => {
        if (!data) {
          return response;
        }
        if (data?.refreshToken) {
          response.cookie('jwt', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
        }
        return {
          status: 'Success',
          statusCode: response.statusCode,
          data: data.data,
          token: data.token,
          message: data.message,
          page: data.page,
          size: data.size,
        };
      }),
    );
  }
}
