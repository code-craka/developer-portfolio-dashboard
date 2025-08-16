# Developer Portfolio Dashboard

A modern, full-stack developer portfolio with an integrated admin dashboard built with Next.js 15.2.3, TypeScript, TailwindCSS, and NeonDB PostgreSQL.

## Features

### ✅ Implemented
- 🎨 Modern dark theme with glassmorphism design
- ⚡ Electric blue accents and smooth animations
- 🔐 Secure admin authentication with Clerk v6 (Next.js 15 compatible)
- 🗄️ PostgreSQL database with NeonDB
- 🔄 Database migrations and health monitoring
- 🛡️ Rate limiting and security features
- 🔒 Route protection with middleware
- 📡 Webhook integration for user management
- 🖼️ Image upload system with validation and cleanup
- 📊 Project CRUD API with full admin management
- 💼 Experience CRUD API with chronological sorting
- 📧 Contact form API with message management
- 🧪 Comprehensive testing suite for all implemented features

### 🚧 In Development
- 📱 Fully responsive portfolio frontend
- 📊 Admin dashboard UI components
- 🎭 Framer Motion animations
- 🚀 SEO optimization and performance enhancements

## Tech Stack

- **Frontend**: Next.js 15.2.3, React 18, TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Animations**: Framer Motion
- **Database**: NeonDB (PostgreSQL) with connection pooling
- **Authentication**: Clerk Authentication v6.31.1
- **ORM**: Custom TypeScript services with raw SQL
- **Image Optimization**: Next.js Image component
- **Rate Limiting**: Custom rate limiting implementation

## Current Implementation Status

This project is actively under development. Here's what's currently functional:

### ✅ Backend & API (Ready for Use)
- Complete project CRUD operations with database persistence
- Complete experience CRUD operations with chronological sorting
- Complete contact form API with message management
- Secure admin authentication with Clerk integration
- Image upload system with validation and cleanup
- Database health monitoring and auto-repair
- Comprehensive test suite for all backend functionality
- Rate limiting and security middleware

### ✅ Database Layer (Fully Implemented)
- PostgreSQL schema with optimized indexes
- Migration system for easy setup
- Service classes for all data operations
- Connection pooling and health monitoring

### 🚧 Frontend (In Development)
- Admin dashboard UI components (basic structure in place)
- Public portfolio pages (planned)
- Responsive design implementation (planned)
- Framer Motion animations (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- NeonDB PostgreSQL database (or compatible PostgreSQL)
- Clerk account for authentication
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration:
   - `DATABASE_URL`: Your NeonDB connection string
   - Clerk authentication keys
   - Other configuration options

4. Initialize the database:
   ```bash
   npm run init-db
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure (Next.js 15+ App Router Best Practices)

```
├── app/                          # Next.js App Router (routes & layouts only)
│   ├── (admin)/                  # Admin route group
│   │   ├── dashboard/page.tsx    # /dashboard route
│   │   ├── login/page.tsx        # /login route
│   │   ├── profile/page.tsx      # /profile route
│   │   ├── sign-up/page.tsx      # /sign-up route
│   │   └── layout.tsx            # Admin group layout
│   ├── api/                      # API routes
│   │   ├── health/db/route.ts    # Database health check
│   │   └── webhooks/clerk/route.ts # Clerk webhook handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable React components (root level)
│   ├── admin/                    # Admin-specific components
│   │   ├── AdminLayoutWrapper.tsx
│   │   ├── AdminNavigation.tsx
│   │   └── AdminProfile.tsx
│   ├── sections/                 # Page sections
│   └── ui/                       # Generic UI components
├── lib/                          # Utility functions & services (root level)
│   ├── admin-service.ts          # Admin operations
│   ├── auth-test.ts              # Authentication testing
│   ├── clerk.ts                  # Clerk utilities
│   ├── database-utils.ts         # CRUD service classes
│   ├── db-health.ts              # Database health monitoring
│   ├── db.ts                     # Database connection
│   ├── migrations.ts             # Database migration system
│   ├── rate-limit.ts             # Rate limiting utilities
│   ├── security.ts               # Security configurations
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # General utility functions
├── public/                       # Static assets
│   ├── uploads/projects/         # Project image uploads
│   ├── clients.html              # Standalone HTML files
│   └── style.css                 # Additional styles
├── scripts/                      # Database & utility scripts
│   ├── init-db.ts                # Database initialization
│   ├── test-auth-setup.ts        # Authentication testing
│   └── test-clerk-setup.ts       # Clerk setup verification
├── docs/                         # Documentation
│   ├── DATABASE_SETUP.md         # Database setup guide
│   ├── AUTHENTICATION_SETUP.md   # Auth setup guide
│   └── API_DOCUMENTATION.md      # API documentation
├── .kiro/                        # Kiro configuration
│   ├── specs/                    # Feature specifications
│   └── steering/                 # Project guidance
├── middleware.ts                 # Route protection
├── CHANGELOG.md                  # Project changelog
└── package.json
```

### Import Patterns

The project uses TypeScript path aliases for clean imports:

```typescript
// Utility functions and services
import { AdminService } from '@/lib/admin-service'
import { db } from '@/lib/db'
import { requireAdminAuth } from '@/lib/clerk'

// React components
import AdminNavigation from '@/components/admin/AdminNavigation'
import ProjectCard from '@/components/ui/ProjectCard'

// Type definitions
import type { Project, Admin } from '@/lib/types'
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management
- `npm run init-db` - Initialize database tables and indexes
- `npm run reset-db` - Reset database (development only)

### Testing & Validation
- `npm run test-auth` - Test authentication setup and admin functionality
- `npm run test-projects` - Test project CRUD database operations
- `npm run test-projects-http` - Test project HTTP API endpoints (requires dev server)
- `npm run test-projects-complete` - Run comprehensive project API tests
- `npm run test-experiences` - Test experience CRUD database operations
- `npm run test-experiences-http` - Test experience HTTP API endpoints (requires dev server)
- `npm run verify-experiences` - Verify experience API implementation and setup
- `npm run test-contact` - Test contact form API database operations
- `npm run test-contact-http` - Test contact form HTTP API endpoints (requires dev server)

**Note:** HTTP tests require the development server to be running (`npm run dev`) to test actual API endpoints.

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - NeonDB PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret for user sync

## Database Setup

This project uses NeonDB (PostgreSQL) for data storage. See [Database Setup Guide](./docs/DATABASE_SETUP.md) for detailed instructions.

### Quick Database Setup

1. Create a NeonDB account at [neon.tech](https://neon.tech)
2. Create a new project and copy the connection string
3. Add the connection string to your `.env.local` file
4. Run `npm run init-db` to create tables and indexes

### Database Health Check

Visit `/api/health/db` to check database connectivity and table status.

## API Endpoints

The application provides a REST API for managing portfolio content:

### ✅ Implemented Endpoints

**Public Endpoints:**
- `GET /api/projects` - Fetch all projects (supports `?featured=true` filter)
- `GET /api/experiences` - Fetch all work experiences with chronological sorting
- `POST /api/contact` - Submit contact form messages
- `GET /api/health/db` - Database health check

**Admin Endpoints (Authentication Required):**
- `POST /api/projects` - Create new project
- `PUT /api/projects/[id]` - Update existing project  
- `DELETE /api/projects/[id]` - Delete project (includes file cleanup)
- `POST /api/experiences` - Create new experience
- `PUT /api/experiences/[id]` - Update existing experience
- `DELETE /api/experiences/[id]` - Delete experience (includes logo cleanup)
- `GET /api/contact` - Get all contact messages (supports `?unread=true` filter)
- `GET /api/contact/[id]` - Get specific contact message
- `PUT /api/contact/[id]` - Mark contact message as read/unread
- `DELETE /api/contact/[id]` - Delete contact message
- `POST /api/upload` - Upload project images and company logos
- `POST /api/webhooks/clerk` - Clerk user synchronization
- `GET /api/admin/files` - Get storage statistics
- `DELETE /api/admin/files` - Clean up orphaned files
- `POST /api/admin/files/delete` - Delete specific files

### 🚧 Planned Endpoints
- Admin dashboard data (`/api/admin/stats`)

For detailed API documentation, see [API Documentation](./docs/API_DOCUMENTATION.md).

## License

MIT