import { NotFoundException } from '@nestjs/common';
import { GetProducerUseCase } from './get-producer.use-case';
import type { ProducerRepository } from '../../../domain/ports/producer-repository';
import { makeProducer } from '../test-helpers/domain.fixtures';

const mockRepository: jest.Mocked<ProducerRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
};

describe('GetProducerUseCase', () => {
  let useCase: GetProducerUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetProducerUseCase(mockRepository);
  });

  it('deve retornar produtor com sucesso', async () => {
    const producer = makeProducer({ id: 'producer-1', name: 'João da Silva' });
    mockRepository.findById.mockResolvedValue(producer);

    const result = await useCase.execute({ id: 'producer-1' });

    expect(mockRepository.findById).toHaveBeenCalledWith('producer-1');
    expect(result.id).toBe('producer-1');
    expect(result.name).toBe('João da Silva');
    expect(result.farms).toHaveLength(1);
    expect(result.farms[0].harvests).toHaveLength(1);
    expect(result.farms[0].harvests[0].crops).toHaveLength(1);
  });

  it('deve lançar NotFoundException quando produtor não existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'inexistente' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve serializar o documento formatado', async () => {
    const producer = makeProducer({ id: 'producer-1' });
    mockRepository.findById.mockResolvedValue(producer);

    const result = await useCase.execute({ id: 'producer-1' });

    // Documento deve estar formatado (com pontos e traço)
    expect(result.document).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });
});
