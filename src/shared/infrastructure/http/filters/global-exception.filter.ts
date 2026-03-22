import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = request.id || response.getHeader('x-correlation-id') || 'gen-fallback';
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || res;
    }

    if (status >= 500) {
      // Registra erros graves em log de forma estruturada, com stack trace
      this.logger.error(
        `[${correlationId}] ${request.method} ${request.url} - ${
          exception instanceof Error ? exception.message : String(exception)
        }`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      // Erros 4xx
      this.logger.warn(`[${correlationId}] ${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`);
    }

    // Padronizar o corpo da resposta
    response.status(status).json({
      statusCode: status,
      message,
      correlationId,
      timestamp,
      path: request.url,
    });
  }
}
