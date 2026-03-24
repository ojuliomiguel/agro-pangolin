export interface CropSummary {
  id: string
  name: string
}

export interface HarvestSummary {
  id: string
  year: string
  crops: CropSummary[]
}

export interface FarmSummary {
  id: string
  name: string
  city: string
  state: string
  totalArea: number
  agriculturalArea: number
  vegetationArea: number
  harvests: HarvestSummary[]
}

export interface ProducerSummary {
  id: string
  document: string
  name: string
  farms: FarmSummary[]
}

export interface CropRequest {
  id?: string
  name: string
}

export interface HarvestRequest {
  id?: string
  year: string
  crops?: CropRequest[]
}

export interface FarmRequest {
  id?: string
  name: string
  city: string
  state: string
  totalArea: number
  agriculturalArea: number
  vegetationArea: number
  harvests?: HarvestRequest[]
}

export interface CreateProducerRequest {
  document: string
  name: string
  farms?: FarmRequest[]
}

export interface UpdateProducerRequest extends Partial<CreateProducerRequest> {
  id: string
}

export interface ProducersListResponse {
  data: ProducerSummary[]
  total: number
  page: number
  limit: number
}

export interface ProducersListQuery {
  page: number
  limit: number
}
