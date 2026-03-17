import { CropName } from '../value-objects/crop-name';

export class Crop {
  constructor(
    public readonly id: string,
    public readonly name: CropName,
  ) {}
}
