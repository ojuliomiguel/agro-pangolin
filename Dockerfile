FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile && yarn cache clean
COPY --from=builder /usr/src/app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
