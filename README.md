# Developer Portfolio Dashboard

A modern, full-stack developer portfolio with an integrated admin dashboard built with Next.js 15.2.3, TypeScript, TailwindCSS, and NeonDB PostgreSQL.

## Features

- 🎨 Modern dark theme with glassmorphism design
- ⚡ Electric blue accents and smooth animations
- 📱 Fully responsive design
- 🔐 Secure admin authentication with Clerk v6 (Next.js 15 compatible)
- 📊 Admin dashboard for content management
- 🖼️ Image upload and optimization
- 🎭 Framer Motion animations
- 🚀 Optimized for performance and SEO
- 🗄️ PostgreSQL database with NeonDB
- 🔄 Database migrations and health monitoring
- 🛡️ Rate limiting and security features
- 🔒 Route protection with middleware
- 📡 Webhook integration for user management

## Tech Stack

- **Frontend**: Next.js 15.2.3, React 18, TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Animations**: Framer Motion
- **Database**: NeonDB (PostgreSQL) with connection pooling
- **Authentication**: Clerk Authentication v6.31.1
- **ORM**: Custom TypeScript services with raw SQL
- **Image Optimization**: Next.js Image component
- **Rate Limiting**: Custom rate limiting implementation

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database tables and indexes
- `npm run reset-db` - Reset database (development only)

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

## License

MIT