import { NotFoundException, Inject } from "@nestjs/common";
import { UseCase } from "../../../../../shared/use-case.interface";
import { ProducerOutput, ProducerMapper } from "../producer.mapper";
import { FarmInput } from "../shared-inputs.dto";
import { ProducerRepository } from "../../../domain/ports/producer-repository";
import { DocumentValidator } from "../../../domain/services/document-validator";
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

export interface UpdateProducerInput {
  id: string;
  name?: string;
  document?: string;
  farms?: FarmInput[];
}

export type UpdateProducerOutput = ProducerOutput;

export class UpdateProducerUseCase implements UseCase<
  UpdateProducerInput,
  UpdateProducerOutput
> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
    @Inject(DOCUMENT_VALIDATOR)
    private readonly documentValidator: DocumentValidator,
  ) {}

  async execute(input: UpdateProducerInput): Promise<UpdateProducerOutput> {
    const existing = await this.producerRepository.findById(input.id);

    if (!existing) {
      throw new NotFoundException(
        `Produtor com id "${input.id}" não encontrado.`,
      );
    }

    let document = existing.document;
    if (input.document !== undefined) {
      if (!this.documentValidator.validate(input.document)) {
        throw new Error(`Documento inválido: ${input.document}`);
      }
      document = Document.create(input.document);
    }

    let farms = existing.farms;
    if (input.farms !== undefined) {
      farms = input.farms.map((farmInput) => {
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
    }

    const updated = new Producer({
      id: existing.id,
      document,
      name: input.name ?? existing.name,
      farms,
    });

    const saved = await this.producerRepository.update(updated);
    return ProducerMapper.toOutput(saved);
  }
}
