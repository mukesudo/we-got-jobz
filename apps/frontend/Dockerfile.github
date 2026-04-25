# Frontend Dockerfile - Runtime only (build artifacts copied in)
FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy built artifacts from local build (run: pnpm turbo run build first)
COPY apps/frontend/.next/standalone ./
COPY apps/frontend/.next/static ./apps/frontend/.next/static
COPY apps/frontend/public ./apps/frontend/public

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3001
CMD ["node", "apps/frontend/server.js"]
