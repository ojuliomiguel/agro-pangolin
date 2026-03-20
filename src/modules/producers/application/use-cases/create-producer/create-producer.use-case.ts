import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../../../shared/use-case.interface";
import { ProducerOutput, ProducerMapper } from "../producer.mapper";
import type { FarmInput } from "../shared-inputs.dto";
import type { ProducerRepository } from "../../../domain/ports/producer-repository";
import type { DocumentValidator } from "../../../domain/services/document-validator";
import {
  PRODUCER_REPOSITORY,
  DOCUMENT_VALIDATOR,
} from "../../../infrastructure/providers/tokens";
import { Producer } from "../../../domain/entities/producer";
import { Farm } from "../../../domain/entities/farm";
import { Harvest } from "../../../domain/entities/harvest";
import { Crop } from "../../../domain/entities/crop";
import { Document } from "../../../domain/value-objects/document";
import { Area } from "../../../domain/value-objects/area";
import { StateCode } from "../../../domain/value-objects/state-code";
import { HarvestYear } from "../../../domain/value-objects/harvest-year";
import { CropName } from "../../../domain/value-objects/crop-name";
import { randomUUID } from "crypto";

export interface CreateProducerInput {
  document: string;
  name: string;
  farms?: FarmInput[];
}

export type CreateProducerOutput = ProducerOutput;

@Injectable()
export class CreateProducerUseCase implements UseCase<
  CreateProducerInput,
  CreateProducerOutput
> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
    @Inject(DOCUMENT_VALIDATOR)
    private readonly documentValidator: DocumentValidator,
  ) {}

  async execute(input: CreateProducerInput): Promise<CreateProducerOutput> {
    if (!this.documentValidator.validate(input.document)) {
      throw new Error(`Documento inválido: ${input.document}`);
    }

    const document = Document.create(input.document);

    const farms = (input.farms ?? []).map((farmInput) => {
      const harvests = (farmInput.harvests ?? []).map((harvestInput) => {
        const crops = (harvestInput.crops ?? []).map(
          (cropInput) =>
            new Crop(
              cropInput.id ?? randomUUID(),
              CropName.create(cropInput.name),
            ),
        );
        return new Harvest(
          harvestInput.id ?? randomUUID(),
          HarvestYear.create(harvestInput.year),
          crops,
        );
      });

      return new Farm({
        id: farmInput.id ?? randomUUID(),
        name: farmInput.name,
        city: farmInput.city,
        state: StateCode.create(farmInput.state),
        totalArea: Area.create(farmInput.totalArea),
        agriculturalArea: Area.create(farmInput.agriculturalArea),
        vegetationArea: Area.create(farmInput.vegetationArea),
        harvests,
      });
    });

    const producer = new Producer({
      id: randomUUID(),
      document,
      name: input.name,
      farms,
    });

    const saved = await this.producerRepository.create(producer);
    return ProducerMapper.toOutput(saved);
  }
}
