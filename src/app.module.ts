import { Module } from "@nestjs/common";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { ProducersModule } from "./modules/producers/producers.module";
import { HealthModule } from "./modules/health/health.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [DatabaseModule, ProducersModule, HealthModule, DashboardModule],
})
export class AppModule {}
