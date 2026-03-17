import { HarvestYear } from './harvest-year';

describe('HarvestYear', () => {
  it('deve criar com formato válido', () => {
    const hy = HarvestYear.create('2024/2025');
    expect(hy.value).toBe('2024/2025');
  });

  it('deve lançar erro para formato inválido (sem barra)', () => {
    expect(() => HarvestYear.create('20242025')).toThrow('Ano de safra inválido');
  });

  it('deve lançar erro para formato inválido (3 dígitos)', () => {
    expect(() => HarvestYear.create('024/025')).toThrow('Ano de safra inválido');
  });

  it('deve lançar erro quando ano final menor ou igual ao inicial', () => {
    expect(() => HarvestYear.create('2025/2024')).toThrow('Ano de safra inválido');
    expect(() => HarvestYear.create('2025/2025')).toThrow('Ano de safra inválido');
  });

  it('deve lançar erro para string vazia', () => {
    expect(() => HarvestYear.create('')).toThrow('Ano de safra inválido');
  });

  it('deve retornar equals corretamente', () => {
    expect(HarvestYear.create('2024/2025').equals(HarvestYear.create('2024/2025'))).toBe(true);
    expect(HarvestYear.create('2024/2025').equals(HarvestYear.create('2023/2024'))).toBe(false);
  });
});
