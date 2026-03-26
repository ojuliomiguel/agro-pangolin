import { render, screen } from '@/shared/test/test-utils'
import { Home } from './Home'

describe('Página inicial', () => {
  it('renderiza o título principal da aplicação e a descrição', () => {
    render(<Home />)
    expect(screen.getByText('Agro Pangolin')).toBeInTheDocument()
    expect(screen.getByText(/Gestão de produtores rurais/i)).toBeInTheDocument()
  })

  it('renderiza os cards de navegação', () => {
    render(<Home />)
    expect(screen.getByText('Visão Analítica')).toBeInTheDocument()
    expect(screen.getByText('Gestão de Produtores')).toBeInTheDocument()
  })
})
