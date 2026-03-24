import { resolveApiOrigin } from './apiUrl'

describe('resolveApiOrigin', () => {
  it('usa a porta 3000 por padrao quando nao ha origem da aplicacao', () => {
    expect(resolveApiOrigin()).toBe('http://localhost:3000')
  })

  it('redireciona desenvolvimento local para o backend na porta 3000', () => {
    expect(resolveApiOrigin('http://localhost:5173')).toBe('http://localhost:3000')
    expect(resolveApiOrigin('http://127.0.0.1:4173')).toBe('http://localhost:3000')
  })

  it('preserva a origem atual fora do cenario local de desenvolvimento', () => {
    expect(resolveApiOrigin('https://agro-pangolin.example.com')).toBe(
      'https://agro-pangolin.example.com'
    )
    expect(resolveApiOrigin('http://localhost:3000')).toBe('http://localhost:3000')
  })
})
