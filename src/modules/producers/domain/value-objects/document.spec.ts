import { Document } from './document';

describe('Document', () => {
  describe('CPF', () => {
    it('deve criar com CPF válido', () => {
      const doc = Document.create('529.982.247-25');
      expect(doc.value).toBe('52998224725');
      expect(doc.isCpf()).toBe(true);
      expect(doc.isCnpj()).toBe(false);
    });

    it('deve criar CPF sem máscara', () => {
      const doc = Document.create('52998224725');
      expect(doc.value).toBe('52998224725');
    });

    it('deve formatar CPF corretamente', () => {
      const doc = Document.create('52998224725');
      expect(doc.formatted()).toBe('529.982.247-25');
    });

    it('deve lançar erro para CPF com dígito verificador inválido', () => {
      expect(() => Document.create('529.982.247-26')).toThrow('CPF inválido');
    });

    it('deve lançar erro para CPF com todos os dígitos iguais', () => {
      expect(() => Document.create('111.111.111-11')).toThrow('CPF inválido');
    });

    it('deve lançar erro para CPF com quantia errada de dígitos', () => {
      expect(() => Document.create('1234567890')).toThrow('Documento inválido');
    });
  });

  describe('CNPJ', () => {
    it('deve criar com CNPJ válido', () => {
      const doc = Document.create('11.222.333/0001-81');
      expect(doc.value).toBe('11222333000181');
      expect(doc.isCnpj()).toBe(true);
      expect(doc.isCpf()).toBe(false);
    });

    it('deve criar CNPJ sem máscara', () => {
      const doc = Document.create('11222333000181');
      expect(doc.value).toBe('11222333000181');
    });

    it('deve formatar CNPJ corretamente', () => {
      const doc = Document.create('11222333000181');
      expect(doc.formatted()).toBe('11.222.333/0001-81');
    });

    it('deve lançar erro para CNPJ com dígito verificador inválido', () => {
      expect(() => Document.create('11.222.333/0001-82')).toThrow('CNPJ inválido');
    });

    it('deve lançar erro para CNPJ com todos os dígitos iguais', () => {
      expect(() => Document.create('11111111111111')).toThrow('CNPJ inválido');
    });
  });

  describe('equals', () => {
    it('deve retornar true para documentos com mesmo valor', () => {
      const a = Document.create('52998224725');
      const b = Document.create('529.982.247-25');
      expect(a.equals(b)).toBe(true);
    });

    it('deve retornar false para documentos diferentes', () => {
      const a = Document.create('52998224725');
      const b = Document.create('11222333000181');
      expect(a.equals(b)).toBe(false);
    });
  });
});
