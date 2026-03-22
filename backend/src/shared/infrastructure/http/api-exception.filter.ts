import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import type { Request, Response } from "express";

interface ErrorResponseBody {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const body = this.normalizeException(exception, request);
    response.status(body.statusCode).json(body);
  }

  private normalizeException(
    exception: unknown,
    request: Request,
  ): ErrorResponseBody {
    if (exception instanceof QueryFailedError) {
      return this.mapQueryFailedError(exception, request);
    }

    if (exception instanceof HttpException) {
      return this.mapHttpException(exception, request);
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal Server Error",
        message: "Erro interno do servidor.",
        timestamp: new Date().toISOString(),
        path: request.originalUrl ?? request.url,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "Erro interno do servidor.",
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    };
  }

  private mapHttpException(
    exception: HttpException,
    request: Request,
  ): ErrorResponseBody {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    const normalizedResponse =
      typeof response === "string" ? { message: response } : response;
    const responseObject = normalizedResponse as {
      error?: unknown;
      message?: unknown;
    };

    return {
      statusCode,
      error:
        typeof responseObject.error === "string"
          ? responseObject.error
          : this.reasonPhrase(statusCode),
      message: this.extractMessage(responseObject, exception.message),
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    };
  }

  private mapQueryFailedError(
    exception: QueryFailedError,
    request: Request,
  ): ErrorResponseBody {
    const driverError = exception.driverError as {
      code?: string;
      detail?: string;
      constraint?: string;
    };

    if (driverError?.code === "23505") {
      return {
        statusCode: HttpStatus.CONFLICT,
        error: "Conflict",
        message: this.buildUniqueConstraintMessage(driverError),
        timestamp: new Date().toISOString(),
        path: request.originalUrl ?? request.url,
      };
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      error: "Bad Request",
      message: "Falha ao processar a requisição.",
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    };
  }

  private extractMessage(
    response: Record<string, unknown> | { message?: unknown },
    fallback: string,
  ): string {
    const message = response.message;

    if (Array.isArray(message)) {
      return message.map(String).join("; ");
    }

    if (typeof message === "string") {
      return message;
    }

    return fallback;
  }

  private buildUniqueConstraintMessage(driverError: {
    detail?: string;
    constraint?: string;
  }): string {
    const detail = driverError.detail ?? "";
    const constraint = driverError.constraint ?? "";

    if (detail.includes("document") || constraint.includes("document")) {
      return "Já existe um produtor cadastrado com este documento.";
    }

    return "Já existe um registro com esses dados.";
  }

  private reasonPhrase(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return "Bad Request";
      case HttpStatus.UNAUTHORIZED:
        return "Unauthorized";
      case HttpStatus.FORBIDDEN:
        return "Forbidden";
      case HttpStatus.NOT_FOUND:
        return "Not Found";
      case HttpStatus.CONFLICT:
        return "Conflict";
      case HttpStatus.TOO_MANY_REQUESTS:
        return "Too Many Requests";
      default:
        return "Error";
    }
  }
}
