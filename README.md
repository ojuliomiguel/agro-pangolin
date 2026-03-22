# Agro Pangolin

API NestJS para o contexto `producers`, com Postgres, TypeORM, Swagger, validação de borda e health check público.

## Requisitos

- Node.js 22+
- Yarn 1.x
- Postgres disponível na máquina ou em container

## Configuração

Defina as variáveis de ambiente abaixo antes de subir a aplicação:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT`
- `CORS_ORIGIN`
- `DOCS_ENABLED`

Exemplo local:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=agropangolin
export PORT=3000
```

## Execução via Docker (Recomendado)

Para subir o banco de dados e a aplicação simultaneamente de forma orquestrada, execute:

```bash
docker-compose up -d --build
```

Caso precise rodar as migrations e popular o banco dentro do container, execute:

```bash
docker exec -it agro-pangolin-api yarn migration:run
docker exec -it agro-pangolin-api yarn seed
```

## Execução Local

```bash
yarn install
yarn migration:run
yarn seed
yarn start:dev
```

## Documentação

- Health check: `GET /health`
- Swagger UI: `GET /docs`
- OpenAPI JSON: `GET /docs-json`

## CRUD de Producers

- `POST /producers`
- `GET /producers`
- `GET /producers/:id`
- `PATCH /producers/:id`
- `DELETE /producers/:id`

## Testes

```bash
yarn test
yarn test:e2e
```
