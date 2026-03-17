import { Area } from '../value-objects/area';

interface AreaProps {
  totalArea: Area;
  agriculturalArea: Area;
  vegetationArea: Area;
}

export class FarmAreaConsistencyPolicy {
  static validate(props: AreaProps): void {
    const usedArea = props.agriculturalArea.add(props.vegetationArea);
    if (!usedArea.isLessThanOrEqualTo(props.totalArea)) {
      throw new Error(
        `Inconsistência de área: a soma da área agricultável (${props.agriculturalArea.value} ha) ` +
        `e área de vegetação (${props.vegetationArea.value} ha) = ${usedArea.value} ha ` +
        `ultrapassa a área total da fazenda (${props.totalArea.value} ha).`,
      );
    }
  }
}
