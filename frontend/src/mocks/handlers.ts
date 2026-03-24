import { http, HttpResponse } from 'msw'
import { dashboardFixture } from './fixtures/dashboard'
import {
  addProducerFixture,
  getProducersPage,
  removeProducerFixture,
  updateProducerFixture,
  producerFixtures,
} from './fixtures/producers'
import { getApiUrl } from '../shared/api/apiUrl'

export const handlers = [
  http.get(getApiUrl('/health'), () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  http.get(getApiUrl('/dashboard'), () => {
    return HttpResponse.json(dashboardFixture)
  }),
  http.get(getApiUrl('/producers'), ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')

    return HttpResponse.json(getProducersPage(page, limit))
  }),
  http.get(getApiUrl('/producers/:id'), ({ params }) => {
    const producer = producerFixtures.find((p) => p.id === String(params.id))

    if (!producer) {
      return HttpResponse.json(
        { message: 'Produtor não encontrado' },
        { status: 404 }
      )
    }

    return HttpResponse.json(producer)
  }),
  http.post(getApiUrl('/producers'), async ({ request }) => {
    const body = (await request.json()) as any
    const newProducer = addProducerFixture(body)
    return HttpResponse.json(newProducer, { status: 201 })
  }),
  http.patch(getApiUrl('/producers/:id'), async ({ params, request }) => {
    const body = (await request.json()) as any
    const updated = updateProducerFixture(String(params.id), body)

    if (!updated) {
      return HttpResponse.json(
        { message: 'Produtor não encontrado' },
        { status: 404 }
      )
    }

    return HttpResponse.json(updated)
  }),
  http.delete(getApiUrl('/producers/:id'), ({ params }) => {
    const removed = removeProducerFixture(String(params.id))

    if (!removed) {
      return HttpResponse.json(
        { message: 'Produtor não encontrado' },
        { status: 404 }
      )
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
