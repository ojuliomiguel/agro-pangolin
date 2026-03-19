import { Inject } from "@nestjs/common";
import { UseCase } from "../../../../../shared/use-case.interface";
import { ProducerOutput, ProducerMapper } from "../producer.mapper";
import { ProducerReadRepository } from "../../../domain/ports/producer-read-repository";
import { PRODUCER_READ_REPOSITORY } from "../../../infrastructure/providers/tokens";

export interface ListProducersInput {
  page?: number;
  limit?: number;
}

export interface ListProducersOutput {
  data: ProducerOutput[];
  total: number;
  page: number;
  limit: number;
}

export class ListProducersUseCase implements UseCase<
  ListProducersInput,
  ListProducersOutput
> {
  constructor(
    @Inject(PRODUCER_READ_REPOSITORY)
    private readonly producerReadRepository: ProducerReadRepository,
  ) {}

  async execute(input: ListProducersInput): Promise<ListProducersOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const result = await this.producerReadRepository.findAll({ page, limit });

    return {
      data: result.data.map(ProducerMapper.toOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
