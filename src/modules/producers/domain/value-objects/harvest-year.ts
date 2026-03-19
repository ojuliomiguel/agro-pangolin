const HARVEST_YEAR_REGEX = /^\d{4}\/\d{4}$/;

export class HarvestYear {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): HarvestYear {
    if (!HARVEST_YEAR_REGEX.test(value)) {
      throw new Error(
        `Ano de safra inválido: "${value}". Use o formato AAAA/AAAA (ex.: "2024/2025").`,
      );
    }

    const [startYear, endYear] = value.split("/").map(Number);
    if (endYear <= startYear) {
      throw new Error(
        `Ano de safra inválido: o ano final (${endYear}) deve ser maior que o inicial (${startYear}).`,
      );
    }

    return new HarvestYear(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: HarvestYear): boolean {
    return this._value === other._value;
  }
}
