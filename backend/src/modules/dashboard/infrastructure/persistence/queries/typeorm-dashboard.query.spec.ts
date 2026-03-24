import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { DatabaseModule } from "../../../../../shared/infrastructure/database/database.module";
import { TypeormDashboardQuery } from "./typeorm-dashboard.query";
import { FarmEntity } from "../../../../producers/infrastructure/database/typeorm/entities/farm.entity";
import { CropEntity } from "../../../../producers/infrastructure/database/typeorm/entities/crop.entity";
import { ProducerEntity } from "../../../../producers/infrastructure/database/typeorm/entities/producer.entity";
import { HarvestEntity } from "../../../../producers/infrastructure/database/typeorm/entities/harvest.entity";

const fuuid = (n: number) =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

describe("TypeormDashboardQuery (Integração)", () => {
  let queryAdapter: TypeormDashboardQuery;
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
      providers: [TypeormDashboardQuery],
    }).compile();

    queryAdapter = module.get<TypeormDashboardQuery>(TypeormDashboardQuery);
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

  it("deve retornar o resumo do dashboard com os totais de propriedades e areas agregadas", async () => {
    const producerRepo = dataSource.getRepository(ProducerEntity);

    await producerRepo.save({
      id: fuuid(1),
      document: "52998224725",
      name: "Produtor 1",
      farms: [
        {
          id: fuuid(2),
          name: "Fazenda SP",
          city: "Campinas",
          state: "SP",
          totalArea: 100,
          agriculturalArea: 60,
          vegetationArea: 40,
          harvests: [
            {
              id: fuuid(3),
              year: "2024",
              crops: [{ id: fuuid(4), name: "Soja" }],
            },
          ],
        },
        {
          id: fuuid(5),
          name: "Fazenda MG",
          city: "Uberlandia",
          state: "MG",
          totalArea: 200,
          agriculturalArea: 150,
          vegetationArea: 50,
          harvests: [
            {
              id: fuuid(6),
              year: "2024",
              crops: [
                { id: fuuid(7), name: "Milho" },
                { id: fuuid(8), name: "Soja" },
              ],
            },
          ],
        },
      ],
    });

    const summary = await queryAdapter.getSummary();

    expect(summary.totalFarms).toBe(2);
    expect(summary.totalHectares).toBe(300);
    expect(summary.bySoilUse).toEqual({ agricultural: 210, vegetation: 90 });

    const sortedByState = summary.byState.sort((a, b) =>
      a.state.localeCompare(b.state),
    );
    expect(sortedByState).toEqual([
      { state: "MG", count: 1 },
      { state: "SP", count: 1 },
    ]);

    const sortedByCrop = summary.byCrop.sort((a, b) =>
      a.crop.localeCompare(b.crop),
    );
    expect(sortedByCrop).toEqual([
      { crop: "Milho", count: 1 },
      { crop: "Soja", count: 2 },
    ]);
  });
});
