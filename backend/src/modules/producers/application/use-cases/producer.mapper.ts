import { Producer } from "../../domain/entities/producer";
import { Farm } from "../../domain/entities/farm";
import { Harvest } from "../../domain/entities/harvest";
import { Crop } from "../../domain/entities/crop";

export interface CropOutput {
  id: string;
  name: string;
}

export interface HarvestOutput {
  id: string;
  year: string;
  crops: CropOutput[];
}

export interface FarmOutput {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  harvests: HarvestOutput[];
}

export interface ProducerOutput {
  id: string;
  document: string;
  name: string;
  farms: FarmOutput[];
}

export class ProducerMapper {
  static toOutput(producer: Producer): ProducerOutput {
    return {
      id: producer.id,
      document: producer.document.formatted(),
      name: producer.name,
      farms: producer.farms.map(ProducerMapper.farmToOutput),
    };
  }

  private static farmToOutput(farm: Farm): FarmOutput {
    return {
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state.value,
      totalArea: farm.totalArea.value,
      agriculturalArea: farm.agriculturalArea.value,
      vegetationArea: farm.vegetationArea.value,
      harvests: farm.harvests.map(ProducerMapper.harvestToOutput),
    };
  }

  private static harvestToOutput(harvest: Harvest): HarvestOutput {
    return {
      id: harvest.id,
      year: harvest.year.value,
      crops: harvest.crops.map(ProducerMapper.cropToOutput),
    };
  }

  private static cropToOutput(crop: Crop): CropOutput {
    return {
      id: crop.id,
      name: crop.name.value,
    };
  }
}
