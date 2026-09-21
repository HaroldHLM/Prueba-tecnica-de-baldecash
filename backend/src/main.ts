import 'dotenv/config';
import {
  UnprocessableEntityException,
  ValidationPipe,
  type ValidationError,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';

function formatearErroresDeValidacion(errores: ValidationError[]) {
  return errores.map((error) => ({
    campo: error.property,
    motivo: Object.values(error.constraints ?? {})[0] ?? 'Valor inválido',
  }));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta campos que no están en el DTO
      forbidNonWhitelisted: true, // rechaza si envían campos que no existen
      transform: true, // convierte tipos (ej. query params string -> number)
      errorHttpStatusCode: 422,
      exceptionFactory: (errores) =>
        new UnprocessableEntityException({
          statusCode: 422,
          message: 'Error de validación',
          errores: formatearErroresDeValidacion(errores),
        }),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
