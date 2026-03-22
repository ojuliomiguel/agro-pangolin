import { Producer } from "../entities/producer";

export interface ListProducersFilter {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProducerRepository {
  create(producer: Producer): Promise<Producer>;
  update(producer: Producer): Promise<Producer>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Producer | null>;
}
