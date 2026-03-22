import { Module } from "@nestjs/common";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { ProducersModule } from "./modules/producers/producers.module";
import { HealthModule } from "./modules/health/health.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { AppLoggerModule } from "./shared/infrastructure/logger/logger.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalExceptionFilter } from "./shared/infrastructure/http/filters/global-exception.filter";
import { CorrelationIdInterceptor } from "./shared/infrastructure/http/interceptors/correlation-id.interceptor";

@Module({
  imports: [
    AppLoggerModule,
    DatabaseModule, 
    ProducersModule, 
    HealthModule, 
    DashboardModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
