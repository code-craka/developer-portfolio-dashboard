# Database Setup Guide

This guide covers the setup and configuration of the NeonDB PostgreSQL database for the Developer Portfolio Dashboard.

## Overview

The application uses NeonDB (PostgreSQL) as the primary database with the following features:
- **Connection Pooling**: Efficient connection management using NeonDB serverless driver
- **Type Safety**: Full TypeScript integration with proper interfaces
- **Migration System**: Automated table and index creation
- **Health Monitoring**: Built-in health checks and auto-repair functionality
- **CRUD Operations**: Comprehensive service classes for all data operations

## Database Schema

### Tables

1. **projects** - Portfolio projects
2. **experiences** - Work experience entries
3. **contacts** - Contact form submissions
4. **admins** - Admin users (integrated with Clerk)

### Key Features

- **JSONB Support**: Tech stacks, achievements, and technologies stored as JSONB
- **Optimized Indexes**: Performance-optimized indexes for common queries
- **Timestamp Tracking**: Automatic created_at and updated_at timestamps
- **Constraint Validation**: Database-level validation for employment types

## Setup Instructions

### 1. Create NeonDB Database

1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

### 2. Environment Configuration

Create a `.env.local` file with your database URL:

```bash
# Database (NeonDB PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# Clerk Authentication (required for admin functionality)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin/dashboard
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

Run the database initialization script:

```bash
npm run init-db
```

This will:
- Create all required tables
- Set up optimized indexes
- Verify the setup
- Display database statistics

### 5. Verify Setup

Check database health:

```bash
curl http://localhost:3000/api/health/db
```

Or visit the health check endpoint in your browser after starting the dev server.

## Database Operations

### Connection Management

The database connection is managed through a singleton pattern:

```typescript
import { db } from '@/app/lib/db';

// Execute a query
const results = await db.query('SELECT * FROM projects');

// Test connection
const isConnected = await db.testConnection();
```

### Service Classes

Use the service classes for CRUD operations:

```typescript
import { ProjectService, ExperienceService, ContactService } from '@/app/lib/database-utils';

// Get all projects
const projects = await ProjectService.getAllProjects();

// Create a new project
const newProject = await ProjectService.createProject({
  title: 'My Project',
  description: 'Project description',
  techStack: ['React', 'TypeScript'],
  imageUrl: '/uploads/projects/image.jpg',
  featured: false
});

// Update a project
const updatedProject = await ProjectService.updateProject(1, {
  title: 'Updated Title'
});
```

### Migrations

Run migrations manually:

```typescript
import { DatabaseMigrations } from '@/app/lib/migrations';

// Create all tables and indexes
await DatabaseMigrations.runMigrations();

// Reset database (development only)
await DatabaseMigrations.resetDatabase();

// Check table existence
const tables = await DatabaseMigrations.checkTablesExist();
```

## Health Monitoring

### Health Check API

- **GET /api/health/db** - Check database health
- **POST /api/health/db** - Auto-repair database issues

### Health Check Response

```json
{
  "success": true,
  "health": {
    "connected": true,
    "tablesExist": {
      "projects": true,
      "experiences": true,
      "contacts": true,
      "admins": true
    },
    "indexesExist": true,
    "lastChecked": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Auto-Repair

The system can automatically repair common database issues:

```typescript
import { DatabaseHealth } from '@/app/lib/db-health';

const repair = await DatabaseHealth.autoRepair();
console.log(repair.message);
```

## Performance Optimization

### Indexes

The following indexes are automatically created for optimal performance:

**Projects Table:**
- `idx_projects_featured_created` - Featured projects with creation date
- `idx_projects_created` - Creation date ordering

**Experiences Table:**
- `idx_experiences_start_date` - Start date ordering
- `idx_experiences_end_date` - End date ordering (NULLS FIRST for current positions)

**Contacts Table:**
- `idx_contacts_created` - Creation date ordering
- `idx_contacts_read` - Read status filtering

**Admins Table:**
- `idx_admins_clerk_id` - Unique Clerk ID lookup
- `idx_admins_email` - Email lookup

### Query Optimization

- Use the service classes which include optimized queries
- JSONB fields are indexed for efficient filtering
- Connection pooling reduces connection overhead
- Prepared statements prevent SQL injection

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify DATABASE_URL is correct
   - Check network connectivity
   - Ensure NeonDB instance is running

2. **Tables Don't Exist**
   - Run `npm run init-db`
   - Check database permissions
   - Verify schema name (should be 'public')

3. **Performance Issues**
   - Check if indexes exist: `npm run init-db`
   - Monitor query performance in NeonDB dashboard
   - Consider connection pooling settings

### Reset Database

For development, you can reset the entire database:

```bash
npm run reset-db
```

**⚠️ Warning**: This will delete all data!

### Manual SQL Access

Connect directly to your NeonDB instance using psql:

```bash
psql "postgresql://username:password@hostname/database?sslmode=require"
```

## Security Considerations

1. **Connection Security**
   - Always use SSL connections (`sslmode=require`)
   - Store DATABASE_URL in environment variables
   - Use strong database passwords

2. **Query Security**
   - All queries use parameterized statements
   - Input validation at service layer
   - No dynamic SQL construction

3. **Access Control**
   - Database access through service classes only
   - Admin operations require Clerk authentication
   - Rate limiting on API endpoints

## Monitoring and Maintenance

### Regular Tasks

1. **Monitor Connection Pool**
   - Check for connection leaks
   - Monitor active connections in NeonDB dashboard

2. **Database Statistics**
   - Review query performance
   - Monitor table sizes and growth
   - Check index usage

3. **Backup Strategy**
   - NeonDB provides automatic backups
   - Consider additional backup strategies for production

### Performance Monitoring

Use the database health endpoint to monitor:
- Connection status
- Table integrity
- Index performance
- Query response times

## Development vs Production

### Development
- Use local .env.local file
- Enable detailed logging
- Use development NeonDB instance

### Production
- Use environment variables from hosting platform
- Disable debug logging
- Use production NeonDB instance with appropriate scaling
- Enable connection pooling optimizations
- Set up monitoring and alerting

## Support

For issues related to:
- **NeonDB**: Check [Neon Documentation](https://neon.tech/docs)
- **PostgreSQL**: Refer to [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- **Application Issues**: Check the health endpoint and logs