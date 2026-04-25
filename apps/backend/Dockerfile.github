# Backend Dockerfile - Runtime only (build artifacts copied in)
FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy built artifacts from local build (run: pnpm turbo run build first)
COPY apps/backend/dist ./dist
COPY apps/backend/package.json ./package.json
COPY apps/backend/node_modules ./node_modules

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]
