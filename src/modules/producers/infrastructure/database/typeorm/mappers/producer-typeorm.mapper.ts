import { Producer } from "../../../../domain/entities/producer";
import { ProducerEntity } from "../entities/producer.entity";
import { Document } from "../../../../domain/value-objects/document";
import { Farm } from "../../../../domain/entities/farm";
import { Area } from "../../../../domain/value-objects/area";
import { StateCode } from "../../../../domain/value-objects/state-code";
import { Harvest } from "../../../../domain/entities/harvest";
import { HarvestYear } from "../../../../domain/value-objects/harvest-year";
import { Crop } from "../../../../domain/entities/crop";
import { CropName } from "../../../../domain/value-objects/crop-name";
import { FarmEntity } from "../entities/farm.entity";
import { HarvestEntity } from "../entities/harvest.entity";
import { CropEntity } from "../entities/crop.entity";

export class ProducerTypeOrmMapper {
  static toDomain(entity: ProducerEntity): Producer {
    const document = Document.create(entity.document);

    const farms = entity.farms?.map((farmEntity) => {
      const harvests = farmEntity.harvests?.map((harvestEntity) => {
        const crops = harvestEntity.crops?.map((cropEntity) => {
          return new Crop(cropEntity.id, CropName.create(cropEntity.name));
        });

        return new Harvest(
          harvestEntity.id,
          HarvestYear.create(harvestEntity.year),
          crops || [],
        );
      });

      return new Farm({
        id: farmEntity.id,
        name: farmEntity.name,
        city: farmEntity.city,
        state: StateCode.create(farmEntity.state),
        totalArea: Area.create(Number(farmEntity.totalArea)),
        agriculturalArea: Area.create(Number(farmEntity.agriculturalArea)),
        vegetationArea: Area.create(Number(farmEntity.vegetationArea)),
        harvests: harvests || [],
      });
    });

    return new Producer({
      id: entity.id,
      name: entity.name,
      document,
      farms: farms || [],
    });
  }

  static toOrm(producer: Producer): ProducerEntity {
    const entity = new ProducerEntity();
    entity.id = producer.id;
    entity.name = producer.name;
    entity.document = producer.document.value;

    entity.farms = producer.farms.map((farm) => {
      const farmEntity = new FarmEntity();
      farmEntity.id = farm.id;
      farmEntity.name = farm.name;
      farmEntity.city = farm.city;
      farmEntity.state = farm.state.value;
      farmEntity.totalArea = farm.totalArea.value;
      farmEntity.agriculturalArea = farm.agriculturalArea.value;
      farmEntity.vegetationArea = farm.vegetationArea.value;
      farmEntity.producerId = producer.id;

      farmEntity.harvests = farm.harvests.map((harvest) => {
        const harvestEntity = new HarvestEntity();
        harvestEntity.id = harvest.id;
        harvestEntity.year = harvest.year.value;
        harvestEntity.farmId = farm.id;

        harvestEntity.crops = harvest.crops.map((crop) => {
          const cropEntity = new CropEntity();
          cropEntity.id = crop.id;
          cropEntity.name = crop.name.value;
          cropEntity.harvestId = harvest.id;
          return cropEntity;
        });

        return harvestEntity;
      });

      return farmEntity;
    });

    return entity;
  }
}
