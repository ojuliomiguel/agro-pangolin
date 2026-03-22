import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { QueryFailedError } from "typeorm";
import { HealthController } from "../src/modules/health/infrastructure/http/health.controller";
import { CreateProducerUseCase } from "../src/modules/producers/application/use-cases/create-producer/create-producer.use-case";
import { DeleteProducerUseCase } from "../src/modules/producers/application/use-cases/delete-producer/delete-producer.use-case";
import { GetProducerUseCase } from "../src/modules/producers/application/use-cases/get-producer/get-producer.use-case";
import { ListProducersUseCase } from "../src/modules/producers/application/use-cases/list-producers/list-producers.use-case";
import { UpdateProducerUseCase } from "../src/modules/producers/application/use-cases/update-producer/update-producer.use-case";
import { ProducerMapper } from "../src/modules/producers/application/use-cases/producer.mapper";
import { makeProducer } from "../src/modules/producers/application/use-cases/test-helpers/domain.fixtures";
import type { DocumentValidator } from "../src/modules/producers/domain/services/document-validator";
import type { ProducerReadRepository } from "../src/modules/producers/domain/ports/producer-read-repository";
import type { ProducerRepository } from "../src/modules/producers/domain/ports/producer-repository";
import { ProducersController } from "../src/modules/producers/infrastructure/http/controllers/producers.controller";
import {
  DOCUMENT_VALIDATOR,
  PRODUCER_READ_REPOSITORY,
  PRODUCER_REPOSITORY,
} from "../src/modules/producers/infrastructure/providers/tokens";
import { configureHttpApp } from "../src/shared/infrastructure/http/http-bootstrap";

const uuid = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

const mockProducerRepository: jest.Mocked<ProducerRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
};

const mockReadRepository: jest.Mocked<ProducerReadRepository> = {
  findAll: jest.fn(),
};

const mockDocumentValidator: jest.Mocked<DocumentValidator> = {
  validate: jest.fn(),
};

describe("API HTTP", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    process.env.DOCS_ENABLED = "true";

    moduleFixture = await Test.createTestingModule({
      controllers: [ProducersController, HealthController],
      providers: [
        CreateProducerUseCase,
        UpdateProducerUseCase,
        DeleteProducerUseCase,
        GetProducerUseCase,
        ListProducersUseCase,
        {
          provide: PRODUCER_REPOSITORY,
          useValue: mockProducerRepository,
        },
        {
          provide: PRODUCER_READ_REPOSITORY,
          useValue: mockReadRepository,
        },
        {
          provide: DOCUMENT_VALIDATOR,
          useValue: mockDocumentValidator,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureHttpApp(app, {
      corsOrigins: true,
      docsEnabled: true,
    });
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("expõe o health check público", async () => {
    const response = await request(app.getHttpServer())
      .get("/health")
      .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  it("expõe o JSON do Swagger", async () => {
    const response = await request(app.getHttpServer())
      .get("/docs-json")
      .expect(200);

    expect(response.body.openapi).toBeDefined();
    expect(response.body.paths["/producers"]).toBeDefined();
  });

  it("cria um produtor via POST /producers", async () => {
    mockDocumentValidator.validate.mockReturnValue(true);

    const createdProducer = makeProducer({
      id: uuid(1),
      name: "João da Silva",
    });
    mockProducerRepository.create.mockResolvedValue(createdProducer);

    const response = await request(app.getHttpServer())
      .post("/producers")
      .send({
        document: "529.982.247-25",
        name: "João da Silva",
        farms: [
          {
            name: "Fazenda Boa Vista",
            city: "Ribeirão Preto",
            state: "SP",
            totalArea: 100,
            agriculturalArea: 60,
            vegetationArea: 30,
            harvests: [
              {
                year: "2024/2025",
                crops: [{ name: "Soja" }],
              },
            ],
          },
        ],
      })
      .expect(201);

    expect(mockDocumentValidator.validate).toHaveBeenCalledWith(
      "529.982.247-25",
    );
    expect(mockProducerRepository.create).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject(
      ProducerMapper.toOutput(createdProducer),
    );
  });

  it("rejeita payload inválido antes de chegar ao use case", async () => {
    const response = await request(app.getHttpServer())
      .post("/producers")
      .send({
        document: "abc",
        name: "",
        farms: [
          {
            name: "",
            city: "",
            state: "XX",
            totalArea: 10,
            agriculturalArea: 8,
            vegetationArea: 5,
          },
        ],
      })
      .expect(400);

    expect(response.body.message).toContain("document");
    expect(mockProducerRepository.create).not.toHaveBeenCalled();
    expect(mockDocumentValidator.validate).not.toHaveBeenCalled();
  });

  it("retorna conflito quando o documento já existe", async () => {
    mockDocumentValidator.validate.mockReturnValue(true);
    mockProducerRepository.create.mockRejectedValue(
      new QueryFailedError("INSERT INTO producers", [], {
        code: "23505",
        detail: "Key (document)=(52998224725) already exists.",
        constraint: "UQ_producers_document",
      } as any),
    );

    const response = await request(app.getHttpServer())
      .post("/producers")
      .send({
        document: "529.982.247-25",
        name: "João da Silva",
        farms: [],
      })
      .expect(409);

    expect(response.body.message).toContain("documento");
  });

  it("busca um produtor pelo id", async () => {
    const producer = makeProducer({ id: uuid(2) });
    mockProducerRepository.findById.mockResolvedValue(producer);

    const response = await request(app.getHttpServer())
      .get(`/producers/${uuid(2)}`)
      .expect(200);

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(uuid(2));
    expect(response.body).toMatchObject(ProducerMapper.toOutput(producer));
  });

  it("retorna 404 quando o produtor não existe", async () => {
    mockProducerRepository.findById.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .get(`/producers/${uuid(3)}`)
      .expect(404);

    expect(response.body.message).toContain("não encontrado");
  });

  it("atualiza um produtor via PATCH /producers/:id", async () => {
    const existingProducer = makeProducer({ id: uuid(4) });
    const updatedProducer = makeProducer({
      id: uuid(4),
      name: "Maria da Silva",
    });

    mockProducerRepository.findById.mockResolvedValue(existingProducer);
    mockProducerRepository.update.mockResolvedValue(updatedProducer);

    const response = await request(app.getHttpServer())
      .patch(`/producers/${uuid(4)}`)
      .send({
        name: "Maria da Silva",
      })
      .expect(200);

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(uuid(4));
    expect(mockProducerRepository.update).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject(
      ProducerMapper.toOutput(updatedProducer),
    );
  });

  it("remove um produtor via DELETE /producers/:id", async () => {
    mockProducerRepository.findById.mockResolvedValue(
      makeProducer({ id: uuid(5) }),
    );
    mockProducerRepository.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .delete(`/producers/${uuid(5)}`)
      .expect(204);

    expect(mockProducerRepository.delete).toHaveBeenCalledWith(uuid(5));
  });

  it("lista produtores com paginação", async () => {
    const producerA = makeProducer({ id: uuid(6), name: "A" });
    const producerB = makeProducer({ id: uuid(7), name: "B" });

    mockReadRepository.findAll.mockResolvedValue({
      data: [producerA, producerB],
      total: 2,
      page: 1,
      limit: 10,
    });

    const response = await request(app.getHttpServer())
      .get("/producers?page=1&limit=10")
      .expect(200);

    expect(mockReadRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
    expect(response.body.total).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });
});
