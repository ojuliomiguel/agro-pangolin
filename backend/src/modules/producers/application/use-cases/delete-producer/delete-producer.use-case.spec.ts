import { NotFoundException } from "@nestjs/common";
import { DeleteProducerUseCase } from "./delete-producer.use-case";
import type { ProducerRepository } from "../../../domain/ports/producer-repository";
import { makeProducer } from "../test-helpers/domain.fixtures";

const mockRepository: jest.Mocked<ProducerRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
};

describe("DeleteProducerUseCase", () => {
  let useCase: DeleteProducerUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteProducerUseCase(mockRepository);
  });

  it("deve deletar produtor com sucesso", async () => {
    mockRepository.findById.mockResolvedValue(
      makeProducer({ id: "producer-1" }),
    );
    mockRepository.delete.mockResolvedValue(undefined);

    await useCase.execute({ id: "producer-1" });

    expect(mockRepository.findById).toHaveBeenCalledWith("producer-1");
    expect(mockRepository.delete).toHaveBeenCalledWith("producer-1");
  });

  it("deve lançar NotFoundException quando produtor não existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: "inexistente" })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
