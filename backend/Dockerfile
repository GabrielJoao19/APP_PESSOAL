# Etapa de compilação
FROM node:24-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Etapa final de execução
FROM node:24-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

# Sincroniza as tabelas do banco no Postgres, roda o seed inicial e inicia o servidor NestJS
CMD ["sh", "-c", "npx prisma db push && (node prisma/seed.js || true) && node dist/main.js"]
