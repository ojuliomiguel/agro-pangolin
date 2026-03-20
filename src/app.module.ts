import { Module } from "@nestjs/common";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { ProducersModule } from "./modules/producers/producers.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [DatabaseModule, ProducersModule, HealthModule],
})
export class AppModule {}
