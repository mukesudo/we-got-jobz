# 🚀 Freelance Marketplace - Enterprise Scale

A production-ready, fully scalable freelance marketplace built with Next.js 15, NestJS, Turbo Monorepo, better-auth, Kubernetes, and comprehensive telemetry.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5)](https://kubernetes.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)

## ✨ Features

### Core Marketplace
- **Job Management**: Create, browse, and manage freelance jobs
- **Bidding System**: Freelancers submit competitive bids with proposals
- **Contracts**: Secure contracts with milestone-based payments
- **Real-time Messaging**: WebSocket-based instant communication
- **Reviews & Ratings**: Complete rating system with verified reviews
- **Dispute Resolution**: Built-in dispute handling mechanism

### Authentication & Security
- **Better Auth Integration**: Secure email/password & OAuth (Google, GitHub)
- **Session Management**: Automatic session validation with Redis caching
- **JWT Tokens**: Secure API authentication
- **Role-based Access Control**: Employer, Freelancer, Admin roles
- **CORS Protection**: Properly configured CORS policies
- **Rate Limiting**: Endpoint rate limiting via NestJS throttler

### Payments & Monetization
- **Stripe Integration**: Complete payment processing (test mode ready)
- **Subscription Plans**: Tiered pricing (Basic $9.99, Pro $29.99)
- **Milestone Payments**: Secure milestone-based fund releases
- **Commission System**: 10% platform fee on job completions
- **Escrow Management**: Funds held securely until job completion

### SEO & Performance
- **Next.js Metadata API**: Dynamic SEO optimization
- **Automatic Sitemap**: XML sitemap generation
- **Image Optimization**: next/image for Core Web Vitals
- **Server Components**: RSC for optimal performance
- **Static Generation**: ISR for frequently accessed pages
- **Structured Data**: Schema.org markup for search engines

### Enterprise Scale
- **Docker Containerization**: Multi-stage builds for lean images
- **Kubernetes Orchestration**: Production-ready K8s manifests
- **Horizontal Scaling**: Auto-scaling based on CPU/memory
- **Vertical Scaling**: Resource optimization per pod
- **Load Balancing**: Ingress-based traffic distribution
- **Distributed Tracing**: OpenTelemetry instrumentation
- **Centralized Logging**: Prometheus, Grafana, Loki stack
- **Health Checks**: Liveness and readiness probes
- **CI/CD Pipeline**: GitHub Actions automated deployment

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: App Router with React 19
- **TypeScript**: Type-safe development
- **shadcn/ui**: Beautiful, accessible components
- **Tailwind CSS**: Utility-first styling
- **better-auth/react**: Client-side authentication
- **TanStack Query**: Data fetching & caching
- **Zod**: Schema validation

### Backend
- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type safety
- **Prisma**: ORM for database access
- **better-auth**: Authentication provider
- **GraphQL Optional**: Query language support
- **WebSockets**: Real-time communication
- **OpenTelemetry**: Distributed tracing
- **Swagger/OpenAPI**: API documentation

### Database
- **PostgreSQL**: Primary relational database
- **Redis**: Caching and session store
- **Prisma Migrations**: Schema versioning

### DevOps & Observability
- **Docker**: Container runtime
- **Kubernetes**: Orchestration platform
- **Helm**: Kubernetes package management
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards
- **Loki**: Log aggregation
- **GitHub Actions**: CI/CD automation

### Free Tier Services
- **Railway/Fly.io/Render**: Container hosting (free tier)
- **Railway PostgreSQL**: Database hosting
- **Grafana Cloud**: Cloud monitoring (free tier)
- **Stripe Test Mode**: Payment processing (sandbox)
- **GitHub Actions**: CI/CD (free tier for public repos)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/freelance-marketplace.git
cd freelance-marketplace

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
pnpm db:push

# Seed database (optional)
pnpm db:seed

# Start development servers
pnpm dev
```

Visit:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs
- Grafana: http://localhost:3002

### Docker Compose (Quick Start)

```bash
# Start all services
docker-compose -f docker-compose.yml up

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│                   (Next.js 15 Frontend)                      │
│           - Pages, Components, State Management              │
│           - Better Auth Client, TanStack Query               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                    INGRESS LAYER                            │
│          (Kubernetes Ingress / nginx)                       │
│            - SSL/TLS Termination                             │
│            - Rate Limiting                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      API LAYER                              │
│                  (NestJS Backend x3)                        │
│   - Controllers, Services, Guards                           │
│   - OpenTelemetry Instrumentation                           │
│   - Better Auth Server                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│  PostgreSQL  │ │    Redis    │ │  Stripe API │
│   Database   │ │    Cache    │ │  (Payments) │
└──────────────┘ └─────────────┘ └─────────────┘

┌────────────────────────────────────────────────────────────┐
│              OBSERVABILITY LAYER                           │
│  Prometheus → Grafana, Loki, OpenTelemetry                │
└────────────────────────────────────────────────────────────┘
```

### Database Schema Highlights

```prisma
User (Auth + Profile)
├── Account (OAuth)
├── Session
├── Profile
├── postedJobs (as client)
├── submittedBids (as freelancer)
├── contracts
└── payments

Job
├── bids
├── contracts
└── messages

Bid
├── job
├── freelancer
└── client

Contract
├── job
├── payments
└── reviews

Payment
├── contract
├── client
└── freelancer
```

## 💻 Development

### Project Structure

```
freelance-marketplace/
├── apps/
│   ├── frontend/           # Next.js 15 app
│   ├── backend/            # NestJS API
│   └── docs/               # Turbodocs
├── packages/
│   ├── db/                 # Prisma schema
│   ├── ui/                 # Shared components
│   └── common/             # Shared utilities
├── kubernetes/             # K8s manifests & Helm
├── monitoring/             # Prometheus, Loki config
├── .github/workflows/      # CI/CD pipelines
└── docker-compose.yml      # Local development
```

### Available Commands

```bash
# Development
pnpm dev                    # Start dev servers (all apps)
pnpm dev --filter=frontend  # Frontend only
pnpm dev --filter=backend   # Backend only

# Building
pnpm build                  # Build all apps
pnpm build --filter=frontend

# Testing
pnpm test                   # Run tests (all packages)
pnpm test:watch

# Linting & Type Checking
pnpm lint                   # ESLint check
pnpm type-check             # TypeScript check

# Database
pnpm db:push                # Push schema to database
pnpm db:migrate             # Create new migration
pnpm db:seed                # Seed database
pnpm db:studio              # Open Prisma Studio

# Monorepo
pnpm turbo run build        # Turborepo cache-aware build
pnpm turbo run test         # Run tests with caching
```

### Git Workflow

**Commit Message Format** (Conventional Commits)

```
feat(module): description       # New feature
fix(module): description        # Bug fix
chore(module): description      # Maintenance
docs: description              # Documentation
test(module): description      # Tests
refactor(module): description  # Code refactoring
perf(module): description      # Performance improvement

Examples:
- feat(auth): add google oauth provider
- fix(jobs): resolve pagination bug
- chore(docker): optimize multi-stage build
- docs: update deployment guide
```

**Branch Naming**

```
feature/description
fix/description
docs/description
chore/description
```

## 🚢 Deployment

### Local Docker Compose

```bash
docker-compose up -d
# All services available:
# - Frontend: localhost:3001
# - Backend: localhost:3000
# - Prometheus: localhost:9090
# - Grafana: localhost:3002
```

### Railway (Free Tier)

Railway offers free tier with 5GB storage and $5 monthly credit.

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs
```

### Fly.io (Free Tier)

$5 monthly free credits with 1GB RAM, 1 shared CPU.

```bash
# Install Fly CLI
curl https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch
flyctl launch

# Deploy
flyctl deploy
```

### Kubernetes (Production)

```bash
# Add Helm repository
helm repo add freelance https://your-helm-repo.com
helm repo update

# Install
helm install freelance-marketplace freelance/marketplace \
  --namespace production \
  --create-namespace \
  --values kubernetes/helm/values.yaml

# Upgrade
helm upgrade freelance-marketplace freelance/marketplace \
  --namespace production \
  --values kubernetes/helm/values.yaml

# Rollback
helm rollback freelance-marketplace 1 --namespace production
```

### CI/CD with GitHub Actions

The project includes a complete GitHub Actions pipeline that:
1. Runs linting and type checks
2. Executes unit/integration tests
3. Builds Docker images
4. Pushes to container registry
5. Deploys to Kubernetes (main branch only)

**Setup:**

1. Add secrets to GitHub repository:
   - `KUBECONFIG`: Base64-encoded kubeconfig file
   - `STRIPE_SECRET_KEY`: Stripe API key
   - `DATABASE_URL`: Production database URL
   - `REDIS_URL`: Production Redis URL

2. Push to main branch to trigger deployment

## 📊 Monitoring

### Prometheus Metrics

Access at: `http://localhost:9090`

Key metrics:
- `http_requests_total`: API request count
- `http_request_duration_seconds`: Request latency
- `nestjs_errors_total`: Application errors
- `process_cpu_seconds_total`: CPU usage
- `nodejs_heap_size_bytes`: Memory usage

### Grafana Dashboards

Access at: `http://localhost:3002` (admin/admin)

Pre-configured dashboards:
- Application Metrics
- Database Performance
- API Response Times
- Error Rates
- Business Metrics

### Loki Logs

Access through Grafana > Explore > Loki

Query examples:
```
{job="backend"} | json | level="ERROR"
{job="frontend"} | json | status=500
```

### OpenTelemetry Tracing

Configure Jaeger/Zipkin endpoint in `.env.local`:

```env
OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318
```

## 🔐 Security

- **HTTPS/TLS**: Automatic with cert-manager
- **CORS**: Restricted to configured origins
- **Rate Limiting**: 100 req/min per IP
- **Password Hashing**: Argon2 via better-auth
- **Session Security**: Secure HTTP-only cookies
- **Input Validation**: Zod schemas + NestJS pipes
- **SQL Injection Prevention**: Prisma ORM
- **CSRF Protection**: Built-in with better-auth
- **Secrets Management**: Environment variables only
- **Pod Security**: Non-root containers

## 💰 Monetization

### Revenue Streams

1. **Platform Fee**: 10% commission on successful projects
2. **Premium Subscriptions**:
   - Basic: $9.99/month (Standard features)
   - Pro: $29.99/month (Priority support + featured listings)
3. **Featured Listings**: $2.99 per job posting
4. **API Access**: Enterprise API tier (future)

### Stripe Integration

Payment processing via Stripe (test mode ready):

```typescript
// Backend payment creation
const payment = await stripe.paymentIntents.create({
  amount: jobAmount * 100, // in cents
  currency: 'usd',
  metadata: { jobId, clientId }
});
```

## 📈 Performance Optimizations

### Frontend
- Image optimization via next/image
- Code splitting with dynamic imports
- Static generation (ISR)
- Edge caching with Vercel/Fly.io
- Bundle size optimization

### Backend
- Database connection pooling
- Redis caching layer
- Request/response compression
- Horizontal pod auto-scaling
- Database query optimization (Prisma)

### Infrastructure
- Multi-stage Docker builds
- Resource limits per pod
- CDN integration ready
- Database replicas (PostgreSQL)
- Read replicas configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow commit conventions
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙋 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Docs**: https://docs.freelance-marketplace.com

---

**Built with ❤️ using modern web technologies**