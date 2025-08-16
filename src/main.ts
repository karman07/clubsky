import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with all options
  app.enableCors({
    origin: '*', // allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // allow all methods
    allowedHeaders: '*', // allow all headers
    exposedHeaders: '*', // expose all headers
    credentials: true, // allow cookies / auth headers
    preflightContinue: false,
    optionsSuccessStatus: 204, // for legacy browsers
  });

  // Serve uploads folder
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
