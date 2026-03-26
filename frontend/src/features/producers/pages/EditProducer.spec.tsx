import { http, HttpResponse } from 'msw'
import { render, screen, fireEvent, waitFor } from '@/shared/test/test-utils'
import { EditProducer } from './EditProducer'
import { resetProducerFixtures, producerFixtures } from '@/mocks/fixtures/producers'
import { server } from '@/mocks/server'
import { getApiUrl } from '@/shared/api/apiUrl'

const PRODUCER_ROUTE = '/produtores/:id/editar'

function renderWithRoute(id: string) {
  return render(<EditProducer />, {
    initialEntries: [`/produtores/${id}/editar`],
    path: PRODUCER_ROUTE,
  })
}

describe('EditProducer', () => {
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

  it('carrega o formulário com os dados do produtor', async () => {
    const producer = producerFixtures.find((p) => p.farms.length > 0)!
    renderWithRoute(producer.id)

    expect(await screen.findByDisplayValue(producer.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(producer.document)).toBeInTheDocument()
  })

  it('submete alterações com sucesso e redireciona para o detalhe', async () => {
    const producer = producerFixtures.find((p) => p.farms.length > 0)!
    renderWithRoute(producer.id)

    const nameInput = await screen.findByLabelText('Nome completo')
    fireEvent.change(nameInput, { target: { value: 'Produtor Atualizado' } })

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Salvar Alterações/i })).not.toBeInTheDocument()
    })
  })

  it('exibe erro de API ao salvar', async () => {
    server.use(
      http.patch(getApiUrl('/producers/:id'), () =>
        HttpResponse.json({ message: 'Erro de validação no servidor' }, { status: 422 })
      )
    )

    const producer = producerFixtures.find((p) => p.farms.length > 0)!
    renderWithRoute(producer.id)

    await screen.findByDisplayValue(producer.name)

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))

    expect(await screen.findByText('Erro de validação no servidor')).toBeInTheDocument()
  })

  it('exibe erro ao carregar dados do produtor', async () => {
    server.use(
      http.get(getApiUrl('/producers/:id'), () =>
        HttpResponse.json({ message: 'Erro interno' }, { status: 500 })
      )
    )

    renderWithRoute('producer-1')

    expect(await screen.findByText(/erro ao carregar produtor/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })
})
