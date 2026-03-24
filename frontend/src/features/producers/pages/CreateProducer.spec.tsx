import { http, HttpResponse } from 'msw'
import { render, screen, fireEvent, waitFor } from '@/shared/test/test-utils'
import { CreateProducer } from './CreateProducer'
import { resetProducerFixtures } from '@/mocks/fixtures/producers'
import { server } from '@/mocks/server'
import { getApiUrl } from '@/shared/api/apiUrl'

describe('CreateProducer', () => {
  beforeEach(() => {
    resetProducerFixtures()
  })

  it('renders the creation page correctly', () => {
    render(<CreateProducer />)

    expect(screen.getByText('Novo Produtor')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    expect(screen.getByLabelText('CPF ou CNPJ')).toBeInTheDocument()
    expect(screen.getByText('Propriedades (Fazendas)')).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    render(<CreateProducer />)

    fireEvent.click(screen.getByRole('button', { name: /Salvar Produtor/i }))

    expect(await screen.findByText('O nome deve ter pelo menos 3 caracteres')).toBeInTheDocument()
    expect(screen.getByText('CPF ou CNPJ inválido')).toBeInTheDocument()
  })

  it('allows adding and removing farms', async () => {
    render(<CreateProducer />)

    const addButton = screen.getByRole('button', { name: /Adicionar Fazenda/i })
    fireEvent.click(addButton)

    expect(screen.getByLabelText('Nome da Fazenda')).toBeInTheDocument()
    
    const removeButton = screen.getByTitle('Remover fazenda')
    fireEvent.click(removeButton)

    expect(screen.queryByLabelText('Nome da Fazenda')).not.toBeInTheDocument()
  })

  it('validates area consistency', async () => {
    render(<CreateProducer />)

    fireEvent.click(screen.getByRole('button', { name: /Adicionar Fazenda/i }))

    const totalAreaInput = screen.getByLabelText('Área Total (ha)')
    const agriculturalAreaInput = screen.getByLabelText('Área Agricultável (ha)')
    const vegetationAreaInput = screen.getByLabelText('Área Vegetação (ha)')

    fireEvent.change(totalAreaInput, { target: { value: '100' } })
    fireEvent.change(agriculturalAreaInput, { target: { value: '60' } })
    fireEvent.change(vegetationAreaInput, { target: { value: '50' } }) // 60 + 50 > 100

    fireEvent.click(screen.getByRole('button', { name: /Salvar Produtor/i }))

    expect(
      await screen.findAllByText('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total')
    ).toHaveLength(2) // erro exibido em agriculturalArea e vegetationArea
  })

  it('submits the form successfully with nested data', async () => {
    render(<CreateProducer />)

    // Basic data
    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Novo Produtor Teste' } })
    fireEvent.change(screen.getByLabelText('CPF ou CNPJ'), { target: { value: '529.982.247-25' } })

    // Add Farm
    fireEvent.click(screen.getByRole('button', { name: /Adicionar Fazenda/i }))
    fireEvent.change(screen.getByLabelText('Nome da Fazenda'), { target: { value: 'Fazenda Teste' } })
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Ribeirão Preto' } })
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'SP' } })
    fireEvent.change(screen.getByLabelText('Área Total (ha)'), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText('Área Agricultável (ha)'), { target: { value: '60' } })
    fireEvent.change(screen.getByLabelText('Área Vegetação (ha)'), { target: { value: '30' } })

    // Add Harvest
    fireEvent.click(screen.getByRole('button', { name: /Adicionar Safra/i }))
    fireEvent.change(screen.getByLabelText('Ano da Safra'), { target: { value: '2024/2025' } })

    // Add Crop
    fireEvent.click(screen.getByRole('button', { name: /Adicionar Cultura/i }))
    fireEvent.change(screen.getByRole('combobox', { name: /Cultura/i }), { target: { value: 'Soja' } })

    fireEvent.click(screen.getByRole('button', { name: /Salvar Produtor/i }))

    await waitFor(() => {
      // Check if redirected to list
      expect(window.location.pathname).toBe('/produtores')
    })
  })

  it('shows submit error when API returns error', async () => {
    server.use(
      http.post(getApiUrl('/api/producers'), () =>
        HttpResponse.json({ message: 'Documento já cadastrado' }, { status: 409 })
      )
    )

    render(<CreateProducer />)

    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Produtor Teste' } })
    fireEvent.change(screen.getByLabelText('CPF ou CNPJ'), { target: { value: '529.982.247-25' } })

    fireEvent.click(screen.getByRole('button', { name: /Adicionar Fazenda/i }))
    fireEvent.change(screen.getByLabelText('Nome da Fazenda'), { target: { value: 'Fazenda Teste' } })
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Cuiabá' } })
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'MT' } })
    fireEvent.change(screen.getByLabelText('Área Total (ha)'), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText('Área Agricultável (ha)'), { target: { value: '60' } })
    fireEvent.change(screen.getByLabelText('Área Vegetação (ha)'), { target: { value: '30' } })

    fireEvent.click(screen.getByRole('button', { name: /Adicionar Safra/i }))
    fireEvent.change(screen.getByLabelText('Ano da Safra'), { target: { value: '2024/2025' } })

    fireEvent.click(screen.getByRole('button', { name: /Adicionar Cultura/i }))
    fireEvent.change(screen.getByRole('combobox', { name: /Cultura/i }), { target: { value: 'Soja' } })

    fireEvent.click(screen.getByRole('button', { name: /Salvar Produtor/i }))

    expect(await screen.findByText('Documento já cadastrado')).toBeInTheDocument()
  })
})
