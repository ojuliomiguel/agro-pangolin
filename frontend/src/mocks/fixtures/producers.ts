import type { FarmSummary, ProducerSummary, ProducersListResponse } from '../../features/producers/types'

function createFarm(producerIndex: number, farmIndex: number): FarmSummary {
  const sequence = `${producerIndex}${farmIndex}`.padStart(2, '0')

  return {
    id: `producer-${producerIndex}-farm-${farmIndex}`,
    name: `Fazenda ${sequence}`,
    city: farmIndex % 2 === 0 ? 'Ribeirão Preto' : 'Sorriso',
    state: farmIndex % 2 === 0 ? 'SP' : 'MT',
    totalArea: 100 + producerIndex * 5 + farmIndex * 10,
    agriculturalArea: 60 + producerIndex * 3 + farmIndex * 5,
    vegetationArea: 20 + producerIndex * 2 + farmIndex * 3,
    harvests: [
      {
        id: `producer-${producerIndex}-farm-${farmIndex}-harvest-1`,
        year: '2024/2025',
        crops: [
          {
            id: `producer-${producerIndex}-farm-${farmIndex}-crop-1`,
            name: farmIndex % 2 === 0 ? 'Soja' : 'Milho',
          },
        ],
      },
    ],
  }
}

function createProducer(index: number): ProducerSummary {
  const farmsCount = index % 4 === 0 ? 0 : index % 3 === 0 ? 1 : 2

  return {
    id: `producer-${index}`,
    document:
      index <= 6
        ? `000.000.00${index}-9${index}`
        : `00.000.000/${String(index).padStart(4, '0')}-0${index % 10}`,
    name: `Produtor ${String(index).padStart(2, '0')}`,
    farms: Array.from({ length: farmsCount }, (_, farmIndex) =>
      createFarm(index, farmIndex + 1)
    ),
  }
}

function createInitialProducers() {
  return Array.from({ length: 12 }, (_, index) => createProducer(index + 1))
}

export let producerFixtures = createInitialProducers()

export function resetProducerFixtures() {
  producerFixtures = createInitialProducers()
}

export function addProducerFixture(producer: Partial<ProducerSummary>): ProducerSummary {
  const newProducer: ProducerSummary = {
    id: `producer-${producerFixtures.length + 1}`,
    name: producer.name || '',
    document: producer.document || '',
    farms: (producer.farms || []).map((farm, farmIndex) => ({
      ...farm,
      id: farm.id || `producer-${producerFixtures.length + 1}-farm-${farmIndex + 1}`,
      harvests: (farm.harvests || []).map((harvest, harvestIndex) => ({
        ...harvest,
        id: harvest.id || `producer-${producerFixtures.length + 1}-farm-${farmIndex + 1}-harvest-${harvestIndex + 1}`,
        crops: (harvest.crops || []).map((crop, cropIndex) => ({
          ...crop,
          id: crop.id || `producer-${producerFixtures.length + 1}-farm-${farmIndex + 1}-harvest-${harvestIndex + 1}-crop-${cropIndex + 1}`,
        })),
      })),
    })),
  }
  producerFixtures.unshift(newProducer)
  return newProducer
}

export function updateProducerFixture(id: string, updates: Partial<ProducerSummary>): ProducerSummary | null {
  const index = producerFixtures.findIndex((p) => p.id === id)
  if (index === -1) return null

  const updated: ProducerSummary = {
    ...producerFixtures[index],
    ...updates,
    id, // Ensure ID doesn't change
  }
  producerFixtures[index] = updated
  return updated
}

export function removeProducerFixture(id: string) {
  const exists = producerFixtures.some((producer) => producer.id === id)
  producerFixtures = producerFixtures.filter((producer) => producer.id !== id)

  return exists
}

export function getProducersPage(page: number, limit: number): ProducersListResponse {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10
  const start = (safePage - 1) * safeLimit
  const end = start + safeLimit

  return {
    data: producerFixtures.slice(start, end),
    total: producerFixtures.length,
    page: safePage,
    limit: safeLimit,
  }
}

export const producerListEmptyFixture: ProducersListResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
}

export const producerListPage1Fixture = getProducersPage(1, 10)
export const producerListPage2Fixture = getProducersPage(2, 10)
