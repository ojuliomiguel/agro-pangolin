export class Area {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): Area {
    if (value < 0) {
      throw new Error(`Área inválida: o valor em hectares não pode ser negativo. Recebido: ${value}`);
    }
    return new Area(value);
  }

  get value(): number {
    return this._value;
  }

  add(other: Area): Area {
    return new Area(this._value + other._value);
  }

  isLessThanOrEqualTo(other: Area): boolean {
    return this._value <= other._value;
  }

  equals(other: Area): boolean {
    return this._value === other._value;
  }
}
