import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "../../../../../shared/use-case.interface";
import { ProducerOutput, ProducerMapper } from "../producer.mapper";
import type { ProducerRepository } from "../../../domain/ports/producer-repository";
import { PRODUCER_REPOSITORY } from "../../../infrastructure/providers/tokens";

export interface GetProducerInput {
  id: string;
}

export type GetProducerOutput = ProducerOutput;

@Injectable()
export class GetProducerUseCase implements UseCase<
  GetProducerInput,
  GetProducerOutput
> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
  ) {}

  async execute(input: GetProducerInput): Promise<GetProducerOutput> {
    const producer = await this.producerRepository.findById(input.id);

    if (!producer) {
      throw new NotFoundException(
        `Produtor com id "${input.id}" não encontrado.`,
      );
    }

    return ProducerMapper.toOutput(producer);
  }
}
