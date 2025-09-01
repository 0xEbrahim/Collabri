import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import fs from 'fs';
import { Request, Response } from 'express';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './exceptionResponse.interface';
import path from 'path';
import { QueryFailedError } from 'typeorm';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import { GqlContextType } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    // console.log(exception)
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errResponse = exception.getResponse();
      message =
        (errResponse as HttpExceptionResponse).message || exception.message;
    } else if (exception instanceof TokenExpiredError) {
      statusCode = 401;
      message = `You json web token is expired : ${exception.expiredAt}`;
    } else if (exception instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    } else if (exception instanceof QueryFailedError) {
      const err: any = exception;
      if (err.code === '23505') {
        statusCode = HttpStatus.CONFLICT;
        message = err.detail;
      } else if (err.code === '42703') {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = err.message;
      }
    }
    if (host.getType<GqlContextType>() === 'graphql') {
      return new GraphQLError(message, {
        extensions: {
          code: statusCode,
          status: 'Error',
        },
      });
    }
    const errorResponse = this.getErrorResponse(statusCode, message, request);
    const logged = this.getLogError(errorResponse, request, exception);
    await this.logError(logged);
    response.status(statusCode).json(errorResponse);
  }

  private getErrorResponse = (
    status: number,
    errorMsg: string,
    req: Request,
  ): CustomHttpExceptionResponse => ({
    method: req.method,
    message: errorMsg,
    path: req.originalUrl,
    statusCode: status,
    timeStamp: new Date(),
  });

  private getLogError = (
    errResponse: CustomHttpExceptionResponse,
    req: Request,
    exc: unknown,
  ): string => {
    const { message, method, path, statusCode, timeStamp } = errResponse;
    const msg = `Response code: ${statusCode} - Method: ${method} - URL: ${path} - time: [${timeStamp}]\nUSER: ${JSON.stringify(req?.['user'] ?? 'Not signed in')}\n${exc instanceof HttpException ? exc.stack : message}\n\n`;
    return msg;
  };

  private logError = async (logMsg: string): Promise<void> => {
    try {
      await fs.promises.appendFile(
        path.join(process.cwd(), 'logs', 'error.log'),
        logMsg,
        'utf8',
      );
    } catch (e) {
      if (e) throw e;
    }
  };
}
