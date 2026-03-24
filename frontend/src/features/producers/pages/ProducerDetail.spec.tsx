import { http, HttpResponse } from 'msw'
import { render, screen } from '@/shared/test/test-utils'
import { ProducerDetail } from './ProducerDetail'
import { resetProducerFixtures, producerFixtures } from '@/mocks/fixtures/producers'
import { server } from '@/mocks/server'
import { getApiUrl } from '@/shared/api/apiUrl'

const PRODUCER_ROUTE = '/produtores/:id'

function renderWithRoute(id: string) {
  return render(<ProducerDetail />, {
    initialEntries: [`/produtores/${id}`],
    path: PRODUCER_ROUTE,
  })
}

describe('ProducerDetail', () => {
  beforeEach(() => {
    resetProducerFixtures()
  })

  it('exibe skeleton enquanto carrega', () => {
    server.use(
      http.get(getApiUrl('/producers/:id'), async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return HttpResponse.json({})
      })
    )

    const producer = producerFixtures[0]
    renderWithRoute(producer.id)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renderiza nome, documento e fazendas aninhadas com sucesso', async () => {
    const producer = producerFixtures.find((p) => p.farms.length > 0)!
    renderWithRoute(producer.id)

    expect(await screen.findByText(producer.name)).toBeInTheDocument()
    expect(screen.getByText(producer.document)).toBeInTheDocument()

    const farm = producer.farms[0]
    expect(screen.getByText(farm.name)).toBeInTheDocument()
    expect(screen.getAllByText(new RegExp(farm.city, 'i')).length).toBeGreaterThan(0)

    const harvest = farm.harvests[0]
    expect(screen.getAllByText(harvest.year).length).toBeGreaterThan(0)

    const crop = harvest.crops[0]
    expect(screen.getAllByText(crop.name).length).toBeGreaterThan(0)
  })

  it('exibe mensagem de vazio quando produtor não tem fazendas', async () => {
    const producer = producerFixtures.find((p) => p.farms.length === 0)!
    renderWithRoute(producer.id)

    expect(await screen.findByText(producer.name)).toBeInTheDocument()
    expect(
      screen.getByText(/nenhuma fazenda cadastrada/i)
    ).toBeInTheDocument()
  })

  it('exibe erro de produtor não encontrado para ID inexistente', async () => {
    renderWithRoute('id-inexistente')

    expect(await screen.findByText(/produtor não encontrado/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar para produtores/i })).toBeInTheDocument()
  })

  it('exibe erro genérico quando a API falha', async () => {
    server.use(
      http.get(getApiUrl('/producers/:id'), () =>
        HttpResponse.json({ message: 'Erro interno' }, { status: 500 })
      )
    )

    renderWithRoute('producer-1')

    expect(await screen.findByText(/erro ao carregar produtor/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('exibe botões de editar e excluir', async () => {
    const producer = producerFixtures[0]
    renderWithRoute(producer.id)

    expect(await screen.findByText(producer.name)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument()
  })
})
