import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProducerReadRepository } from "../../../../domain/ports/producer-read-repository";
import {
  ListProducersFilter,
  PaginatedResult,
} from "../../../../domain/ports/producer-repository";
import { Producer } from "../../../../domain/entities/producer";
import { ProducerEntity } from "../entities/producer.entity";
import { ProducerTypeOrmMapper } from "../mappers/producer-typeorm.mapper";

@Injectable()
export class ProducerReadTypeOrmRepository implements ProducerReadRepository {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly repository: Repository<ProducerEntity>,
  ) {}

  async findAll(
    filter: ListProducersFilter,
  ): Promise<PaginatedResult<Producer>> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const [entities, total] = await this.repository.findAndCount({
      relations: ["farms", "farms.harvests", "farms.harvests.crops"],
      skip,
      take: limit,
      order: {
        name: "ASC",
      },
    });

    const data = entities.map((entity) =>
      ProducerTypeOrmMapper.toDomain(entity),
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
