export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(until-async|@mswjs|msw)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { 
      diagnostics: false,
      tsconfig: {
        jsx: 'react-jsx',
        allowJs: true,
        verbatimModuleSyntax: false,
        esModuleInterop: true
      } 
    }],
  },
}
