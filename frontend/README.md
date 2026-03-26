# Agro Pangolin — Frontend

Interface web do sistema de gestão de produtores rurais.

## Tecnologias

- React 19 + TypeScript (strict)
- Vite 7
- Tailwind CSS v4
- Redux Toolkit + RTK Query
- React Router 7
- React Hook Form + Zod
- Recharts
- Jest + React Testing Library + MSW

## Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:3000` (veja `../backend`)

## Instalação

```bash
cd frontend
npm install
```

## Desenvolvimento

```bash
npm run dev
```

O frontend resolve a API em `http://localhost:3000` por padrão. Os mocks com MSW ficam desligados em desenvolvimento. Para ativá-los:

```bash
VITE_ENABLE_MSW=true npm run dev
```

## Testes

```bash
npm test
```

Para rodar em modo watch:

```bash
npm run test -- --watch
```

Os testes usam Jest + React Testing Library + MSW. O MSW é configurado automaticamente no `jest.setup.ts`.

## Build

```bash
npm run build
```

## Estrutura

```
src/
  app/
    providers/   — Redux Provider
    router/      — Rotas e configuração
    store/       — Redux store
  features/
    dashboard/   — Tela analítica
    home/        — Tela inicial
    producers/   — CRUD de produtores
  shared/
    api/         — Cliente HTTP (RTK Query base)
    components/  — Componentes reutilizáveis
    test/        — Utilitários de teste
    utils/       — cn e outros helpers
  mocks/
    handlers/    — Handlers MSW
    fixtures/    — Dados de teste
```

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_ENABLE_MSW` | `false` | Ativa os mocks MSW em desenvolvimento |

## Rotas disponíveis

| Rota | Tela |
|---|---|
| `/` | Home |
| `/dashboard` | Dashboard analítico |
| `/produtores` | Lista de produtores |
| `/produtores/novo` | Cadastro de produtor |
| `/produtores/:id` | Detalhe do produtor |
| `/produtores/:id/editar` | Edição de produtor |
