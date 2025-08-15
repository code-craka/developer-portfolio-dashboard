# Deployment Guide

This guide covers deploying the Developer Portfolio Dashboard to various platforms.

## Prerequisites

Before deploying, ensure you have:
- NeonDB PostgreSQL database set up
- Clerk authentication configured
- All environment variables ready
- Project built and tested locally

## Environment Variables

Set up these environment variables in your deployment platform:

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin/dashboard
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables
```bash
# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=public/uploads/projects

# Rate Limiting
RATE_LIMIT_API_REQUESTS_PER_MINUTE=100
RATE_LIMIT_AUTH_ATTEMPTS_PER_15_MIN=5
RATE_LIMIT_UPLOAD_REQUESTS_PER_MINUTE=10
```

## Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications.

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure project settings

### 2. Environment Variables

Add all required environment variables in the Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add each variable for Production, Preview, and Development

### 3. Build Configuration

Vercel automatically detects Next.js projects. No additional configuration needed.

### 4. Database Initialization

After deployment, initialize the database:

```bash
# Using Vercel CLI
vercel env pull .env.local
npm run init-db
```

Or create a one-time serverless function to initialize the database.

### 5. Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6. Clerk Webhook Setup

1. In Clerk Dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret to environment variables

## Netlify Deployment

### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Environment Variables

Set environment variables in Netlify dashboard:
- Go to Site Settings → Environment Variables
- Add all required variables

### 3. Database Initialization

Use Netlify Functions or run initialization script manually:

```bash
netlify env:import .env.local
npm run init-db
```

## Railway Deployment

### 1. Connect Repository

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Connect your GitHub repository

### 2. Environment Variables

Add environment variables in Railway dashboard:
- Go to your project → Variables tab
- Add all required variables

### 3. Database Setup

Railway can provide PostgreSQL database:
1. Add PostgreSQL service to your project
2. Use the provided DATABASE_URL
3. Run initialization after deployment

### 4. Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NODE_ENV=production
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=portfolio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 3. Build and Run

```bash
# Build the image
docker build -t portfolio-dashboard .

# Run with docker-compose
docker-compose up -d

# Initialize database
docker-compose exec app npm run init-db
```

## AWS Deployment

### Using AWS Amplify

1. Connect your Git repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Set environment variables in Amplify console
4. Deploy and configure custom domain

### Using EC2 with PM2

1. Launch EC2 instance with Node.js
2. Clone repository and install dependencies
3. Set up PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 startup
   pm2 save
   ```
4. Configure Nginx as reverse proxy
5. Set up SSL with Let's Encrypt

## Database Considerations

### Production Database Setup

1. **NeonDB Production Instance**:
   - Use production-tier database
   - Enable connection pooling
   - Set up automated backups
   - Configure monitoring

2. **Connection Pooling**:
   - NeonDB handles connection pooling automatically
   - Monitor connection usage in dashboard
   - Adjust limits based on traffic

3. **Database Migrations**:
   - Run `npm run init-db` after deployment
   - Set up automated migration pipeline
   - Test migrations in staging environment

### Database Security

1. **Connection Security**:
   - Always use SSL connections
   - Restrict database access by IP if possible
   - Use strong passwords and rotate regularly

2. **Backup Strategy**:
   - NeonDB provides automated backups
   - Consider additional backup solutions for critical data
   - Test backup restoration procedures

## Performance Optimization

### 1. Next.js Optimizations

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
```

### 2. Database Optimizations

- Use database indexes effectively
- Implement query result caching
- Monitor slow queries
- Optimize JSONB queries

### 3. CDN Configuration

- Use Vercel's Edge Network (automatic)
- Configure custom CDN for static assets
- Optimize image delivery

## Monitoring and Logging

### 1. Application Monitoring

- Set up error tracking (Sentry, Bugsnag)
- Monitor performance metrics
- Set up uptime monitoring

### 2. Database Monitoring

- Monitor NeonDB dashboard
- Set up alerts for connection issues
- Track query performance

### 3. Logging

```javascript
// Production logging configuration
const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to external logging service
  },
  info: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`);
    }
  }
};
```

## Security Checklist

### Pre-Deployment Security

- [ ] All environment variables are secure
- [ ] Database connections use SSL
- [ ] Clerk authentication is properly configured
- [ ] Rate limiting is enabled
- [ ] File upload restrictions are in place
- [ ] CORS is configured for production domains
- [ ] Security headers are configured

### Post-Deployment Security

- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] Database access is restricted
- [ ] Monitoring is set up
- [ ] Backup procedures are tested
- [ ] Incident response plan is ready

## Troubleshooting

### Common Deployment Issues

1. **Database Connection Errors**:
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure SSL is enabled

2. **Authentication Issues**:
   - Verify Clerk keys are correct
   - Check webhook configuration
   - Ensure URLs match deployment domain

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Performance Issues**:
   - Monitor database query performance
   - Check connection pool usage
   - Review application metrics

### Health Checks

Use the built-in health check endpoints:

```bash
# Check database health
curl https://your-domain.com/api/health/db

# Check application health
curl https://your-domain.com/api/health
```

## Rollback Procedures

### Quick Rollback

1. **Vercel**: Use deployment history to rollback
2. **Netlify**: Rollback to previous deploy
3. **Docker**: Switch to previous image tag
4. **Manual**: Keep previous version ready

### Database Rollback

1. Use NeonDB point-in-time recovery
2. Restore from backup if needed
3. Run migration rollback scripts
4. Verify data integrity

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**:
   - Review application logs
   - Check database performance
   - Monitor error rates

2. **Monthly**:
   - Update dependencies
   - Review security settings
   - Test backup procedures

3. **Quarterly**:
   - Security audit
   - Performance optimization
   - Disaster recovery testing

### Getting Help

- Check application logs first
- Use health check endpoints
- Review database metrics
- Consult platform-specific documentation
- Contact support if needed