import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardController } from "./infrastructure/http/dashboard.controller";
import { GetDashboardUseCase } from "./application/use-cases/get-dashboard.use-case";
import { TypeormDashboardQuery } from "./infrastructure/persistence/queries/typeorm-dashboard.query";
import { DASHBOARD_QUERY } from "./infrastructure/providers/tokens";
import { FarmEntity } from "../producers/infrastructure/database/typeorm/entities/farm.entity";
import { CropEntity } from "../producers/infrastructure/database/typeorm/entities/crop.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FarmEntity, CropEntity])],
  controllers: [DashboardController],
  providers: [
    GetDashboardUseCase,
    {
      provide: DASHBOARD_QUERY,
      useClass: TypeormDashboardQuery,
    },
  ],
})
export class DashboardModule {}
