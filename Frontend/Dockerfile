FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN pnpm install \
    --registry=https://registry.npmmirror.com/ \
    --fetch-timeout=120000 \
    --fetch-retries=5 \
    --fetch-retry-factor=10 \
    --fetch-retry-maxtimeout=120000

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start"]