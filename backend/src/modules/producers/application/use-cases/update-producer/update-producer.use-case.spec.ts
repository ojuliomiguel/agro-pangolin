import { NotFoundException } from "@nestjs/common";
import { UpdateProducerUseCase } from "./update-producer.use-case";
import type { ProducerRepository } from "../../../domain/ports/producer-repository";
import type { DocumentValidator } from "../../../domain/services/document-validator";
import { makeProducer, VALID_CPF } from "../test-helpers/domain.fixtures";

const mockRepository: jest.Mocked<ProducerRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
};

const mockValidator: jest.Mocked<DocumentValidator> = {
  validate: jest.fn(),
};

describe("UpdateProducerUseCase", () => {
  let useCase: UpdateProducerUseCase;
  const existingProducer = makeProducer({ id: "producer-1" });

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateProducerUseCase(mockRepository, mockValidator);
  });

  it("deve atualizar produtor com sucesso (somente nome)", async () => {
    const updated = makeProducer({ id: "producer-1", name: "Novo Nome" });
    mockRepository.findById.mockResolvedValue(existingProducer);
    mockRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute({
      id: "producer-1",
      name: "Novo Nome",
    });

    expect(mockRepository.findById).toHaveBeenCalledWith("producer-1");
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(result.name).toBe("Novo Nome");
  });

  it("deve lançar NotFoundException quando produtor não existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: "inexistente" })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("deve lançar erro quando novo documento é inválido", async () => {
    mockRepository.findById.mockResolvedValue(existingProducer);
    mockValidator.validate.mockReturnValue(false);

    await expect(
      useCase.execute({ id: "producer-1", document: "000.000.000-00" }),
    ).rejects.toThrow("Documento inválido");

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("deve atualizar farms do produtor", async () => {
    const updatedProducer = makeProducer({ id: "producer-1" });
    mockRepository.findById.mockResolvedValue(existingProducer);
    mockRepository.update.mockResolvedValue(updatedProducer);

    const result = await useCase.execute({
      id: "producer-1",
      farms: [
        {
          name: "Nova Fazenda",
          city: "Campinas",
          state: "SP",
          totalArea: 200,
          agriculturalArea: 120,
          vegetationArea: 50,
          harvests: [],
        },
      ],
    });

    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it("deve atualizar documento quando válido", async () => {
    const updatedProducer = makeProducer({ id: "producer-1" });
    mockRepository.findById.mockResolvedValue(existingProducer);
    mockValidator.validate.mockReturnValue(true);
    mockRepository.update.mockResolvedValue(updatedProducer);

    const result = await useCase.execute({
      id: "producer-1",
      document: VALID_CPF,
    });

    expect(mockValidator.validate).toHaveBeenCalledWith(VALID_CPF);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });
});
