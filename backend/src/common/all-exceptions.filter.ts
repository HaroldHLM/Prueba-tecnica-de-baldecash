import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Captura cualquier excepción no manejada explícitamente en un controlador/servicio.
 * - Si es una HttpException (ej. la 422 de validación, o un NotFoundException),
 *   respeta su status y su cuerpo tal cual.
 * - Si es cualquier otro error (uno no controlado: fallo de conexión a la BD, bug,
 *   etc.), responde 500 con un mensaje genérico y NUNCA expone el stack trace ni
 *   el mensaje interno del error al cliente. El detalle real solo se registra en
 *   el log del servidor.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    this.logger.error(
      'Error no controlado',
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    });
  }
}
