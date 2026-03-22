export interface CropInput {
  id?: string;
  name: string;
}

export interface HarvestInput {
  id?: string;
  year: string;
  crops?: CropInput[];
}

export interface FarmInput {
  id?: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  harvests?: HarvestInput[];
}
