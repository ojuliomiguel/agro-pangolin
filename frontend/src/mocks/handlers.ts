import { http, HttpResponse } from 'msw'
import { dashboardFixture } from './fixtures/dashboard'
import {
  getProducersPage,
  removeProducerFixture,
} from './fixtures/producers'
import { getApiUrl } from '../shared/api/apiUrl'

export const handlers = [
  http.get(getApiUrl('/api/health'), () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  http.get(getApiUrl('/api/dashboard'), () => {
    return HttpResponse.json(dashboardFixture)
  }),
  http.get(getApiUrl('/api/producers'), ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '10')

    return HttpResponse.json(getProducersPage(page, limit))
  }),
  http.delete(getApiUrl('/api/producers/:id'), ({ params }) => {
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
