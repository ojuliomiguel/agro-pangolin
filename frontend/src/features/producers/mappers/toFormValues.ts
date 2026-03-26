import type { ProducerSummary } from '../types'
import type { ProducerFormValues } from '../components/ProducerForm/schema'

export function toFormValues(producer: ProducerSummary): ProducerFormValues {
  return {
    name: producer.name,
    document: producer.document,
    farms: producer.farms.map((farm) => ({
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      agriculturalArea: farm.agriculturalArea,
      vegetationArea: farm.vegetationArea,
      harvests: farm.harvests.map((harvest) => ({
        id: harvest.id,
        year: harvest.year,
        crops: harvest.crops.map((crop) => ({
          id: crop.id,
          name: crop.name,
        })),
      })),
    })),
  }
}
