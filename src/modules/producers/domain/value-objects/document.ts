export class Document {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(raw: string): Document {
    const digits = raw.replace(/\D/g, "");

    if (digits.length === 11) {
      if (!Document.isValidCpf(digits)) {
        throw new Error(`CPF inválido: ${raw}`);
      }
      return new Document(digits);
    }

    if (digits.length === 14) {
      if (!Document.isValidCnpj(digits)) {
        throw new Error(`CNPJ inválido: ${raw}`);
      }
      return new Document(digits);
    }

    throw new Error(
      `Documento inválido: deve ser CPF (11 dígitos) ou CNPJ (14 dígitos). Recebido: ${raw}`,
    );
  }

  get value(): string {
    return this._value;
  }

  isCpf(): boolean {
    return this._value.length === 11;
  }

  isCnpj(): boolean {
    return this._value.length === 14;
  }

  formatted(): string {
    if (this.isCpf()) {
      return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return this._value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  equals(other: Document): boolean {
    return this._value === other._value;
  }

  private static isValidCpf(digits: string): boolean {
    if (/^(\d)\1+$/.test(digits)) return false;

    const calcDigit = (slice: string, weights: number[]): number => {
      const sum = slice
        .split("")
        .reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstWeights = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondWeights = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    const first = calcDigit(digits.slice(0, 9), firstWeights);
    const second = calcDigit(digits.slice(0, 10), secondWeights);

    return Number(digits[9]) === first && Number(digits[10]) === second;
  }

  private static isValidCnpj(digits: string): boolean {
    if (/^(\d)\1+$/.test(digits)) return false;

    const calcDigit = (slice: string, weights: number[]): number => {
      const sum = slice
        .split("")
        .reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const first = calcDigit(digits.slice(0, 12), firstWeights);
    const second = calcDigit(digits.slice(0, 13), secondWeights);

    return Number(digits[12]) === first && Number(digits[13]) === second;
  }
}
