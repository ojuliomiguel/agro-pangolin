import { HarvestYear } from '../value-objects/harvest-year';
import { Crop } from './crop';

export class Harvest {
  constructor(
    public readonly id: string,
    public readonly year: HarvestYear,
    public readonly crops: Crop[] = [],
  ) {}

  addCrop(crop: Crop): Harvest {
    return new Harvest(this.id, this.year, [...this.crops, crop]);
  }
}
