import dataSource from "./data-source";
import { ProducerEntity } from "../../../modules/producers/infrastructure/database/typeorm/entities/producer.entity";
import { FarmEntity } from "../../../modules/producers/infrastructure/database/typeorm/entities/farm.entity";

async function seed() {
  await dataSource.initialize();
  console.log("Base de dados conectada, iniciando seed...");

  const producerRepo = dataSource.getRepository(ProducerEntity);
  const farmRepo = dataSource.getRepository(FarmEntity);

  const existing = await producerRepo.findOne({
    where: { document: "11111111111" },
  });
  if (existing) {
    console.log("Seed já executado anteriormente.");
    await dataSource.destroy();
    return;
  }

  const producer = producerRepo.create({
    id: "f8d3878b-9e45-4df3-8686-35baceb0bbdb",
    document: "11111111111",
    name: "João Produtor",
  });
  await producerRepo.save(producer);

  const farm = farmRepo.create({
    id: "b6e3f421-2a1c-4bba-958f-b9be9e7a4f91",
    name: "Fazenda Boa Esperança",
    city: "Ribeirão Preto",
    state: "SP",
    totalArea: 1000,
    agriculturalArea: 800,
    vegetationArea: 200,
    producerId: producer.id,
  });
  await farmRepo.save(farm);

  console.log("Seed concluído com sucesso!");
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error("Erro ao executar o seed:", err);
  process.exit(1);
});
