# Developer Portfolio Dashboard

A modern, full-stack developer portfolio with an integrated admin dashboard built with Next.js 15.4.6, TypeScript, TailwindCSS, and NeonDB PostgreSQL.

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

### ✅ Recently Implemented
- 🎭 Enhanced Hero Section with typewriter animations and particle effects
- 📊 Admin project management interface with full CRUD operations
- 🖼️ Project image upload and management system
- 📋 Admin dashboard layout with responsive design
- 💼 Experience management system with chronological sorting
- 📧 Contact form API with admin message management
- 🧪 Comprehensive testing suite for all backend functionality

### 🚧 In Development
- 📱 Dynamic projects showcase section
- 💼 Experience timeline implementation
- 📧 Contact form implementation
- 🎭 Additional Framer Motion animations
- 🚀 SEO optimization and performance enhancements

## Tech Stack

- **Frontend**: Next.js 15.4.6, React 19, TypeScript
- **Styling**: TailwindCSS 3.4.3 with custom dark theme and electric blue accents
- **Animations**: Framer Motion 10.18.0 with custom hooks and particle systems
- **Database**: NeonDB (PostgreSQL) with connection pooling
- **Authentication**: Clerk Authentication v6.31.1
- **ORM**: Custom TypeScript services with raw SQL
- **Image Optimization**: Next.js Image component
- **Rate Limiting**: Custom rate limiting implementation
- **UI Components**: Headless UI 2.2.7 for accessible components

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

### ✅ Admin Dashboard (Partially Implemented)
- Complete admin layout with responsive sidebar and header
- Project management interface with CRUD operations
- Image upload system with drag-and-drop functionality
- Real-time notifications and error handling
- Experience table component with filtering and sorting

### ✅ Frontend (Partially Implemented)
- Enhanced Hero Section with typewriter effects and particle animations
- About Section with animated statistics and glassmorphism design
- Skills Section with categorized tech stack display
- Portfolio Layout with navigation and scroll progress
- Experience management interface (UI components ready, integration in progress)
- Contact message management interface (planned)
- Dynamic projects showcase (in development)
- Experience timeline (in development)

## Getting Started

### Prerequisites

- Node.js 18+ 
- NeonDB PostgreSQL database (or compatible PostgreSQL)
- Clerk account for authentication
- npm or yarn

### Dependencies Overview

**Production Dependencies:**
- `@clerk/nextjs` (6.31.1) - Authentication
- `@headlessui/react` (2.2.7) - Accessible UI components
- `@neondatabase/serverless` (0.9.0) - Database driver
- `next` (15.4.6) - React framework
- `react` (19.1.1) & `react-dom` (19.1.1) - React library
- `framer-motion` (10.18.0) - Animations
- `clsx` (2.0.0) & `tailwind-merge` (2.0.0) - Conditional styling
- `dotenv` (17.2.1) - Environment variables
- `svix` (1.73.0) - Webhook verification

**Development Dependencies:**
- `tailwindcss` (3.4.3) - CSS framework
- `postcss` (8.4.38) & `autoprefixer` (10.4.17) - CSS processing
- `@tailwindcss/*` plugins - Additional Tailwind functionality
- `typescript` (5.0.0) - Type checking
- `tsx` (4.7.0) - TypeScript execution
- `eslint` & `eslint-config-next` - Code linting

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
│   │   ├── projects/page.tsx     # /projects route (NEW)
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
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── AdminBreadcrumb.tsx
│   │   ├── AdminMobileMenu.tsx
│   │   ├── ProjectsManager.tsx   # Project management interface
│   │   ├── ProjectsTable.tsx     # Project data table
│   │   ├── ProjectModal.tsx      # Project create/edit modal
│   │   ├── ExperienceManager.tsx # Experience management interface
│   │   ├── ExperienceTable.tsx   # Experience data table
│   │   ├── ExperienceModal.tsx   # Experience create/edit modal
│   │   ├── ContactMessagesManager.tsx # Contact message management
│   │   ├── ContactMessagesTable.tsx   # Contact message table
│   │   ├── DeleteConfirmModal.tsx
│   │   └── NotificationSystem.tsx
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
│   ├── API_DOCUMENTATION.md      # API documentation
│   ├── ADMIN_INTERFACE.md        # Admin dashboard guide
│   ├── DEPLOYMENT.md             # Production deployment guide
│   ├── IMAGE_UPLOAD_SYSTEM.md    # File upload documentation
│   ├── STYLING_SYSTEM.md         # TailwindCSS and design system guide
│   └── ANIMATION_SYSTEM.md       # Framer Motion animations and effects
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
- `npm run test-hero` - Test Hero Section implementation and features

**Note:** HTTP tests require the development server to be running (`npm run dev`) to test actual API endpoints.

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - NeonDB PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret for user sync

## Admin Interface

The project includes a comprehensive admin dashboard for content management:

- **Project Management**: Full CRUD interface with image upload at `/admin/projects`
- **Responsive Design**: Mobile-friendly interface with glassmorphism effects
- **Real-time Notifications**: Instant feedback for all operations
- **Secure Authentication**: Clerk-powered authentication with role-based access

See [Admin Interface Guide](./docs/ADMIN_INTERFACE.md) for detailed usage instructions.

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