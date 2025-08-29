import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from 'fastify-multipart'; // to upload files
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
    app.register(fastifyMultipart);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    const PORT = process.env.APP_PORT || 3001;
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.listen(PORT, '0.0.0.0');
    console.log(`PROJECT REQUEST API RUNNING ON PORT ${PORT}`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}

bootstrap();
