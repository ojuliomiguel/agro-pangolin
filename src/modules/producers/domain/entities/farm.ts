import { Area } from "../value-objects/area";
import { StateCode } from "../value-objects/state-code";
import { FarmAreaConsistencyPolicy } from "../policies/farm-area-consistency.policy";
import { Harvest } from "./harvest";

export interface FarmProps {
  id: string;
  name: string;
  city: string;
  state: StateCode;
  totalArea: Area;
  agriculturalArea: Area;
  vegetationArea: Area;
  harvests?: Harvest[];
}

export class Farm {
  public readonly id: string;
  public readonly name: string;
  public readonly city: string;
  public readonly state: StateCode;
  public readonly totalArea: Area;
  public readonly agriculturalArea: Area;
  public readonly vegetationArea: Area;
  public readonly harvests: Harvest[];

  constructor(props: FarmProps) {
    FarmAreaConsistencyPolicy.validate(props);

    this.id = props.id;
    this.name = props.name;
    this.city = props.city;
    this.state = props.state;
    this.totalArea = props.totalArea;
    this.agriculturalArea = props.agriculturalArea;
    this.vegetationArea = props.vegetationArea;
    this.harvests = props.harvests ?? [];
  }

  addHarvest(harvest: Harvest): Farm {
    return new Farm({
      id: this.id,
      name: this.name,
      city: this.city,
      state: this.state,
      totalArea: this.totalArea,
      agriculturalArea: this.agriculturalArea,
      vegetationArea: this.vegetationArea,
      harvests: [...this.harvests, harvest],
    });
  }
}
