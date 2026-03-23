import { render, screen } from '@/shared/test/test-utils'
import { MainLayout } from './MainLayout'

describe('MainLayout', () => {
  it('renderiza a barra lateral com os itens de navegação', () => {
    render(<MainLayout />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument() // It may have Home in sidebar and maybe an icon name
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Produtores')).toBeInTheDocument()
  })
})
