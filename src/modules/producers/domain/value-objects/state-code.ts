const VALID_STATES = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]);

export class StateCode {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): StateCode {
    const normalized = value.trim().toUpperCase();
    if (!VALID_STATES.has(normalized)) {
      throw new Error(`Sigla de estado inválida: "${value}". Use uma das 27 siglas brasileiras válidas.`);
    }
    return new StateCode(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: StateCode): boolean {
    return this._value === other._value;
  }
}
