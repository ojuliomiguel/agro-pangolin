export interface RuntimeEnv {
  DEV?: boolean
  VITE_ENABLE_MSW?: string
}

export function shouldEnableMocks(env: RuntimeEnv): boolean {
  return Boolean(env.DEV) && env.VITE_ENABLE_MSW === 'true'
}
