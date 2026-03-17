import { CropName } from './crop-name';

describe('CropName', () => {
  it('deve criar com nome válido', () => {
    const crop = CropName.create('Soja');
    expect(crop.value).toBe('Soja');
  });

  it('deve criar com nome em case diferente (normaliza para o padrão)', () => {
    const crop = CropName.create('soja');
    expect(crop.value).toBe('Soja');
  });

  it('deve criar com todos os nomes válidos', () => {
    const valid = ['Soja', 'Milho', 'Café', 'Cana de Açúcar', 'Algodão'];
    valid.forEach((name) => {
      expect(() => CropName.create(name)).not.toThrow();
    });
  });

  it('deve lançar erro para nome inválido', () => {
    expect(() => CropName.create('Trigo')).toThrow('Cultura inválida');
  });

  it('deve lançar erro para string vazia', () => {
    expect(() => CropName.create('')).toThrow('Cultura inválida');
  });

  it('deve retornar equals corretamente', () => {
    expect(CropName.create('Milho').equals(CropName.create('Milho'))).toBe(true);
    expect(CropName.create('Milho').equals(CropName.create('Soja'))).toBe(false);
  });
});
