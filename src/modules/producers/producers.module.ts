import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProducerEntity } from "./infrastructure/database/typeorm/entities/producer.entity";
import { FarmEntity } from "./infrastructure/database/typeorm/entities/farm.entity";
import { HarvestEntity } from "./infrastructure/database/typeorm/entities/harvest.entity";
import { CropEntity } from "./infrastructure/database/typeorm/entities/crop.entity";
import { ProducerTypeOrmRepository } from "./infrastructure/database/typeorm/repositories/producer-typeorm.repository";
import { ProducerReadTypeOrmRepository } from "./infrastructure/database/typeorm/repositories/producer-read-typeorm.repository";
import { ProducersController } from "./infrastructure/http/controllers/producers.controller";
import { CreateProducerUseCase } from "./application/use-cases/create-producer/create-producer.use-case";
import { UpdateProducerUseCase } from "./application/use-cases/update-producer/update-producer.use-case";
import { DeleteProducerUseCase } from "./application/use-cases/delete-producer/delete-producer.use-case";
import { GetProducerUseCase } from "./application/use-cases/get-producer/get-producer.use-case";
import { ListProducersUseCase } from "./application/use-cases/list-producers/list-producers.use-case";
import { DocumentValidatorService } from "./infrastructure/services/document-validator.service";
import {
  DOCUMENT_VALIDATOR,
  PRODUCER_READ_REPOSITORY,
  PRODUCER_REPOSITORY,
} from "./infrastructure/providers/tokens";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProducerEntity,
      FarmEntity,
      HarvestEntity,
      CropEntity,
    ]),
  ],
  controllers: [ProducersController],
  providers: [
    CreateProducerUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
    GetProducerUseCase,
    ListProducersUseCase,
    {
      provide: PRODUCER_REPOSITORY,
      useClass: ProducerTypeOrmRepository,
    },
    {
      provide: PRODUCER_READ_REPOSITORY,
      useClass: ProducerReadTypeOrmRepository,
    },
    {
      provide: DOCUMENT_VALIDATOR,
      useClass: DocumentValidatorService,
    },
  ],
  exports: [
    PRODUCER_REPOSITORY,
    PRODUCER_READ_REPOSITORY,
    DOCUMENT_VALIDATOR,
  ],
})
export class ProducersModule {}
