import * as dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureHttpApp } from "./shared/infrastructure/http/http-bootstrap";
import { Logger } from "nestjs-pino";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  configureHttpApp(app, {
    corsOrigins: process.env.CORS_ORIGIN,
    docsEnabled: process.env.DOCS_ENABLED !== "false",
  });

  await app.listen(Number.parseInt(process.env.PORT ?? "3000", 10));
}
bootstrap();
