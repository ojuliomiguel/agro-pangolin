import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { ValidationError } from "class-validator";
import { ApiExceptionFilter } from "./api-exception.filter";

export interface HttpBootstrapOptions {
  corsOrigins?: string | string[] | boolean;
  docsEnabled?: boolean;
  docsPath?: string;
  docsJsonPath?: string;
  apiTitle?: string;
  apiDescription?: string;
  apiVersion?: string;
}

export function configureHttpApp(
  app: INestApplication,
  options: HttpBootstrapOptions = {},
): void {
  const expressApp = app.getHttpAdapter().getInstance() as {
    disable?: (name: string) => void;
  };

  expressApp.disable?.("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    origin: normalizeCorsOrigins(options.corsOrigins),
    credentials: true,
  });
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new ApiExceptionFilter());

  if (options.docsEnabled !== false) {
    registerSwagger(app, options);
  }
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors: ValidationError[]) => {
      return new BadRequestException(joinValidationErrors(errors));
    },
  });
}

function registerSwagger(
  app: INestApplication,
  options: HttpBootstrapOptions,
): void {
  const docsPath = trimSlashes(options.docsPath ?? "docs");
  const docsJsonPath = trimSlashes(options.docsJsonPath ?? "docs-json");
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(options.apiTitle ?? "Agro Pangolin API")
      .setDescription(
        options.apiDescription ??
          "API REST do contexto producers do projeto Agro Pangolin.",
      )
      .setVersion(options.apiVersion ?? "1.0.0")
      .build(),
    { deepScanRoutes: true },
  );

  SwaggerModule.setup(docsPath, app, document);

  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();
  if (typeof instance.get === "function") {
    instance.get(
      `/${docsJsonPath}`,
      (
        _request: unknown,
        response: {
          json: (payload: unknown) => void;
        },
      ) => {
        response.json(document);
      },
    );
  }
}

function normalizeCorsOrigins(
  origins?: string | string[] | boolean,
): string[] | boolean {
  if (origins === undefined) {
    return true;
  }

  if (Array.isArray(origins)) {
    return origins;
  }

  if (typeof origins === "boolean") {
    return origins;
  }

  const trimmed = origins.trim();
  if (trimmed === "" || trimmed === "*") {
    return true;
  }

  const parsed = trimmed
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return parsed.length === 0 ? true : parsed;
}

function joinValidationErrors(errors: ValidationError[]): string {
  const messages = flattenValidationErrors(errors);
  return messages.length > 0
    ? messages.join("; ")
    : "Dados inválidos na requisição.";
}

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = "",
): string[] {
  return errors.flatMap((error) => {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const currentMessages = Object.values(error.constraints ?? {}).map(
      (message) => `${path}: ${message}`,
    );
    const childMessages = flattenValidationErrors(error.children ?? [], path);
    return [...currentMessages, ...childMessages];
  });
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}
