# Project Index - Freelance Marketplace

## Quick Navigation

### Frontend (Next.js 15)

**Auth Pages:**
- [Login Page](apps/frontend/src/app/auth/login/page.tsx)
- [Signup Page](apps/frontend/src/app/auth/signup/page.tsx)

**Marketplace Pages:**
- [Jobs List](apps/frontend/src/app/marketplace/jobs/page.tsx)
- [Job Details](apps/frontend/src/app/marketplace/jobs/[id]/page.tsx)
- [Dashboard](apps/frontend/src/app/marketplace/dashboard/page.tsx)

**Components:**
- [Navbar](apps/frontend/src/components/layout/navbar.tsx)
- [Job Card](apps/frontend/src/components/features/job-card.tsx)

**Configuration:**
- [Auth Client](apps/frontend/src/lib/auth-client.ts)
- [API Client](apps/frontend/src/lib/api-client.ts)
- [Next Config](apps/frontend/next.config.js)

### Backend (NestJS)

**Services:**
- [Jobs Service](apps/backend/src/jobs/jobs.service.ts) - Job/Project management
- [Users Service](apps/backend/src/users/users.service.ts) - User management
- [Bids Service](apps/backend/src/bids/bids.service.ts) - Bid management
- [Messages Service](apps/backend/src/messages/messages.service.ts) - Messaging
- [Payments Service](apps/backend/src/payments/payments.service.ts) - Payment processing

**DTOs:**
- [Create Job DTO](apps/backend/src/jobs/dto/create-job.dto.ts)
- [Create User DTO](apps/backend/src/users/dto/create-user.dto.ts)
- [Create Bid DTO](apps/backend/src/bids/dto/create-bid.dto.ts)

**Configuration:**
- [Auth Guard](apps/backend/src/auth/auth.guard.ts)
- [Auth Service](apps/backend/src/auth/auth.service.ts)
- [Prisma Service](apps/backend/src/prisma/prisma.service.ts)

### Database (Prisma)

**Schema:**
- [Prisma Schema](packages/db/prisma/schema.prisma)

**Key Models:**
- User - Authentication & profile
- FreelancerProfile - Freelancer-specific data
- ClientProfile - Client-specific data
- Project - Job postings
- Bid - Project bids
- Contract - Project contracts
- Transaction - Payments
- Review - Ratings & reviews
- Message - Project messaging

### Shared Packages

**Common:**
- [Types](packages/common/src/types/index.ts)
- [Constants](packages/common/src/constants/index.ts)
- [Utils](packages/common/src/utils/index.ts)

**UI Components:**
- [Button](packages/ui/src/button.tsx)
- [Card](packages/ui/src/card.tsx)

### DevOps & Deployment

**Docker:**
- [Backend Dockerfile](apps/backend/Dockerfile)
- [Frontend Dockerfile](apps/frontend/Dockerfile)
- [Docker Compose Dev](docker-compose.yml)
- [Docker Compose Prod](docker-compose.prod.yml)

**Kubernetes:**
- [Backend Deployment](kubernetes/manifests/backend-deployment.yaml)
- [Frontend Deployment](kubernetes/manifests/frontend-deployment.yaml)
- [Infrastructure](kubernetes/manifests/infrastructure.yaml)
- [Ingress](kubernetes/manifests/ingress.yaml)
- [Helm Chart](kubernetes/helm/Chart.yaml)
- [Helm Values](kubernetes/helm/values.yaml)

**Monitoring:**
- [Prometheus Config](monitoring/prometheus.yml)

### CI/CD Pipelines

**GitHub Actions:**
- [CI Pipeline](.github/workflows/ci.yml) - Linting, tests, builds
- [CD Pipeline](.github/workflows/cd.yml) - Docker build & K8s deploy
- [Test Pipeline](.github/workflows/tests.yml) - Unit & E2E tests

### Documentation

- [Main README](README.md) - Project overview
- [Deployment Guide](DEPLOYMENT.md) - Deployment instructions
- [Kubernetes Guide](kubernetes/README.md) - K8s setup details
- [Architecture Diagram](README.md#-architecture) - System design

## Project Structure

```
freelance-marketplace/
├── apps/
│   ├── frontend/          # Next.js 15 app
│   ├── backend/           # NestJS API
│   └── docs/              # Turbodocs
├── packages/
│   ├── db/                # Prisma ORM
│   ├── ui/                # Shared components
│   └── common/            # Shared utilities
├── kubernetes/            # K8s & Helm configs
├── .github/workflows/     # CI/CD pipelines
├── monitoring/            # Prometheus config
├── docker-compose.yml     # Dev stack
├── docker-compose.prod.yml # Prod stack
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # Main documentation
```

## Key Features Implemented

✅ **Authentication**
- Email/Password sign up & login
- Session management
- Better Auth integration

✅ **Marketplace**
- Job listing & discovery
- Project details view
- Bid management system

✅ **User Management**
- Freelancer profiles
- Client profiles
- User dashboard

✅ **Payments**
- Stripe integration
- Transaction tracking
- Payment processing

✅ **Messaging**
- Project-based messaging
- Real-time notifications
- Message history

✅ **Reviews & Ratings**
- User reviews
- Rating system
- Review history

✅ **DevOps & Monitoring**
- Docker containerization
- Kubernetes orchestration
- Prometheus metrics
- Grafana dashboards
- GitHub Actions CI/CD

## Development Workflow

### 1. Local Setup
```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

### 2. Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes
```bash
# Edit files in apps/frontend, apps/backend, etc.
pnpm lint
pnpm type-check
```

### 4. Test
```bash
pnpm test
pnpm test:e2e
```

### 5. Commit & Push
```bash
git commit -am "feat: add amazing feature"
git push origin feature/amazing-feature
```

### 6. Create Pull Request
- CI/CD pipelines run automatically
- Wait for checks to pass
- Request review

### 7. Deploy
```bash
git merge to main
# CD pipeline automatically deploys
```

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL 16, Redis 7 |
| Auth | Better Auth |
| Payments | Stripe API |
| DevOps | Docker, Kubernetes, Helm |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana, Loki |
| Cloud Ready | Railway, Fly.io, AWS, GCP, Azure |

## Running Locally

### Quick Start (Docker Compose)
```bash
docker-compose up -d
# Frontend: localhost:3001
# Backend: localhost:3000
# Grafana: localhost:3002
```

### With pnpm
```bash
pnpm install
pnpm db:push
pnpm dev
```

## Deployment Commands

### Docker
```bash
docker-compose build
docker-compose push
```

### Kubernetes
```bash
kubectl apply -f kubernetes/manifests/
helm install freelance kubernetes/helm
```

### Railway
```bash
railway link
railway up
```

### Fly.io
```bash
flyctl deploy
```

## Support & Resources

- **Documentation**: [README.md](README.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Kubernetes**: [kubernetes/README.md](kubernetes/README.md)
- **API Docs**: `/api/docs` (when running backend)
- **Prisma Studio**: `pnpm db:studio`

## Next Steps

1. ✅ Project structure created
2. ✅ Frontend pages & components implemented
3. ✅ Backend services & modules completed
4. ✅ Database schema configured
5. ✅ Docker & Kubernetes setup done
6. ✅ CI/CD pipelines configured
7. ⏭ Connect to real database
8. ⏭ Setup payment processing
9. ⏭ Configure email service
10. ⏭ Deploy to production

---

**Last Updated**: January 5, 2026
**Status**: Ready for Development
