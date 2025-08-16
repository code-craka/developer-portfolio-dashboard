# Deployment Guide

This guide covers deploying the Developer Portfolio Dashboard to production environments.

## Current Implementation Status

**✅ Ready for Production:**
- Backend API with full project CRUD operations
- Admin authentication with Clerk
- Database layer with NeonDB PostgreSQL
- Image upload system with file management
- Security middleware and rate limiting

**🚧 Frontend Development:**
- Admin dashboard UI (basic structure implemented)
- Public portfolio pages (planned)

## Overview

The backend application is production-ready and can be deployed on modern hosting platforms with the following requirements:
- Node.js 18+ runtime
- PostgreSQL database (NeonDB recommended)
- Environment variable support
- Static file serving capability

## Supported Platforms

### Vercel (Recommended)

Vercel provides optimal Next.js hosting with automatic deployments.

#### Setup Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from project root
   vercel
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   ```bash
   # Database
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   DATABASE_AUTHENTICATED_URL=postgresql://authenticated@hostname/database?sslmode=require
   NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL=postgresql://authenticated@hostname/database?sslmode=require
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
   CLERK_SECRET_KEY=sk_live_your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/login
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin/dashboard
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Application
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NODE_ENV=production
   
   # Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=public/uploads/projects
   
   # Security (Optional)
   RATE_LIMIT_API_REQUESTS_PER_MINUTE=100
   RATE_LIMIT_AUTH_ATTEMPTS_PER_15_MIN=5
   RATE_LIMIT_UPLOAD_REQUESTS_PER_MINUTE=10
   ```

3. **Build Configuration**
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "nextjs",
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     },
     "rewrites": [
       {
         "source": "/api/webhooks/clerk",
         "destination": "/api/webhooks/clerk"
       }
     ]
   }
   ```

### Netlify

#### Setup Steps

1. **Build Configuration**
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
   ```

2. **Environment Variables**
   Set the same environment variables as Vercel in Netlify dashboard.

### Railway

#### Setup Steps

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Railway will auto-detect Next.js and configure build settings

2. **Environment Variables**
   Set the same environment variables in Railway dashboard.

3. **Database Setup**
   - Railway provides PostgreSQL add-on
   - Or use external NeonDB instance

## Database Setup for Production

### NeonDB Production Setup

1. **Create Production Database**
   - Create a new NeonDB project for production
   - Use a different database than development
   - Enable connection pooling

2. **Initialize Production Database**
   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL="your_production_database_url"
   
   # Run initialization
   npm run init-db
   ```

3. **Verify Database Health**
   ```bash
   curl https://your-domain.com/api/health/db
   ```

## Clerk Authentication Setup

### Production Configuration

1. **Create Production Clerk Application**
   - Create a new Clerk application for production
   - Use different keys than development

2. **Configure Domains**
   - Add your production domain to Clerk dashboard
   - Set up proper redirect URLs

3. **Webhook Configuration**
   - Set webhook URL to: `https://your-domain.com/api/webhooks/clerk`
   - Configure webhook events: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret to environment variables

### Security Considerations

1. **Use Live Keys**
   - Replace test keys (`pk_test_`, `sk_test_`) with live keys (`pk_live_`, `sk_live_`)
   - Never commit live keys to version control

2. **Domain Restrictions**
   - Configure allowed domains in Clerk dashboard
   - Set up proper CORS policies

## File Upload Configuration

### Static File Serving

For production, consider using a CDN or cloud storage:

1. **Vercel**: Files are served from `/public` automatically
2. **AWS S3**: Configure S3 bucket for file uploads
3. **Cloudinary**: Use for image optimization and CDN

### Upload Directory Setup

Ensure upload directories exist:
```bash
mkdir -p public/uploads/projects
```

## Environment Variables Checklist

### Required Variables
- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `CLERK_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_APP_URL`

### Optional Variables
- [ ] `DATABASE_AUTHENTICATED_URL`
- [ ] `NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL`
- [ ] `MAX_FILE_SIZE`
- [ ] `UPLOAD_DIR`
- [ ] Rate limiting configurations

## Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif'],
     },
   }
   ```

2. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

### Database Optimization

1. **Connection Pooling**
   - NeonDB provides automatic connection pooling
   - Monitor connection usage in dashboard

2. **Query Optimization**
   - Use database indexes (automatically created by init script)
   - Monitor slow queries in production

### CDN Configuration

1. **Static Assets**
   - Use Vercel's built-in CDN
   - Or configure CloudFront for AWS deployments

2. **Image Optimization**
   - Next.js Image component provides automatic optimization
   - Consider Cloudinary for advanced image processing

## Monitoring and Logging

### Health Checks

Set up monitoring for:
- `/api/health/db` - Database connectivity
- Application uptime
- Response times

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance monitoring

### Database Monitoring

Monitor:
- Connection pool usage
- Query performance
- Database size and growth
- Index usage statistics

## Security Checklist

### Application Security
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Security headers configured (handled by middleware)
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] SQL injection prevention (parameterized queries)

### Authentication Security
- [ ] Live Clerk keys configured
- [ ] Webhook signature verification enabled
- [ ] Proper session management
- [ ] Admin route protection

### Database Security
- [ ] SSL connections enforced
- [ ] Strong database passwords
- [ ] Network access restrictions
- [ ] Regular security updates

## Backup and Recovery

### Database Backups
- NeonDB provides automatic backups
- Consider additional backup strategies for critical data
- Test backup restoration procedures

### Application Backups
- Source code in version control (Git)
- Environment variables documented
- Deployment configuration saved

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is accessible from deployment platform

3. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check domain configuration
   - Ensure webhook URL is accessible

4. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure static file serving is configured

### Performance Issues

1. **Slow Database Queries**
   - Check database indexes
   - Monitor connection pool usage
   - Review query performance in NeonDB dashboard

2. **High Response Times**
   - Enable compression
   - Optimize images
   - Use CDN for static assets

3. **Memory Issues**
   - Monitor application memory usage
   - Check for memory leaks
   - Optimize bundle size

## Maintenance

### Regular Tasks

1. **Security Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Update Clerk SDK regularly

2. **Database Maintenance**
   - Monitor database performance
   - Review and optimize queries
   - Clean up old data if necessary

3. **Performance Monitoring**
   - Review application metrics
   - Monitor error rates
   - Check user experience metrics

### Scaling Considerations

1. **Database Scaling**
   - NeonDB provides automatic scaling
   - Monitor connection limits
   - Consider read replicas for high traffic

2. **Application Scaling**
   - Vercel provides automatic scaling
   - Monitor function execution times
   - Consider edge deployment for global users

## Support and Resources

- **Next.js**: [Deployment Documentation](https://nextjs.org/docs/deployment)
- **Vercel**: [Deployment Guide](https://vercel.com/docs)
- **NeonDB**: [Production Guide](https://neon.tech/docs/guides/production)
- **Clerk**: [Production Checklist](https://clerk.com/docs/deployments/production)