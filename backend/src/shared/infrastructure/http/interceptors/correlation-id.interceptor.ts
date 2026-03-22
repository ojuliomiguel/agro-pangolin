import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Garantir que temos um ID. Se pino-http não setar a tempo, geramos um fallback seguro
    const correlationId =
      (req.id as string) || (req.headers['x-correlation-id'] as string) || uuidv4();
      
    // Anexa no header de resposta
    res.setHeader('x-correlation-id', correlationId);

    return next.handle();
  }
}

