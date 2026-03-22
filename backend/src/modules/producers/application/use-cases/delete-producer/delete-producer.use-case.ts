import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "../../../../../shared/use-case.interface";
import type { ProducerRepository } from "../../../domain/ports/producer-repository";
import { PRODUCER_REPOSITORY } from "../../../infrastructure/providers/tokens";

export interface DeleteProducerInput {
  id: string;
}

@Injectable()
export class DeleteProducerUseCase implements UseCase<
  DeleteProducerInput,
  void
> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
  ) {}

  async execute(input: DeleteProducerInput): Promise<void> {
    const existing = await this.producerRepository.findById(input.id);

    if (!existing) {
      throw new NotFoundException(
        `Produtor com id "${input.id}" não encontrado.`,
      );
    }

    await this.producerRepository.delete(input.id);
  }
}
