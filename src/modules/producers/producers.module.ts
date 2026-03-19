import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProducerEntity } from "./infrastructure/database/typeorm/entities/producer.entity";
import { FarmEntity } from "./infrastructure/database/typeorm/entities/farm.entity";
import { HarvestEntity } from "./infrastructure/database/typeorm/entities/harvest.entity";
import { CropEntity } from "./infrastructure/database/typeorm/entities/crop.entity";
import { ProducerTypeOrmRepository } from "./infrastructure/database/typeorm/repositories/producer-typeorm.repository";
import { ProducerReadTypeOrmRepository } from "./infrastructure/database/typeorm/repositories/producer-read-typeorm.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProducerEntity,
      FarmEntity,
      HarvestEntity,
      CropEntity,
    ]),
  ],
  providers: [
    {
      provide: "PRODUCER_REPOSITORY",
      useClass: ProducerTypeOrmRepository,
    },
    {
      provide: "PRODUCER_READ_REPOSITORY",
      useClass: ProducerReadTypeOrmRepository,
    },
  ],
  exports: ["PRODUCER_REPOSITORY", "PRODUCER_READ_REPOSITORY"],
})
export class ProducersModule {}
