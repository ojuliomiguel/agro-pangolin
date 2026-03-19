export const VALID_CROP_NAMES = [
  "Soja",
  "Milho",
  "Café",
  "Cana de Açúcar",
  "Algodão",
] as const;

export type CropNameValue = (typeof VALID_CROP_NAMES)[number];

export class CropName {
  private readonly _value: CropNameValue;

  private constructor(value: CropNameValue) {
    this._value = value;
  }

  static create(value: string): CropName {
    const match = VALID_CROP_NAMES.find(
      (name) => name.toLowerCase() === value.trim().toLowerCase(),
    );

    if (!match) {
      throw new Error(
        `Cultura inválida: "${value}". Valores aceitos: ${VALID_CROP_NAMES.join(", ")}.`,
      );
    }

    return new CropName(match);
  }

  get value(): CropNameValue {
    return this._value;
  }

  equals(other: CropName): boolean {
    return this._value === other._value;
  }
}
