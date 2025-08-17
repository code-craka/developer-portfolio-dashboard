# Production Deployment Guide

This guide covers deploying the Developer Portfolio Dashboard to production with optimal performance and security.

## Pre-Deployment Checklist

### 1. Environment Configuration

Copy `.env.production` to `.env.local` and configure:

```bash
# Required Production Variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://user:pass@production-host/db?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key
CLERK_SECRET_KEY=sk_live_your_key
CLERK_WEBHOOK_SECRET=whsec_your_secret

# Security (Generate secure random strings)
SESSION_SECRET=your_32_character_session_secret
ENCRYPTION_KEY=your_32_character_encryption_key

# Performance
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_MONITORING=true
```

### 2. Database Setup

1. Create production database in NeonDB
2. Run database initialization:
   ```bash
   npm run init-db
   ```
3. Verify database health:
   ```bash
   curl https://your-domain.com/api/health/db
   ```

### 3. Pre-Deployment Validation

Run the deployment readiness check:

```bash
npm run deploy:check
```

This validates:
- Environment variables
- Database connectivity
- File system permissions
- Security configuration
- Performance optimizations

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment Variables:**
   ```bash
   vercel env add NODE_ENV
   vercel env add DATABASE_URL
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   # ... add all production variables
   ```

3. **Deploy:**
   ```bash
   npm run deploy:prepare
   vercel --prod
   ```

4. **Configure Custom Domain:**
   ```bash
   vercel domains add your-domain.com
   ```

### Option 2: Docker Deployment

1. **Build Docker Image:**
   ```bash
   docker build -t portfolio-dashboard .
   ```

2. **Run Container:**
   ```bash
   docker run -d \
     --name portfolio-dashboard \
     -p 3000:3000 \
     --env-file .env.local \
     portfolio-dashboard
   ```

3. **With Docker Compose:**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env.local
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   ```

### Option 3: Traditional VPS

1. **Server Requirements:**
   - Node.js 18+
   - PM2 for process management
   - Nginx for reverse proxy
   - SSL certificate

2. **Build and Deploy:**
   ```bash
   npm run build:production
   pm2 start ecosystem.config.js
   ```

## Performance Optimization

### 1. CDN Configuration

Configure CDN for static assets:

```javascript
// next.config.js
const nextConfig = {
  assetPrefix: process.env.CDN_URL || '',
  // ... other config
}
```

### 2. Caching Strategy

The application implements multi-layer caching:

- **Browser Cache:** Static assets (1 year)
- **CDN Cache:** API responses (5 minutes)
- **Application Cache:** Database queries (5-15 minutes)

### 3. Bundle Analysis

Analyze bundle size:

```bash
npm run analyze
```

Monitor bundle size and optimize imports as needed.

## Security Configuration

### 1. Security Headers

Configured in `vercel.json` and `next.config.js`:

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)

### 2. Rate Limiting

API routes are protected with rate limiting:

- Public endpoints: 60 requests/15 minutes
- Admin endpoints: 100 requests/15 minutes

### 3. Authentication

Clerk handles authentication with:

- Session management
- CSRF protection
- Secure cookie handling
- Multi-factor authentication support

## Monitoring and Observability

### 1. Health Checks

Monitor application health:

```bash
# Basic health check
curl https://your-domain.com/api/health

# Database-specific health
curl https://your-domain.com/api/health/db
```

### 2. Performance Monitoring

Enable performance monitoring in production:

```bash
ENABLE_PERFORMANCE_MONITORING=true
```

Access metrics via health endpoint or integrate with monitoring services.

### 3. Error Tracking

Errors are logged and can be integrated with services like:

- Sentry
- LogRocket
- DataDog
- New Relic

## Database Management

### 1. Connection Pooling

Production database uses connection pooling:

- Max connections: 20
- Connection timeout: 30s
- Idle timeout: 5 minutes

### 2. Backup Strategy

Implement regular backups:

```bash
# Daily backup script
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### 3. Migration Management

Run migrations safely:

```bash
npm run init-db  # Creates tables if not exist
```

## SSL/TLS Configuration

### 1. Certificate Management

For Vercel: Automatic SSL certificates
For custom deployment: Use Let's Encrypt

### 2. HTTPS Enforcement

Configured in `next.config.js` and deployment platform.

## Scaling Considerations

### 1. Horizontal Scaling

The application is stateless and can be scaled horizontally:

- Load balancer configuration
- Session storage (Redis for multi-instance)
- File storage (S3 for multi-instance)

### 2. Database Scaling

NeonDB provides:

- Read replicas
- Connection pooling
- Automatic scaling

### 3. CDN Integration

Configure CDN for:

- Static assets
- Image optimization
- Global distribution

## Troubleshooting

### Common Issues

1. **Database Connection Errors:**
   ```bash
   # Check database URL format
   echo $DATABASE_URL
   
   # Test connection
   npm run deploy:check
   ```

2. **Build Failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build:production
   ```

3. **Environment Variable Issues:**
   ```bash
   # Verify all required variables
   npm run deploy:check
   ```

### Performance Issues

1. **Slow API Responses:**
   - Check database query performance
   - Verify caching is enabled
   - Monitor connection pool usage

2. **High Memory Usage:**
   - Check for memory leaks
   - Monitor cache size
   - Review image optimization

### Security Issues

1. **Authentication Problems:**
   - Verify Clerk configuration
   - Check webhook endpoints
   - Validate environment variables

2. **CORS Errors:**
   - Update allowed origins
   - Check security headers
   - Verify domain configuration

## Maintenance

### Regular Tasks

1. **Weekly:**
   - Review error logs
   - Check performance metrics
   - Update dependencies

2. **Monthly:**
   - Security audit
   - Database optimization
   - Backup verification

3. **Quarterly:**
   - Dependency updates
   - Security review
   - Performance optimization

### Monitoring Alerts

Set up alerts for:

- High error rates (>5%)
- Slow response times (>2s)
- Database connection failures
- Memory usage (>80%)
- Disk space (>85%)

## Support and Documentation

- **Health Check:** `https://your-domain.com/api/health`
- **API Documentation:** `/docs/API_DOCUMENTATION.md`
- **Architecture:** `/docs/ROOT_LAYOUT_ARCHITECTURE.md`
- **Security:** `/docs/ERROR_HANDLING_GUIDE.md`

For additional support, check the project documentation and issue tracker.