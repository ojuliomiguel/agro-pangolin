import { shouldEnableMocks } from './runtime'

describe('shouldEnableMocks', () => {
  it('habilita mocks apenas quando o toggle estiver ativo em desenvolvimento', () => {
    expect(shouldEnableMocks({ DEV: true, VITE_ENABLE_MSW: 'true' })).toBe(true)
  })

  it('mantem mocks desligados por padrao em desenvolvimento', () => {
    expect(shouldEnableMocks({ DEV: true })).toBe(false)
  })

  it('mantem mocks desligados fora de desenvolvimento', () => {
    expect(shouldEnableMocks({ DEV: false, VITE_ENABLE_MSW: 'true' })).toBe(false)
  })
})
