# Deployment Guide - Freelance Marketplace

This guide covers deploying the Freelance Marketplace application to various platforms.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Compose](#docker-compose)
3. [Kubernetes](#kubernetes)
4. [Railway](#railway)
5. [Fly.io](#flyio)
6. [Vercel/Netlify](#vercelnetlify)

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 16+
- Redis 7+

### Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Setup database
pnpm db:push

# Seed database (optional)
pnpm db:seed

# Start development servers
pnpm dev
```

Access:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

---

## Docker Compose

### Development Stack

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Stack

```bash
# Copy environment file
cp .env.example .env

# Start production stack with full observability
docker-compose -f docker-compose.prod.yml up -d

# View services
docker-compose -f docker-compose.prod.yml ps
```

Access:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Grafana: http://localhost:3002 (admin/admin)
- Prometheus: http://localhost:9090
- Loki: http://localhost:3100

---

## Kubernetes

### Prerequisites

- Kubernetes 1.24+
- Helm 3.0+
- kubectl configured
- Persistent Volume provisioner

### Quick Start

```bash
# Create namespace
kubectl create namespace production

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=redis-url='redis://...' \
  --from-literal=jwt-secret='...' \
  -n production

# Install with Helm
helm install freelance kubernetes/helm \
  --namespace production

# Verify installation
kubectl get pods -n production
```

### Manual Deployment

```bash
# Apply infrastructure
kubectl apply -f kubernetes/manifests/infrastructure.yaml

# Apply applications
kubectl apply -f kubernetes/manifests/backend-deployment.yaml
kubectl apply -f kubernetes/manifests/frontend-deployment.yaml

# Setup ingress
kubectl apply -f kubernetes/manifests/ingress.yaml
```

See [Kubernetes README](kubernetes/README.md) for detailed instructions.

---

## Railway

Railway offers a free tier with $5 monthly credits.

### Deployment Steps

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link PostgreSQL
railway add postgres

# Link Redis
railway add redis

# Add environment variables
railway variables set DATABASE_URL=...
railway variables set JWT_SECRET=...

# Deploy
railway up

# View logs
railway logs
```

### Configuration

Create `railway.json`:

```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "restartPolicyType": "on_failure",
    "numReplicas": 2,
    "startCommand": "node apps/backend/dist/main.js"
  }
}
```

---

## Fly.io

Fly.io provides $5 monthly free credits and generous free tier.

### Deployment Steps

```bash
# Install Fly CLI
curl https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch
flyctl launch

# Set secrets
flyctl secrets set DATABASE_URL=...
flyctl secrets set JWT_SECRET=...

# Deploy
flyctl deploy
```

### Configuration

Create `fly.toml`:

```toml
app = "freelance-marketplace"
primary_region = "us-west"

[env]
NODE_ENV = "production"

[processes]
app = "node apps/backend/dist/main.js"
web = "node apps/frontend/server.js"

[[services]]
internal_port = 3000
protocol = "tcp"

[[services]]
internal_port = 3001
protocol = "tcp"

[checks.http]
grace_period = "5s"
interval = "30s"
method = "get"
path = "/health"
protocol = "http"
timeout = "5s"
type = "http"
```

---

## Vercel/Netlify

For frontend-only deployment:

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/frontend
vercel

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd apps/frontend
netlify deploy --prod --dir=.next

# Set environment variables in Netlify dashboard
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Database Migrations

### Create Migration

```bash
pnpm db:migrate create --name migration_name
```

### Apply Migrations

```bash
pnpm db:push
```

### Rollback

```bash
pnpm db:migrate resolve --rolled-back migration_name
```

---

## Monitoring & Observability

### Metrics Collection

```bash
# View Prometheus targets
http://localhost:9090/targets

# Query metrics
http://localhost:9090/api/v1/query?query=http_requests_total
```

### Logging with Loki

```bash
# Query logs in Grafana
- Go to Grafana
- Explore > Loki
- Write queries like: {job="backend"}
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Frontend health
curl http://localhost:3001/health
```

---

## SSL/TLS Configuration

### Development

Self-signed certificates:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

### Production

Using Let's Encrypt with Kubernetes:

```bash
# Install cert-manager
helm install cert-manager jetstack/cert-manager --create-namespace --namespace cert-manager --set installCRDs=true

# Create ClusterIssuer
kubectl apply -f kubernetes/manifests/cert-issuer.yaml
```

---

## CI/CD Pipeline

GitHub Actions workflows are configured in `.github/workflows/`:

- `ci.yml` - Linting, type checking, tests
- `cd.yml` - Build and push Docker images
- `tests.yml` - Run test suite

Trigger with:

```bash
git push origin main
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL
docker exec postgres psql -U postgres -c "\l"

# Test connection
psql postgresql://user:pass@host/db
```

### Port Already in Use

```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Docker Issues

```bash
# Rebuild without cache
docker-compose build --no-cache

# Clean volumes
docker-compose down -v
```

### Kubernetes Issues

```bash
# Check pod status
kubectl describe pod <pod-name> -n production

# View logs
kubectl logs <pod-name> -n production

# Get events
kubectl get events -n production --sort-by='.lastTimestamp'
```

---

## Performance Optimization

### Database

- Enable query indexing
- Configure connection pooling
- Set up read replicas

### Application

- Enable caching
- Optimize images
- Use CDN for static assets

### Infrastructure

- Configure HPA for auto-scaling
- Enable compression
- Setup load balancing

---

## Backup & Recovery

### Database Backup

```bash
# Backup
pg_dump postgresql://user:pass@host/db > backup.sql

# Restore
psql postgresql://user:pass@host/db < backup.sql
```

### Kubernetes PVC Backup

```bash
# Create snapshot
kubectl exec postgres-0 -n production -- pg_dump -U postgres marketplace > backup.sql
```

---

## Security Checklist

- [ ] SSL/TLS enabled
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Secrets management in place
- [ ] Regular security updates
- [ ] Monitoring and alerting active
- [ ] API keys rotated
- [ ] Database encrypted

---

For more information, see the main [README.md](../README.md).
