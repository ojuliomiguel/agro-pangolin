import { CreateProducerUseCase } from './create-producer.use-case';
import type { ProducerRepository } from '../../../domain/ports/producer-repository';
import type { DocumentValidator } from '../../../domain/services/document-validator';
import { makeProducer, VALID_CPF } from '../test-helpers/domain.fixtures';

const mockRepository: jest.Mocked<ProducerRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
};

const mockValidator: jest.Mocked<DocumentValidator> = {
  validate: jest.fn(),
};

const baseInput = {
  document: VALID_CPF,
  name: 'João da Silva',
  farms: [
    {
      name: 'Fazenda Boa Vista',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 100,
      agriculturalArea: 60,
      vegetationArea: 30,
      harvests: [
        {
          year: '2024/2025',
          crops: [{ name: 'Soja' }],
        },
      ],
    },
  ],
};

describe('CreateProducerUseCase', () => {
  let useCase: CreateProducerUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateProducerUseCase(mockRepository, mockValidator);
  });

  it('deve criar produtor com sucesso', async () => {
    const producer = makeProducer();
    mockValidator.validate.mockReturnValue(true);
    mockRepository.create.mockResolvedValue(producer);

    const result = await useCase.execute(baseInput);

    expect(mockValidator.validate).toHaveBeenCalledWith(VALID_CPF);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(result.name).toBe('João da Silva');
    expect(result.farms).toHaveLength(1);
  });

  it('deve lançar erro quando documento é inválido', async () => {
    mockValidator.validate.mockReturnValue(false);

    await expect(
      useCase.execute({ ...baseInput, document: '000.000.000-00' }),
    ).rejects.toThrow('Documento inválido');

    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando nome é vazio', async () => {
    mockValidator.validate.mockReturnValue(true);

    await expect(
      useCase.execute({ ...baseInput, name: '' }),
    ).rejects.toThrow('nome do produtor é obrigatório');
  });

  it('deve lançar erro quando área agrícola + vegetação ultrapassam área total', async () => {
    mockValidator.validate.mockReturnValue(true);

    const input = {
      ...baseInput,
      farms: [
        {
          ...baseInput.farms[0],
          totalArea: 50,
          agriculturalArea: 40,
          vegetationArea: 30,
        },
      ],
    };

    await expect(useCase.execute(input)).rejects.toThrow();
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('deve criar produtor sem farms', async () => {
    const producerSemFarms = makeProducer();
    mockValidator.validate.mockReturnValue(true);
    mockRepository.create.mockResolvedValue(producerSemFarms);

    const result = await useCase.execute({ document: VALID_CPF, name: 'Maria', farms: [] });

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });
});
