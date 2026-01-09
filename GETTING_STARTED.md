# Getting Started Guide

Welcome to the Freelance Marketplace! This guide will help you get up and running quickly.

## Prerequisites

Choose your setup method:

### Option 1: Docker Compose (Recommended for Quick Start)

**Requirements:**
- Docker & Docker Compose 20.10+
- 4GB+ free disk space
- No port conflicts on 3000-3100

### Option 2: Local Development

**Requirements:**
- Node.js 20+ ([Download](https://nodejs.org))
- pnpm 8+ (`npm install -g pnpm`)
- PostgreSQL 16+ ([Download](https://postgresql.org/download))
- Redis 7+ ([Download](https://redis.io/download))

---

## Quick Start (Recommended)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/freelance-marketplace.git
cd freelance-marketplace
```

### 2. Setup with Docker Compose

```bash
# Copy environment file
cp .env.example .env.local

# Start all services
docker-compose up -d

# Watch logs
docker-compose logs -f
```

### 3. Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3001 | N/A |
| Backend API | http://localhost:3000 | N/A |
| API Docs | http://localhost:3000/api/docs | N/A |
| Grafana | http://localhost:3002 | admin / admin |
| Prometheus | http://localhost:9090 | N/A |

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec backend pnpm db:push

# Seed sample data (optional)
docker-compose exec backend pnpm db:seed
```

### 5. Create Test Account

Go to http://localhost:3001 and:
1. Click "Sign Up"
2. Create account with test credentials
3. Explore the marketplace!

---

## Local Development Setup

### 1. Install Dependencies

```bash
# Install Node.js packages
pnpm install

# Verify installation
pnpm --version  # Should be 8+
node --version  # Should be 20+
```

### 2. Setup Environment

```bash
# Copy and edit environment file
cp .env.example .env.local

# Edit with your database credentials
nano .env.local
```

Edit the following in `.env.local`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marketplace
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
```

### 3. Start Databases

```bash
# PostgreSQL
createdb marketplace
# or with Docker:
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 4. Setup Database Schema

```bash
# Run Prisma migrations
pnpm db:push

# Seed database with test data
pnpm db:seed

# Open Prisma Studio to view data
pnpm db:studio
```

### 5. Start Development Servers

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
pnpm dev --filter=backend
# Available at http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev --filter=frontend
# Available at http://localhost:3001
```

**Terminal 3 - Other tasks:**
```bash
# Run linter
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test
```

---

## Project Structure Quick Reference

```
freelance-marketplace/
├── apps/
│   ├── frontend/     # Next.js app - /login, /jobs, /dashboard
│   ├── backend/      # NestJS API - /api, /health
│   └── docs/         # Documentation site
├── packages/
│   ├── db/           # Prisma schema & migrations
│   ├── ui/           # Shared components
│   └── common/       # Shared utilities
└── kubernetes/       # Deployment configs
```

## Key Commands

### Development
```bash
pnpm dev              # Start all dev servers
pnpm dev --filter=backend    # Start backend only
pnpm dev --filter=frontend   # Start frontend only
```

### Building
```bash
pnpm build            # Build all apps
pnpm build --filter=backend
```

### Database
```bash
pnpm db:push          # Push schema changes
pnpm db:migrate       # Create migration
pnpm db:seed          # Seed test data
pnpm db:studio        # Open Prisma Studio (GUI)
```

### Testing
```bash
pnpm test             # Run unit tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # E2E tests
```

### Linting & Type Checking
```bash
pnpm lint             # ESLint check
pnpm type-check       # TypeScript check
pnpm format           # Format code
```

### Docker
```bash
docker-compose up -d       # Start dev stack
docker-compose down        # Stop dev stack
docker-compose logs -f     # View logs
docker-compose ps          # View services
```

---

## First Steps in the App

### As a Freelancer

1. **Sign Up**
   - Go to http://localhost:3001/auth/signup
   - Create account

2. **Complete Profile**
   - Navigate to Dashboard
   - Add profile information

3. **Browse Jobs**
   - Go to "Jobs" section
   - Search and filter opportunities
   - Click "View Details" on a job

4. **Submit Bid**
   - On job details page
   - Click "Submit a Bid"
   - Fill in bid amount and timeline
   - Submit!

### As a Client

1. **Sign Up**
   - Go to http://localhost:3001/auth/signup
   - Create account

2. **Post a Job**
   - Navigate to Dashboard
   - Click "Post New Job"
   - Fill in job details:
     - Title
     - Description
     - Budget
     - Skills required

3. **Review Bids**
   - Your job will appear in marketplace
   - Freelancers will submit bids
   - Review and compare bids

4. **Create Contract**
   - Select winning bid
   - Create contract
   - Start project!

---

## Troubleshooting

### "Port already in use"

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env.local
BACKEND_PORT=3000
```

### "Database connection failed"

```bash
# Check PostgreSQL is running
psql postgres

# Check DATABASE_URL in .env.local
echo $DATABASE_URL

# Verify schema
pnpm db:push
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear cache
pnpm turbo clean
pnpm build
```

### "Docker container exiting"

```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild
docker-compose build --no-cache

# Restart
docker-compose restart
```

---

## IDE Setup

### VS Code

1. **Install Extensions:**
   - ESLint
   - Prettier
   - TypeScript
   - Prisma
   - Thunder Client (API testing)

2. **Settings (.vscode/settings.json):**
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "[typescript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
   }
   ```

3. **Recommended Packages:**
   - REST Client
   - GraphQL (if using GraphQL)
   - Docker

---

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Commit Changes

```bash
git add .
git commit -m "feat: add my feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

### Push and PR

```bash
git push origin feature/my-feature
# Create PR on GitHub
```

---

## Next Steps

1. ✅ **Setup complete!**
2. 📖 Read the [README.md](README.md) for architecture overview
3. 🏗️ Check [PROJECT_INDEX.md](PROJECT_INDEX.md) for file navigation
4. 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
5. 📚 Explore the codebase:
   - Frontend: [apps/frontend/src](apps/frontend/src)
   - Backend: [apps/backend/src](apps/backend/src)
   - Database: [packages/db/prisma](packages/db/prisma)

---

## Common Development Tasks

### Add a New Page

```bash
# Frontend
touch apps/frontend/src/app/page-name/page.tsx

# Add content using the existing structure
# Reference: apps/frontend/src/app/marketplace/jobs/page.tsx
```

### Create a New API Endpoint

```bash
# Backend
touch apps/backend/src/feature/feature.controller.ts
touch apps/backend/src/feature/feature.service.ts
touch apps/backend/src/feature/feature.module.ts

# Add to src/app.module.ts imports
```

### Add Database Migration

```bash
# Create migration
pnpm db:migrate create --name feature_name

# Apply migration
pnpm db:push
```

---

## Useful Resources

- **Documentation:** [README.md](README.md)
- **Project Index:** [PROJECT_INDEX.md](PROJECT_INDEX.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Kubernetes:** [kubernetes/README.md](kubernetes/README.md)
- **API Docs:** http://localhost:3000/api/docs (when running)
- **Prisma Docs:** https://www.prisma.io/docs/

---

## Getting Help

1. **Check existing issues:** GitHub Issues
2. **Search documentation:** [README.md](README.md) sections
3. **View logs:** `docker-compose logs service-name`
4. **Debug locally:** Use VS Code debugger
5. **Ask questions:** Create a discussion

---

## Success Criteria

You've successfully set up when you can:

- ✅ Access frontend at http://localhost:3001
- ✅ Access backend at http://localhost:3000
- ✅ Create a user account
- ✅ View jobs in the marketplace
- ✅ Submit a bid on a job
- ✅ See logs in Grafana (http://localhost:3002)
- ✅ Run `pnpm test` successfully
- ✅ Make a code change and see hot reload

---

**Happy coding! 🚀**

Questions? Check the [README.md](README.md) or create an issue on GitHub.
