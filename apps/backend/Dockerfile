# Backend Dockerfile
FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manifests for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/
COPY packages/common/package.json ./packages/common/

# Install pnpm and dependencies
RUN npm install -g pnpm@9.15.4
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Generate Prisma client before build
RUN cd packages/db && pnpm run db:generate

# Build backend (webpack bundles workspace packages inline)
RUN pnpm turbo run build --filter=backend

# Switch to backend directory for runtime
WORKDIR /app/apps/backend
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]
