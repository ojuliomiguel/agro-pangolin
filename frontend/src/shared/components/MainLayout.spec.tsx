import { render, screen } from '@/shared/test/test-utils'
import userEvent from '@testing-library/user-event'
import { MainLayout } from './MainLayout'

describe('MainLayout', () => {
  it('renderiza a barra lateral com os itens de navegação', () => {
    render(<MainLayout />)
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Produtores')[0]).toBeInTheDocument()
  })

  it('exibe o botão de abrir menu em mobile', () => {
    render(<MainLayout />)
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument()
  })

  it('botão de fechar menu não está acessível antes de abrir', () => {
    render(<MainLayout />)
    expect(screen.queryByRole('button', { name: 'Fechar menu' })).not.toBeInTheDocument()
  })

  it('abre a barra lateral mobile ao clicar no botão de menu', async () => {
    const user = userEvent.setup()
    render(<MainLayout />)

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
  })

  it('fecha a barra lateral mobile ao clicar no botão de fechar', async () => {
    const user = userEvent.setup()
    render(<MainLayout />)

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }))

    expect(screen.queryByRole('button', { name: 'Fechar menu' })).not.toBeInTheDocument()
  })
})
