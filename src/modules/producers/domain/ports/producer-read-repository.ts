import { Producer } from "../entities/producer";
import { ListProducersFilter, PaginatedResult } from "./producer-repository";

export interface ProducerReadRepository {
  findAll(filter: ListProducersFilter): Promise<PaginatedResult<Producer>>;
}
