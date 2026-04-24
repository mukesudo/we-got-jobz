# Production Deployment Guide - Free Tier Services

## Overview
This document provides a comprehensive deployment layout for the We Got Jobz marketplace using free tier services. The architecture is designed to be production-ready while minimizing costs during the initial launch phase.

---

## Recommended Free Tier Stack

### Option 1: Vercel + Railway (Recommended)
**Total Monthly Cost**: ~$0-25 (depending on usage)
- **Frontend**: Vercel (Free tier - 100GB bandwidth)
- **Backend**: Railway (Free tier - 512MB RAM, $5/month for Hobby)
- **Database**: Railway PostgreSQL (Free tier - 1GB)
- **Redis**: Railway Redis (Free tier - 25MB)
- **File Storage**: Cloudflare R2 (Free tier - 10GB storage, 1M Class A operations)
- **Email**: Resend (Free tier - 3,000 emails/month)
- **Monitoring**: Vercel Analytics + Railway Logs
- **CI/CD**: GitHub Actions (Free)

### Option 2: Vercel + Supabase
**Total Monthly Cost**: ~$0
- **Frontend**: Vercel (Free tier)
- **Backend**: Vercel Serverless Functions (Free tier)
- **Database**: Supabase (Free tier - 500MB)
- **Auth**: Supabase Auth (Free tier)
- **Real-time**: Supabase Realtime (Free tier)
- **File Storage**: Supabase Storage (Free tier - 1GB)
- **Email**: Supabase Email (Free tier - limited)
- **Monitoring**: Vercel Analytics + Supabase Logs

### Option 3: Fly.io + Neon
**Total Monthly Cost**: ~$0-5
- **Frontend**: Fly.io (Free tier - 3 VMs, 256MB RAM each)
- **Backend**: Fly.io (Free tier)
- **Database**: Neon PostgreSQL (Free tier - 0.5GB, 1 compute-hour/day)
- **Redis**: Upstash Redis (Free tier - 10,000 commands/day)
- **File Storage**: Fly.io Volumes or Cloudflare R2
- **Email**: Resend (Free tier)
- **Monitoring**: Fly.io Metrics + Grafana Cloud (Free tier)

---

## Detailed Deployment Architecture (Option 1: Vercel + Railway)

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                      Users                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel (Frontend)                           │
│  - Next.js 15 Application                               │
│  - Static Assets & Serverless Functions                 │
│  - CDN & Edge Caching                                   │
│  - Vercel Analytics                                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Railway (Backend API)                          │
│  - NestJS Application                                    │
│  - 512MB RAM / 1 vCPU (Hobby plan $5/mo)               │
│  - Auto-scaling available                               │
│  - Built-in monitoring                                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│  Railway PG   │         │  Railway Redis│
│  PostgreSQL   │         │    Cache      │
│  1GB Storage  │         │   25MB        │
└───────────────┘         └──────────────┘
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│ Cloudflare R2 │         │   Resend     │
│ File Storage  │         │   Email      │
│ 10GB Storage  │         │  3K emails   │
└───────────────┘         └──────────────┘
```

---

## Step-by-Step Deployment Guide

### Phase 1: Prepare Environment Variables

#### 1. Create `.env.production` file
```bash
# Database
DATABASE_URL=postgresql://user:password@host.railway.app:5432/database
REDIS_URL=redis://host.redislabs.com:port

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-domain.com

# Application
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-domain.com
BACKEND_URL=https://your-backend.railway.app

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
CLOUDFLARE_R2_ACCOUNT_ID=...

# Monitoring
VERCEL_ANALYTICS_ID=...
```

#### 2. Add to `.gitignore`
```bash
.env.production
.env.local
```

---

### Phase 2: Deploy Backend to Railway

#### 1. Create Railway Account
- Sign up at [railway.app](https://railway.app)
- Connect GitHub repository

#### 2. Create PostgreSQL Database
```bash
# In Railway dashboard:
1. Click "New Project" → "Provision a Database"
2. Select PostgreSQL
3. Choose Free tier (1GB storage)
4. Copy DATABASE_URL from variables tab
```

#### 3. Create Redis Instance
```bash
# In Railway dashboard:
1. Click "New Project" → "Provision a Database"
2. Select Redis
3. Choose Free tier (25MB)
4. Copy REDIS_URL from variables tab
```

#### 4. Deploy Backend Application
```bash
# In Railway dashboard:
1. Click "New Project" → "Deploy from GitHub repo"
2. Select we-got-jobz repository
3. Set root directory to `apps/backend`
4. Add environment variables from Phase 1
5. Select Hobby plan ($5/month) for better performance
6. Click "Deploy"
```

#### 5. Configure Health Check
```bash
# In Railway settings for backend:
1. Add health check: GET /health
2. Set interval: 30s
3. Set timeout: 10s
4. Set restart policy: always
```

---

### Phase 3: Deploy Frontend to Vercel

#### 1. Create Vercel Account
- Sign up at [vercel.com](https://vercel.com)
- Connect GitHub repository

#### 2. Import Project
```bash
# In Vercel dashboard:
1. Click "Add New Project"
2. Select we-got-jobz repository
3. Set root directory to `apps/frontend`
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: pnpm build
   - Output Directory: .next
```

#### 3. Configure Environment Variables
```bash
# In Vercel project settings:
1. Go to Settings → Environment Variables
2. Add all variables from Phase 1
3. Select applicable environments (Production, Preview, Development)
```

#### 4. Configure Domain
```bash
# In Vercel project settings:
1. Go to Settings → Domains
2. Add custom domain (e.g., we-got-jobz.com)
3. Configure DNS records
4. Enable automatic HTTPS
```

#### 5. Deploy
```bash
# Vercel will automatically deploy on:
- Every push to main branch
- Every pull request (preview deployment)
```

---

### Phase 4: Set Up File Storage (Cloudflare R2)

#### 1. Create Cloudflare Account
- Sign up at [cloudflare.com](https://cloudflare.com)
- Go to R2 section

#### 2. Create Bucket
```bash
# In Cloudflare dashboard:
1. Go to R2 → Create Bucket
2. Name: we-got-jobz-uploads
3. Select location (auto)
4. Create bucket
```

#### 3. Generate API Token
```bash
# In Cloudflare dashboard:
1. Go to R2 → Manage R2 API Tokens
2. Create API Token
3. Copy Access Key ID and Secret Access Key
4. Add to environment variables
```

#### 4. Configure CORS (if needed)
```bash
# In Cloudflare dashboard:
1. Go to R2 → Bucket → Settings
2. Add CORS rule for your domain
3. Allow GET, PUT, DELETE methods
```

---

### Phase 5: Set Up Email Service (Resend)

#### 1. Create Resend Account
- Sign up at [resend.com](https://resend.com)
- Verify email domain

#### 2. Get API Key
```bash
# In Resend dashboard:
1. Go to API Keys
2. Create new API key
3. Copy key
4. Add to environment variables
```

#### 3. Verify Domain
```bash
# In Resend dashboard:
1. Go to Domains
2. Add your domain (e.g., we-got-jobz.com)
3. Add DNS records (TXT, CNAME)
4. Wait for verification
```

---

### Phase 6: Set Up Stripe Integration

#### 1. Create Stripe Account
- Sign up at [stripe.com](https://stripe.com)
- Complete business verification

#### 2. Get API Keys
```bash
# In Stripe dashboard:
1. Go to Developers → API Keys
2. Copy Publishable key (for frontend)
3. Copy Secret key (for backend)
4. Add to environment variables
```

#### 3. Configure Webhooks
```bash
# In Stripe dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: https://your-backend.railway.app/webhooks/stripe
3. Select events to listen for
4. Copy webhook secret
5. Add to environment variables
```

---

### Phase 7: Configure Monitoring

#### 1. Vercel Analytics (Already configured)
- Automatic page views tracking
- Web vitals monitoring
- User analytics

#### 2. Railway Monitoring
```bash
# In Railway dashboard:
1. View logs in real-time
2. Monitor CPU/RAM usage
3. Set up alerts for failures
4. Track request metrics
```

#### 3. Error Tracking (Optional - Sentry)
```bash
# If using Sentry:
1. Create Sentry account
2. Create new project
3. Add Sentry SDK to backend
4. Add DSN to environment variables
```

---

### Phase 8: Configure DNS

#### 1. Point Domain to Vercel
```bash
# In your DNS provider (e.g., Cloudflare, Namecheap):
# Add A record:
@ → 76.76.21.21 (Vercel)
www → 76.76.21.21 (Vercel)

# Or use CNAME:
www → cname.vercel-dns.com
```

#### 2. Configure Subdomains (Optional)
```bash
# API subdomain:
api → your-backend.railway.app

# Storage subdomain:
cdn → your-r2-bucket.r2.dev
```

---

## Alternative Deployment Options

### Option 2: Supabase Deployment (All-in-One)

#### Advantages
- Single platform for database, auth, storage, real-time
- Built-in row-level security
- Real-time subscriptions
- Free tier generous (500MB DB, 1GB storage)
- No backend server needed (can use serverless functions)

#### Deployment Steps
```bash
# 1. Create Supabase project
# 2. Set up database schema using Prisma
# 3. Configure authentication
# 4. Set up storage buckets
# 5. Deploy frontend to Vercel
# 6. Connect frontend to Supabase
# 7. Use Supabase Edge Functions for backend logic
```

#### Limitations
- Less control over backend logic
- Vendor lock-in
- Limited customization
- Edge functions have cold starts

---

### Option 3: Fly.io Deployment (Full Control)

#### Advantages
- Full control over infrastructure
- Persistent volumes available
- Global edge deployment
- Built-in monitoring
- Free tier generous (3 VMs)

#### Deployment Steps
```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Launch backend
fly launch --apps/backend --region iad
fly deploy

# 4. Launch frontend
fly launch --apps/frontend --region iad
fly deploy

# 5. Create PostgreSQL
fly postgres create
fly postgres attach

# 6. Create Redis
fly redis create
fly redis attach

# 7. Scale to free tier
fly scale count 1
fly scale vm shared-cpu-1x --memory 256
```

---

## Cost Breakdown (Option 1: Vercel + Railway)

### Monthly Costs
- **Vercel**: $0 (Free tier)
  - 100GB bandwidth
  - Unlimited deployments
  - SSL certificates
  - Edge functions
  
- **Railway Backend**: $5 (Hobby plan)
  - 512MB RAM
  - 1 vCPU
  - 10GB bandwidth
  
- **Railway PostgreSQL**: $0 (Free tier)
  - 1GB storage
  - 10GB bandwidth
  
- **Railway Redis**: $0 (Free tier)
  - 25MB storage
  - 10GB bandwidth
  
- **Cloudflare R2**: $0 (Free tier)
  - 10GB storage
  - 1M Class A operations/month
  
- **Resend**: $0 (Free tier)
  - 3,000 emails/month
  
- **Stripe**: Transaction fees only
  - 2.9% + 30¢ per transaction

### Total: ~$5/month minimum

### Scaling Costs (When needed)
- Railway Backend scaling: $10-20/month for higher tiers
- Railway PostgreSQL: $7-15/month for larger storage
- Railway Redis: $5-10/month for larger cache
- Vercel Pro: $20/month for more bandwidth and features

---

## CI/CD Configuration Updates

### Update `.github/workflows/cd.yml` for Railway/Vercel
```yaml
name: CD - Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./apps/frontend
        vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Railway CLI
      run: npm install -g @railway/cli
    
    - name: Deploy to Railway
      run: railway deploy --service
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Security Checklist

### Before Production Launch
- [ ] All environment variables set
- [ ] HTTPS enabled on all domains
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention implemented
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Password hashing implemented
- [ ] JWT secrets secured
- [ ] Database backups enabled
- [ ] Error tracking configured
- [ ] Log aggregation set up
- [ ] Monitoring alerts configured
- [ ] SSL certificates valid
- [ ] API keys rotated regularly
- [ ] Dependencies updated
- [ ] Security audit completed

---

## Performance Optimization

### Frontend (Vercel)
- Enable image optimization
- Configure caching headers
- Use edge functions for API routes
- Implement code splitting
- Enable compression
- Use CDN for static assets

### Backend (Railway)
- Implement Redis caching
- Use connection pooling
- Optimize database queries
- Enable query caching
- Implement rate limiting
- Use background job processing
- Monitor performance metrics

### Database (Railway PostgreSQL)
- Add proper indexes
- Optimize slow queries
- Use read replicas (if scaling)
- Implement connection pooling
- Enable query caching
- Monitor database metrics

---

## Monitoring & Alerts

### Key Metrics to Monitor
- Response time
- Error rate
- Request rate
- CPU usage
- Memory usage
- Database connections
- Cache hit rate
- Disk usage
- Bandwidth usage

### Alert Thresholds
- Response time > 2s
- Error rate > 5%
- CPU usage > 80%
- Memory usage > 85%
- Database connections > 80% of pool
- Disk usage > 90%

---

## Backup Strategy

### Database Backups
- Enable automatic daily backups (Railway)
- Export weekly backups to local storage
- Test restore procedure monthly
- Keep backups for 30 days

### Code Backups
- GitHub repository (automatic)
- Branch protection for main
- Tag releases
- Document deployment versions

---

## Scaling Strategy

### When to Scale
- CPU usage consistently > 70%
- Memory usage consistently > 80%
- Response time > 2s
- Error rate increasing
- User growth > 1000 concurrent users

### Scaling Options
- Upgrade Railway plan ($10-20/month)
- Add Redis cluster
- Add database read replica
- Implement CDN for static assets
- Move to managed Kubernetes (AWS EKS, GKE)
- Consider dedicated server

---

## Rollback Plan

### If Deployment Fails
1. Revert to previous commit
2. Railway automatically redeploys last successful build
3. Vercel automatically reverts to last successful deployment
4. Check logs for errors
5. Fix issues and redeploy

### Database Migration Issues
1. Have rollback migration ready
2. Test migrations on staging first
3. Backup database before migration
4. Use transaction for migration
5. Monitor migration progress

---

## Post-Deployment Checklist

### Immediate (After Launch)
- [ ] Verify all services running
- [ ] Test authentication flow
- [ ] Test job posting
- [ ] Test bidding system
- [ ] Test payment flow (test mode)
- [ ] Test email notifications
- [ ] Verify monitoring working
- [ ] Check error logs
- [ ] Test backup restore
- [ ] Document deployment

### First Week
- [ ] Monitor performance metrics
- [ ] Check user feedback
- [ ] Review error logs daily
- [ ] Optimize slow queries
- [ ] Fix any bugs found
- [ ] Update documentation
- [ ] Train support team

### First Month
- [ ] Review costs
- [ ] Optimize infrastructure
- [ ] Implement missing features
- [ ] Scale if needed
- [ ] Security audit
- [ ] Performance audit
- [ ] User feedback survey

---

## Troubleshooting

### Common Issues

#### Railway Deployment Fails
```bash
# Check build logs
railway logs

# Restart service
railway restart

# Rebuild
railway up

# Check environment variables
railway variables
```

#### Vercel Deployment Fails
```bash
# Check build logs in Vercel dashboard
# Verify environment variables
# Check for build errors
# Verify next.config.js settings
```

#### Database Connection Issues
```bash
# Check DATABASE_URL format
# Verify database is running
# Check network connectivity
# Verify credentials
# Check connection pool size
```

#### Redis Connection Issues
```bash
# Check REDIS_URL format
# Verify Redis is running
# Check network connectivity
# Verify credentials
# Check memory limits
```

---

## Support Resources

### Official Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2)
- [Resend Docs](https://resend.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Community Support
- [Vercel Discord](https://vercel.com/discord)
- [Railway Discord](https://discord.gg/railway)
- [Stack Overflow](https://stackoverflow.com)

### Emergency Contacts
- Platform support tickets
- Database emergency restore
- Payment provider support

---

## Next Steps After Launch

### Week 1-2
- Monitor performance closely
- Fix critical bugs
- Gather user feedback
- Optimize slow queries

### Week 3-4
- Implement missing critical features
- Security audit
- Performance optimization
- Marketing push

### Month 2-3
- Scale infrastructure if needed
- Implement advanced features
- Analytics dashboard
- Mobile app development

---

**Last Updated**: April 24, 2026
**Status**: Ready for Production Deployment
**Recommended Stack**: Vercel + Railway (Option 1)
