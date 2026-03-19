import { ListProducersUseCase } from './list-producers.use-case';
import type { ProducerReadRepository } from '../../../domain/ports/producer-read-repository';
import { makeProducer } from '../test-helpers/domain.fixtures';

const mockReadRepository: jest.Mocked<ProducerReadRepository> = {
  findAll: jest.fn(),
};

describe('ListProducersUseCase', () => {
  let useCase: ListProducersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListProducersUseCase(mockReadRepository);
  });

  it('deve retornar lista paginada de produtores', async () => {
    const producers = [makeProducer({ id: 'p-1' }), makeProducer({ id: 'p-2' })];
    mockReadRepository.findAll.mockResolvedValue({
      data: producers,
      total: 2,
      page: 1,
      limit: 10,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(mockReadRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it('deve retornar lista vazia quando não há produtores', async () => {
    mockReadRepository.findAll.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    const result = await useCase.execute({});

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('deve usar paginação padrão (page=1, limit=10) quando não informado', async () => {
    mockReadRepository.findAll.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await useCase.execute({});

    expect(mockReadRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('deve mapear todos os produtores para output primitivo', async () => {
    const producers = [makeProducer({ id: 'p-1' }), makeProducer({ id: 'p-2' })];
    mockReadRepository.findAll.mockResolvedValue({
      data: producers,
      total: 2,
      page: 1,
      limit: 10,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    result.data.forEach((output) => {
      expect(output).toHaveProperty('id');
      expect(output).toHaveProperty('document');
      expect(output).toHaveProperty('name');
      expect(output).toHaveProperty('farms');
    });
  });
});
