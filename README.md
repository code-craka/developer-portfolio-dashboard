# Developer Portfolio Dashboard

A modern, full-stack developer portfolio website with an integrated admin dashboard for content management. Built with Next.js 15.4.6, TypeScript, TailwindCSS, and NeonDB PostgreSQL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.3-38B2AC)](https://tailwindcss.com/)

> **Note**: This is an open-source project available under the MIT License. Feel free to use it as a template for your own developer portfolio!

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
- 🎨 OptimizedImage component with Next.js Image integration and fill mode support
- 📊 Project CRUD API with full admin management
- 💼 Experience CRUD API with chronological sorting
- 📧 Contact form API with message management
- 🧪 Comprehensive testing suite with enhanced validation testing for all implemented features
- 📊 Advanced error logging system with secure session tracking and comprehensive monitoring

### ✅ Recently Implemented
- 🎭 Enhanced Hero Section with typewriter animations and particle effects
- 📊 Admin project management interface with full CRUD operations
- 🖼️ Project image upload and management system
- 📋 Admin dashboard layout with responsive design
- 💼 Experience management system with chronological sorting
- 📧 Contact form API with admin message management
- 🧪 Comprehensive testing suite for all backend functionality
- 🔧 Intelligent root layout with build-time environment variable handling for improved CI/CD compatibility
- 🔒 Enhanced error logging system with cryptographically secure session tracking

### ✅ Recently Completed
- 📱 Dynamic Projects Showcase with database integration and responsive design
- 🎨 Advanced project cards with glassmorphism effects and hover animations
- 🏷️ Tech stack color coding and categorization system
- 🔗 GitHub and demo link validation with interactive buttons
- ⭐ Featured projects highlighting system
- 🖼️ Enhanced OptimizedImage component with improved fill mode handling

### 🚧 In Development
- 💼 Experience timeline implementation
- 📧 Contact form implementation
- 🎭 Additional Framer Motion animations
- 🚀 SEO optimization and performance enhancements

## Tech Stack

- **Frontend**: Next.js 15.4.6, React 19, TypeScript
- **Styling**: TailwindCSS 3.4.3 with custom dark theme and electric blue accents
- **Animations**: Framer Motion 10.18.0 with custom hooks and particle systems
- **Database**: NeonDB (PostgreSQL) with connection pooling
- **Authentication**: Clerk Authentication v6.31.1 with build-time resilience
- **ORM**: Custom TypeScript services with raw SQL
- **Image Optimization**: Next.js Image component with enhanced fill mode support
- **Rate Limiting**: Custom rate limiting implementation
- **UI Components**: Headless UI 2.2.7 for accessible components
- **Performance**: Production-optimized with bundle splitting, compression, and caching
- **Security**: Enhanced security headers and CSP policies

### Build Resilience & Environment Handling

The application includes intelligent environment variable handling implemented in `lib/clerk.ts` and the root layout (`app/layout.tsx`) that allows successful builds even when authentication keys are not available during build time. This enables:

- **CI/CD Compatibility**: Builds succeed in environments without access to production secrets
- **Preview Deployments**: Safe preview builds without exposing authentication keys  
- **Development Flexibility**: Multiple environment configurations without build failures
- **Graceful Fallbacks**: Authentication functions return safe defaults when Clerk is not configured

### Production Optimizations

The application includes comprehensive production optimizations configured in `next.config.js`:

- **Bundle Optimization**: Automatic code splitting with vendor and common chunk separation for optimal loading performance
- **Compression**: Gzip compression enabled for all responses to reduce bandwidth usage
- **Static Asset Caching**: Long-term caching (1 year) for uploaded images with immutable headers and CDN optimization
- **Security Headers**: Comprehensive security headers including X-Frame-Options, CSP, and Referrer Policy
- **Package Optimization**: Optimized imports for Framer Motion and Headless UI to reduce bundle size
- **Image Optimization**: WebP and AVIF format support with production domain allowlisting (`creavibe.pro`, `*.creavibe.pro`)
- **Clerk Integration**: Secure image loading from Clerk domains (`images.clerk.dev`, `img.clerk.com`)
- **External Package Optimization**: NeonDB serverless package marked as external for server components

**Technical Implementation:**
- Build-time environment check in `app/layout.tsx` determines if Clerk keys are available
- Conditional ClerkProvider rendering - only wraps the app when keys are present
- `isClerkConfigured` check in `lib/clerk.ts` determines Clerk availability at runtime
- Authentication utilities handle missing configuration gracefully
- All auth-dependent features include fallback behavior
- SEO metadata and structured data work regardless of Clerk configuration

**Build Behavior:**
- **With Clerk Keys**: Full authentication functionality enabled
- **Without Clerk Keys**: Application builds and runs with authentication features disabled
- **Runtime Detection**: Authentication status checked dynamically in components

Authentication features require proper environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) in runtime environments.

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

### ✅ Frontend (Mostly Implemented)
- Enhanced Hero Section with typewriter effects and particle animations
- About Section with animated statistics and glassmorphism design
- Skills Section with categorized tech stack display
- Dynamic Projects Showcase with database integration and advanced animations
- Portfolio Layout with navigation and scroll progress
- Experience management interface (UI components ready, integration in progress)
- Contact message management interface (planned)
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

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/developer-portfolio-dashboard.git
   cd developer-portfolio-dashboard
   ```

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
│   ├── ROOT_LAYOUT_ARCHITECTURE.md # Root layout and build resilience
│   ├── BUILD_SYSTEM.md           # Build system, performance optimization, and CI/CD integration
│   ├── ADMIN_INTERFACE.md        # Admin dashboard guide
│   ├── DEPLOYMENT.md             # Production deployment guide
│   ├── ERROR_HANDLING_GUIDE.md   # Error logging and monitoring system
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
- `npm run test-projects-complete` - Run comprehensive project API tests with enhanced validation
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
- `GET /api/admin/files` - Get storage statistics
- `DELETE /api/admin/files` - Clean up orphaned files
- `POST /api/admin/files/delete` - Delete specific files

**Webhook Endpoints:**
- `POST /api/webhooks/clerk` - Clerk webhook for user lifecycle events (basic logging implementation)

### 🚧 Planned Endpoints
- Admin dashboard data (`/api/admin/stats`)

For detailed API documentation, see [API Documentation](./docs/API_DOCUMENTATION.md).

## Contributing

This is an open-source project! Contributions are welcome. Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/developer-portfolio-dashboard.git
   cd developer-portfolio-dashboard
   ```

2. Follow the installation instructions above

3. Make your changes and test thoroughly

4. Submit a pull request with a clear description of your changes

## Repository Information

- **Repository**: [developer-portfolio-dashboard](https://github.com/yourusername/developer-portfolio-dashboard)
- **Issues**: [Report bugs or request features](https://github.com/yourusername/developer-portfolio-dashboard/issues)
- **License**: MIT License - see [LICENSE](./LICENSE) file for details

## Keywords

`portfolio`, `dashboard`, `nextjs`, `typescript`, `tailwindcss`, `clerk`, `neondb`, `developer-portfolio`, `admin-dashboard`, `full-stack`

## Author

**Sayem Abdullah Rihan**
- GitHub: [@code-craka](https://github.com/code-craka)
- Email: hello@techsci.io
- Built with ❤️ by [TechSci, Inc.](https://techsci.io)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

You are free to use this project as a template for your own portfolio or as a starting point for client projects.