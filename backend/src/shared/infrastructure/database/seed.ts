import { randomUUID } from "crypto";
import dataSource from "./data-source";
import { ProducerEntity } from "../../../modules/producers/infrastructure/database/typeorm/entities/producer.entity";
import { FarmEntity } from "../../../modules/producers/infrastructure/database/typeorm/entities/farm.entity";
import { HarvestEntity } from "../../../modules/producers/infrastructure/database/typeorm/entities/harvest.entity";
import { CropEntity } from "../../../modules/producers/infrastructure/database/typeorm/entities/crop.entity";

const SEED_SENTINEL_ID = "f8d3878b-9e45-4df3-8686-35baceb0bbdb";

async function seed() {
  await dataSource.initialize();
  console.log("Base de dados conectada, iniciando seed...");

  const producerRepo = dataSource.getRepository(ProducerEntity);
  const farmRepo = dataSource.getRepository(FarmEntity);
  const harvestRepo = dataSource.getRepository(HarvestEntity);
  const cropRepo = dataSource.getRepository(CropEntity);

  const existing = await producerRepo.findOne({ where: { id: SEED_SENTINEL_ID } });
  if (existing) {
    console.log("Seed já executado anteriormente.");
    await dataSource.destroy();
    return;
  }

  const producers = await producerRepo.save([
    producerRepo.create({ id: SEED_SENTINEL_ID, document: "52998224725", name: "João Silva" }),
    producerRepo.create({ id: randomUUID(), document: "44786143693", name: "Maria Oliveira" }),
    producerRepo.create({ id: randomUUID(), document: "88807083680", name: "Carlos Mendes" }),
    producerRepo.create({ id: randomUUID(), document: "25284798325", name: "Ana Ferreira" }),
    producerRepo.create({ id: randomUUID(), document: "12345678909", name: "Roberto Costa" }),
  ]);

  const farmJoao1 = await farmRepo.save(
    farmRepo.create({
      id: randomUUID(),
      name: "Fazenda Boa Esperança",
      city: "Ribeirão Preto",
      state: "SP",
      totalArea: 1500,
      agriculturalArea: 1100,
      vegetationArea: 400,
      producerId: producers[0].id,
    }),
  );

  const farmJoao2 = await farmRepo.save(
    farmRepo.create({
      id: randomUUID(),
      name: "Sítio das Palmeiras",
      city: "Campinas",
      state: "SP",
      totalArea: 800,
      agriculturalArea: 600,
      vegetationArea: 200,
      producerId: producers[0].id,
    }),
  );

  const farmMaria = await farmRepo.save(
    farmRepo.create({
      id: randomUUID(),
      name: "Fazenda Cerrado Verde",
      city: "Sinop",
      state: "MT",
      totalArea: 3000,
      agriculturalArea: 2500,
      vegetationArea: 500,
      producerId: producers[1].id,
    }),
  );

  const farmCarlos = await farmRepo.save(
    farmRepo.create({
      id: randomUUID(),
      name: "Agropecuária Santa Cruz",
      city: "Rio Verde",
      state: "GO",
      totalArea: 2200,
      agriculturalArea: 1800,
      vegetationArea: 400,
      producerId: producers[2].id,
    }),
  );

  const farmAna = await farmRepo.save(
    farmRepo.create({
      id: randomUUID(),
      name: "Fazenda Três Corações",
      city: "Uberaba",
      state: "MG",
      totalArea: 1200,
      agriculturalArea: 900,
      vegetationArea: 300,
      producerId: producers[3].id,
    }),
  );

  const farmRoberto = await farmRepo.save(
    farmRepo.create({
      id: randomUUID(),
      name: "Granja Iguaçu",
      city: "Cascavel",
      state: "PR",
      totalArea: 950,
      agriculturalArea: 750,
      vegetationArea: 200,
      producerId: producers[4].id,
    }),
  );

  type HarvestInput = { farmId: string; year: string; crops: string[] };

  const harvestData: HarvestInput[] = [
    { farmId: farmJoao1.id, year: "2022/2023", crops: ["Soja", "Milho"] },
    { farmId: farmJoao1.id, year: "2023/2024", crops: ["Soja", "Cana de Açúcar"] },
    { farmId: farmJoao2.id, year: "2022/2023", crops: ["Café", "Milho"] },
    { farmId: farmJoao2.id, year: "2023/2024", crops: ["Café"] },
    { farmId: farmMaria.id, year: "2022/2023", crops: ["Soja", "Milho", "Algodão"] },
    { farmId: farmMaria.id, year: "2023/2024", crops: ["Soja", "Algodão"] },
    { farmId: farmCarlos.id, year: "2022/2023", crops: ["Soja", "Milho"] },
    { farmId: farmCarlos.id, year: "2023/2024", crops: ["Soja", "Milho", "Algodão"] },
    { farmId: farmAna.id, year: "2022/2023", crops: ["Café", "Soja"] },
    { farmId: farmAna.id, year: "2023/2024", crops: ["Café", "Cana de Açúcar"] },
    { farmId: farmRoberto.id, year: "2022/2023", crops: ["Milho", "Soja"] },
    { farmId: farmRoberto.id, year: "2023/2024", crops: ["Milho", "Algodão"] },
  ];

  for (const { farmId, year, crops } of harvestData) {
    const harvest = await harvestRepo.save(
      harvestRepo.create({ id: randomUUID(), year, farmId }),
    );
    for (const name of crops) {
      await cropRepo.save(
        cropRepo.create({ id: randomUUID(), name, harvestId: harvest.id }),
      );
    }
  }

  console.log(
    `Seed concluído! ${producers.length} produtores, 6 fazendas, ${harvestData.length} safras criadas.`,
  );
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error("Erro ao executar o seed:", err);
  process.exit(1);
});
