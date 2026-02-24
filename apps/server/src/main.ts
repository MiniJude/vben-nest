import { env } from 'node:process';

import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  } as NestApplicationOptions);

  app.use(json({ strict: false }));
  app.use(urlencoded({ extended: true }));
  const corsOrigin = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : true;
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(env.PORT || 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`NestJS server is running on: http://localhost:${port}`);
}
bootstrap();
