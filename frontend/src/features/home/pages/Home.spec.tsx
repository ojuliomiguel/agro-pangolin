import { render, screen } from '@/shared/test/test-utils'
import { Home } from './Home'

describe('Home Page', () => {
  it('renders main application title and description', () => {
    render(<Home />)
    expect(screen.getByText('Agro Pangolin')).toBeInTheDocument()
    expect(screen.getByText(/Sistema de gestão/i)).toBeInTheDocument()
  })

  it('renders navigation cards', () => {
    render(<Home />)
    expect(screen.getByText('Visão Analítica')).toBeInTheDocument()
    expect(screen.getByText('Gestão de Produtores')).toBeInTheDocument()
  })
})
