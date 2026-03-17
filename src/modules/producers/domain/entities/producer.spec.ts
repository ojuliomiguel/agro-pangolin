import { Producer } from './producer';
import { Farm } from './farm';
import { Harvest } from './harvest';
import { Crop } from './crop';
import { Document } from '../value-objects/document';
import { Area } from '../value-objects/area';
import { StateCode } from '../value-objects/state-code';
import { HarvestYear } from '../value-objects/harvest-year';
import { CropName } from '../value-objects/crop-name';

const makeFarm = (overrides: Partial<ConstructorParameters<typeof Farm>[0]> = {}): Farm => {
  return new Farm({
    id: 'farm-1',
    name: 'Fazenda Boa Vista',
    city: 'Ribeirão Preto',
    state: StateCode.create('SP'),
    totalArea: Area.create(500),
    agriculturalArea: Area.create(300),
    vegetationArea: Area.create(100),
    ...overrides,
  });
};

const makeCrop = (): Crop =>
  new Crop('crop-1', CropName.create('Soja'));

const makeHarvest = (): Harvest =>
  new Harvest('harvest-1', HarvestYear.create('2024/2025'), [makeCrop()]);

const makeProducer = (overrides: Partial<ConstructorParameters<typeof Producer>[0]> = {}): Producer =>
  new Producer({
    id: 'producer-1',
    document: Document.create('529.982.247-25'),
    name: 'João da Silva',
    ...overrides,
  });

describe('Producer', () => {
  describe('criação', () => {
    it('deve criar um produtor com dados válidos', () => {
      const producer = makeProducer();
      expect(producer.id).toBe('producer-1');
      expect(producer.name).toBe('João da Silva');
      expect(producer.document.isCpf()).toBe(true);
      expect(producer.farms).toHaveLength(0);
    });

    it('deve lançar erro para nome vazio', () => {
      expect(() => makeProducer({ name: '' })).toThrow('obrigatório');
      expect(() => makeProducer({ name: '   ' })).toThrow('obrigatório');
    });

    it('deve fazer trim no nome', () => {
      const producer = makeProducer({ name: '  João  ' });
      expect(producer.name).toBe('João');
    });
  });

  describe('addFarm', () => {
    it('deve adicionar uma fazenda ao produtor', () => {
      const producer = makeProducer();
      const farm = makeFarm();
      const updated = producer.addFarm(farm);
      expect(updated.farms).toHaveLength(1);
      expect(updated.farms[0].name).toBe('Fazenda Boa Vista');
    });

    it('deve ser imutável — o original não muda', () => {
      const producer = makeProducer();
      producer.addFarm(makeFarm());
      expect(producer.farms).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('deve atualizar apenas o nome', () => {
      const producer = makeProducer();
      const updated = producer.update({ name: 'Maria Santos' });
      expect(updated.name).toBe('Maria Santos');
      expect(updated.document.value).toBe('52998224725');
    });

    it('deve atualizar apenas o documento', () => {
      const producer = makeProducer();
      const newDoc = Document.create('11222333000181');
      const updated = producer.update({ document: newDoc });
      expect(updated.document.isCnpj()).toBe(true);
      expect(updated.name).toBe('João da Silva');
    });
  });

  describe('integração completa — Producer > Farm > Harvest > Crop', () => {
    it('deve compor o agregado completo corretamente', () => {
      const crop = makeCrop();
      const harvest = makeHarvest();
      const farm = makeFarm({ harvests: [harvest] });
      const producer = makeProducer({ farms: [farm] });

      expect(producer.farms).toHaveLength(1);

      const [prodFarm] = producer.farms;
      expect(prodFarm.harvests).toHaveLength(1);

      const [prodHarvest] = prodFarm.harvests;
      expect(prodHarvest.year.value).toBe('2024/2025');
      expect(prodHarvest.crops).toHaveLength(1);
      expect(prodHarvest.crops[0].name.value).toBe('Soja');
    });

    it('deve lançar erro se a fazenda tiver áreas inconsistentes', () => {
      expect(() =>
        makeFarm({
          totalArea: Area.create(100),
          agriculturalArea: Area.create(80),
          vegetationArea: Area.create(50),
        }),
      ).toThrow('ultrapassa a área total');
    });
  });
});
