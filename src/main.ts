import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as fs from 'fs';
import morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

const logStream = fs.createWriteStream(
  path.join(process.cwd(), 'logs', 'api.log'),
  {
    flags: 'a',
  },
);

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
  app.use(helmet());
  app.use(morgan('tiny', { stream: logStream }));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
