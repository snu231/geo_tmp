import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import express from 'express';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  // app.use('/public', express.static(join(__dirname, '../public')));

  await app.listen(3000);
}
bootstrap();
