import { Producer } from "../../../domain/entities/producer";
import { Farm } from "../../../domain/entities/farm";
import { Harvest } from "../../../domain/entities/harvest";
import { Crop } from "../../../domain/entities/crop";
import { Document } from "../../../domain/value-objects/document";
import { Area } from "../../../domain/value-objects/area";
import { StateCode } from "../../../domain/value-objects/state-code";
import { HarvestYear } from "../../../domain/value-objects/harvest-year";
import { CropName } from "../../../domain/value-objects/crop-name";

export const VALID_CPF = "529.982.247-25";

export function makeCrop(
  overrides?: Partial<{ id: string; name: string }>,
): Crop {
  return new Crop(
    overrides?.id ?? "crop-1",
    CropName.create(overrides?.name ?? "Soja"),
  );
}

export function makeHarvest(
  overrides?: Partial<{ id: string; year: string }>,
): Harvest {
  return new Harvest(
    overrides?.id ?? "harvest-1",
    HarvestYear.create(overrides?.year ?? "2024/2025"),
    [makeCrop()],
  );
}

export function makeFarm(overrides?: Partial<{ id: string }>): Farm {
  return new Farm({
    id: overrides?.id ?? "farm-1",
    name: "Fazenda Boa Vista",
    city: "Ribeirão Preto",
    state: StateCode.create("SP"),
    totalArea: Area.create(100),
    agriculturalArea: Area.create(60),
    vegetationArea: Area.create(30),
    harvests: [makeHarvest()],
  });
}

export function makeProducer(
  overrides?: Partial<{ id: string; name: string }>,
): Producer {
  return new Producer({
    id: overrides?.id ?? "producer-1",
    document: Document.create(VALID_CPF),
    name: overrides?.name ?? "João da Silva",
    farms: [makeFarm()],
  });
}
