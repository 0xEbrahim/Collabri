import { TypeORMError } from 'typeorm';

export interface HttpExceptionResponse {
  statusCode: number;
  message: any;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}
