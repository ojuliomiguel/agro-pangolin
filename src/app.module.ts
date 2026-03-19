import { Module } from "@nestjs/common";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { ProducersModule } from "./modules/producers/producers.module";

@Module({
  imports: [DatabaseModule, ProducersModule],
})
export class AppModule {}
