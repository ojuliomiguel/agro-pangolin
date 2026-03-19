import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { ProducerRepository } from "../../../../domain/ports/producer-repository";
import { Producer } from "../../../../domain/entities/producer";
import { ProducerEntity } from "../entities/producer.entity";
import { ProducerTypeOrmMapper } from "../mappers/producer-typeorm.mapper";
import { FarmEntity } from "../entities/farm.entity";

@Injectable()
export class ProducerTypeOrmRepository implements ProducerRepository {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly repository: Repository<ProducerEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(producer: Producer): Promise<Producer> {
    const ormEntity = ProducerTypeOrmMapper.toOrm(producer);
    const savedEntity = await this.repository.save(ormEntity);
    return ProducerTypeOrmMapper.toDomain(savedEntity);
  }

  async update(producer: Producer): Promise<Producer> {
    const ormEntity = ProducerTypeOrmMapper.toOrm(producer);

    await this.entityManager.transaction(async (manager) => {
      await manager.delete(FarmEntity, { producerId: producer.id });

      await manager.save(ProducerEntity, ormEntity);
    });

    return producer;
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producer with id ${id} not found`);
    }
  }

  async findById(id: string): Promise<Producer | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["farms", "farms.harvests", "farms.harvests.crops"],
    });

    if (!entity) return null;

    return ProducerTypeOrmMapper.toDomain(entity);
  }
}
