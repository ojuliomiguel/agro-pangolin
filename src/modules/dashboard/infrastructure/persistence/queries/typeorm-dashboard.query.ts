import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DashboardQuery } from "../../../domain/ports/dashboard-query";
import { DashboardSummary } from "../../../domain/view-models/dashboard-summary";
import { FarmEntity } from "../../../../producers/infrastructure/database/typeorm/entities/farm.entity";
import { CropEntity } from "../../../../producers/infrastructure/database/typeorm/entities/crop.entity";

@Injectable()
export class TypeormDashboardQuery implements DashboardQuery {
  constructor(
    @InjectRepository(FarmEntity)
    private readonly farmRepository: Repository<FarmEntity>,
    @InjectRepository(CropEntity)
    private readonly cropRepository: Repository<CropEntity>,
  ) {}

  async getSummary(): Promise<DashboardSummary> {
    const totalFarms = await this.farmRepository.count();

    const rawTotals:
      | {
          totalHectares: string | number;
          agricultural: string | number;
          vegetation: string | number;
        }
      | undefined = await this.farmRepository
      .createQueryBuilder("farm")
      .select("COALESCE(SUM(farm.totalArea), 0)", "totalHectares")
      .addSelect("COALESCE(SUM(farm.agriculturalArea), 0)", "agricultural")
      .addSelect("COALESCE(SUM(farm.vegetationArea), 0)", "vegetation")
      .getRawOne();

    const {
      totalHectares = 0,
      agricultural = 0,
      vegetation = 0,
    } = rawTotals || {};

    const byStateRaw: { state: string; count: string | number }[] =
      await this.farmRepository
        .createQueryBuilder("farm")
        .select("farm.state", "state")
        .addSelect("COUNT(farm.id)", "count")
        .groupBy("farm.state")
        .getRawMany();

    const byState = byStateRaw.map((row) => ({
      state: row.state,
      count: Number(row.count),
    }));

    const byCropRaw: { crop: string; count: string | number }[] =
      await this.cropRepository
        .createQueryBuilder("crop")
        .select("crop.name", "crop")
        .addSelect("COUNT(crop.id)", "count")
        .groupBy("crop.name")
        .getRawMany();

    const byCrop = byCropRaw.map((row) => ({
      crop: row.crop,
      count: Number(row.count),
    }));

    return {
      totalFarms,
      totalHectares: Number(totalHectares) || 0,
      byState,
      byCrop,
      bySoilUse: {
        agricultural: Number(agricultural) || 0,
        vegetation: Number(vegetation) || 0,
      },
    };
  }
}
