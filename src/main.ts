import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as fs from 'fs';
import morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const logStream = fs.createWriteStream(
  path.join(process.cwd(), 'logs', 'api.log'),
  {
    flags: 'a',
  },
);

/**
  TODO:
    - Setup graphQL
    - create Get operations on user's
 */

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: '*',
  });
  app.use(cookieParser());
  app.use(morgan('tiny', { stream: logStream }));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        },
      },
    }),
  );
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
