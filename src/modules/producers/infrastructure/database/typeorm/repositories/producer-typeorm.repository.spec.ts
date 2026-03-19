import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProducerTypeOrmRepository } from "./producer-typeorm.repository";
import { ProducerReadTypeOrmRepository } from "./producer-read-typeorm.repository";
import { ProducerEntity } from "../entities/producer.entity";
import { FarmEntity } from "../entities/farm.entity";
import { HarvestEntity } from "../entities/harvest.entity";
import { CropEntity } from "../entities/crop.entity";
import { Producer } from "../../../../domain/entities/producer";
import { Document } from "../../../../domain/value-objects/document";
import { Farm } from "../../../../domain/entities/farm";
import { Area } from "../../../../domain/value-objects/area";
import { StateCode } from "../../../../domain/value-objects/state-code";
import { Harvest } from "../../../../domain/entities/harvest";
import { HarvestYear } from "../../../../domain/value-objects/harvest-year";
import { Crop } from "../../../../domain/entities/crop";
import { CropName } from "../../../../domain/value-objects/crop-name";
import { DataSource } from "typeorm";
import { DatabaseModule } from "../../../../../../shared/infrastructure/database/database.module";

const fuuid = (n: number) =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

describe("ProducerTypeOrmRepository (Integration)", () => {
  let writeRepo: ProducerTypeOrmRepository;
  let readRepo: ProducerReadTypeOrmRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          ProducerEntity,
          FarmEntity,
          HarvestEntity,
          CropEntity,
        ]),
      ],
      providers: [ProducerTypeOrmRepository, ProducerReadTypeOrmRepository],
    }).compile();

    writeRepo = module.get<ProducerTypeOrmRepository>(
      ProducerTypeOrmRepository,
    );
    readRepo = module.get<ProducerReadTypeOrmRepository>(
      ProducerReadTypeOrmRepository,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  });

  it("deve persistir um produtor completo com o grafo aninhado", async () => {
    const crop = new Crop(fuuid(100), CropName.create("Soja"));
    const harvest = new Harvest(fuuid(200), HarvestYear.create("2024/2025"), [
      crop,
    ]);
    const farm = new Farm({
      id: fuuid(300),
      name: "Fazenda X",
      city: "Cidade Y",
      state: StateCode.create("MT"),
      totalArea: Area.create(100),
      agriculturalArea: Area.create(60),
      vegetationArea: Area.create(40),
      harvests: [harvest],
    });
    const producer = new Producer({
      id: fuuid(400),
      name: "João",
      document: Document.create("03460415118"),
      farms: [farm],
    });

    const saved = await writeRepo.create(producer);

    expect(saved.id).toBe(producer.id);

    const found = await writeRepo.findById(producer.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe("João");
    expect(found!.farms).toHaveLength(1);
    expect(found!.farms[0].name).toBe("Fazenda X");
    expect(found!.farms[0].harvests).toHaveLength(1);
    expect(found!.farms[0].harvests[0].year.value).toBe("2024/2025");
    expect(found!.farms[0].harvests[0].crops).toHaveLength(1);
    expect(found!.farms[0].harvests[0].crops[0].name.value).toBe("Soja");
  });

  it("deve falhar ao persistir documentos duplicados (UniqueConstraint)", async () => {
    const producer1 = new Producer({
      id: fuuid(1),
      name: "João",
      document: Document.create("84409499521"),
    });
    const producer2 = new Producer({
      id: fuuid(2),
      name: "Maria",
      document: Document.create("84409499521"),
    });

    await writeRepo.create(producer1);
    await expect(writeRepo.create(producer2)).rejects.toThrow();
  });

  it("deve atualizar o grafo aninhado removendo uma fazenda (cascade)", async () => {
    const farm1 = new Farm({
      id: fuuid(3),
      name: "F1",
      city: "C1",
      state: StateCode.create("SP"),
      totalArea: Area.create(10),
      agriculturalArea: Area.create(5),
      vegetationArea: Area.create(5),
    });
    const farm2 = new Farm({
      id: fuuid(4),
      name: "F2",
      city: "C2",
      state: StateCode.create("MG"),
      totalArea: Area.create(20),
      agriculturalArea: Area.create(10),
      vegetationArea: Area.create(10),
    });

    const producer = new Producer({
      id: fuuid(5),
      name: "Duas Fazendas",
      document: Document.create("86246924662"),
      farms: [farm1, farm2],
    });

    await writeRepo.create(producer);

    const updatedProducer = new Producer({
      id: fuuid(5),
      name: "Uma Fazenda",
      document: Document.create("86246924662"),
      farms: [farm1],
    });

    await writeRepo.update(updatedProducer);

    const found = await writeRepo.findById(fuuid(5));
    expect(found!.name).toBe("Uma Fazenda");
    expect(found!.farms).toHaveLength(1);
    expect(found!.farms[0].id).toBe(fuuid(3));
  });

  it("deve excluir em cascata o agregado", async () => {
    const farm = new Farm({
      id: fuuid(6),
      name: "F3",
      city: "C3",
      state: StateCode.create("MT"),
      totalArea: Area.create(100),
      agriculturalArea: Area.create(50),
      vegetationArea: Area.create(50),
      harvests: [
        new Harvest(fuuid(7), HarvestYear.create("2024/2025"), [
          new Crop(fuuid(8), CropName.create("Milho")),
        ]),
      ],
    });

    const producer = new Producer({
      id: fuuid(9),
      name: "Will Delete",
      document: Document.create("85670855868"),
      farms: [farm],
    });

    await writeRepo.create(producer);

    await writeRepo.delete(fuuid(9));

    const found = await writeRepo.findById(fuuid(9));
    expect(found).toBeNull();

    const farmRepo = dataSource.getRepository(FarmEntity);
    const deletedFarm = await farmRepo.findOne({ where: { id: fuuid(6) } });
    expect(deletedFarm).toBeNull();
  });

  it("deve listar produtores com paginação", async () => {
    const p1 = new Producer({
      id: fuuid(10),
      name: "A",
      document: Document.create("44786143693"),
    });
    const p2 = new Producer({
      id: fuuid(11),
      name: "B",
      document: Document.create("88807083680"),
    });
    const p3 = new Producer({
      id: fuuid(12),
      name: "C",
      document: Document.create("25284798325"),
    });

    await writeRepo.create(p1);
    await writeRepo.create(p2);
    await writeRepo.create(p3);

    const result = await readRepo.findAll({ page: 1, limit: 2 });
    expect(result.total).toBe(3);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe("A");
    expect(result.data[1].name).toBe("B");

    const page2 = await readRepo.findAll({ page: 2, limit: 2 });
    expect(page2.data).toHaveLength(1);
    expect(page2.data[0].name).toBe("C");
  });
});
