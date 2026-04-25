# Backend Dockerfile
FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/
COPY packages/common/package.json ./packages/common/

RUN npm install -g pnpm@9.15.4
RUN pnpm install --frozen-lockfile
RUN cd packages/db && pnpm run db:generate
RUN pnpm turbo run build --filter=backend

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]
