import { toFormValues } from './toFormValues'
import type { ProducerSummary } from '../types'

const producerCompleto: ProducerSummary = {
  id: 'producer-1',
  name: 'João da Silva',
  document: '529.982.247-25',
  farms: [
    {
      id: 'farm-1',
      name: 'Fazenda Boa Vista',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 200,
      agriculturalArea: 120,
      vegetationArea: 50,
      harvests: [
        {
          id: 'harvest-1',
          year: '2024/2025',
          crops: [
            { id: 'crop-1', name: 'Soja' },
            { id: 'crop-2', name: 'Milho' },
          ],
        },
      ],
    },
  ],
}

describe('toFormValues', () => {
  it('converte ProducerSummary completo preservando IDs', () => {
    const result = toFormValues(producerCompleto)

    expect(result.name).toBe('João da Silva')
    expect(result.document).toBe('529.982.247-25')
    expect(result.farms).toHaveLength(1)

    const farm = result.farms[0]
    expect(farm.id).toBe('farm-1')
    expect(farm.name).toBe('Fazenda Boa Vista')
    expect(farm.city).toBe('Ribeirão Preto')
    expect(farm.state).toBe('SP')
    expect(farm.totalArea).toBe(200)
    expect(farm.agriculturalArea).toBe(120)
    expect(farm.vegetationArea).toBe(50)

    expect(farm.harvests).toHaveLength(1)
    const harvest = farm.harvests[0]
    expect(harvest.id).toBe('harvest-1')
    expect(harvest.year).toBe('2024/2025')

    expect(harvest.crops).toHaveLength(2)
    expect(harvest.crops[0]).toEqual({ id: 'crop-1', name: 'Soja' })
    expect(harvest.crops[1]).toEqual({ id: 'crop-2', name: 'Milho' })
  })

  it('trata produtor sem fazendas', () => {
    const producer: ProducerSummary = {
      id: 'producer-2',
      name: 'Maria Oliveira',
      document: '11.222.333/0001-81',
      farms: [],
    }

    const result = toFormValues(producer)

    expect(result.name).toBe('Maria Oliveira')
    expect(result.document).toBe('11.222.333/0001-81')
    expect(result.farms).toEqual([])
  })

  it('trata fazenda sem safras', () => {
    const producer: ProducerSummary = {
      id: 'producer-3',
      name: 'Pedro Santos',
      document: '529.982.247-25',
      farms: [
        {
          id: 'farm-2',
          name: 'Fazenda Norte',
          city: 'Sorriso',
          state: 'MT',
          totalArea: 500,
          agriculturalArea: 300,
          vegetationArea: 100,
          harvests: [],
        },
      ],
    }

    const result = toFormValues(producer)

    expect(result.farms[0].harvests).toEqual([])
  })
})
