# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Project CRUD API Routes**: Complete REST API for project management
  - `GET /api/projects` - Public endpoint for fetching all projects with optional featured filter
  - `POST /api/projects` - Admin endpoint for creating new projects
  - `PUT /api/projects/[id]` - Admin endpoint for updating existing projects
  - `DELETE /api/projects/[id]` - Admin endpoint for deleting projects with automatic file cleanup
- **Comprehensive API Testing Suite**:
  - Database-level CRUD operation tests (`npm run test-projects`)
  - HTTP endpoint integration tests (`npm run test-projects-http`)
  - Complete validation and security tests (`npm run test-projects-complete`)
- **Enhanced Security & Validation**:
  - Input validation for all project data using security utilities
  - SQL injection prevention with parameterized queries
  - Proper error handling with consistent API responses
  - Authentication protection for admin operations
  - Rate limiting with different tiers for public vs admin endpoints
- **Middleware Improvements**:
  - Smart route protection (GET endpoints public, write operations protected)
  - JSON error responses for API endpoints instead of redirects
  - Method-based rate limiting for optimal performance
- Complete Clerk Authentication setup with Next.js 15 compatibility
- Admin login page with glassmorphism design
- Admin dashboard with user profile integration
- Admin sign-up page with matching design
- Admin profile management page with Clerk UserProfile
- Clerk webhook handler for user management
- Database admins table with proper indexes
- Authentication utilities for server-side auth
- Route protection middleware for admin areas
- Comprehensive test script for Clerk setup verification
- Enhanced admin navigation component with responsive design

### Changed
- **BREAKING**: Refactored project structure to follow Next.js 15+ App Router best practices
- Moved `/app/components/` to root-level `/components/`
- Moved `/app/lib/` to root-level `/lib/`
- Moved static HTML files to `/public/`
- Updated all import paths to use new structure (`@/lib/*`, `@/components/*`)
- Restructured admin routes: removed duplicate `/admin/admin/` nesting
- Updated documentation to reflect new structure
- Upgraded Clerk from v5.0.0 to v6.31.1 for Next.js 15 compatibility
- Updated middleware to use async auth API
- Fixed headers() async API compatibility issues
- Improved error handling in authentication flows
- Enhanced security headers configuration

### Fixed
- Resolved Next.js 15 headers() async API errors
- Fixed Clerk middleware authentication flow
- Corrected TypeScript compilation issues
- Fixed database initialization script environment loading
- Removed duplicate admin-service.ts file
- Fixed all import resolution issues after refactoring

### Technical Details
- **Project Structure**: Now follows Next.js 15+ App Router best practices with clean separation of concerns
- **Import Patterns**: Consistent use of TypeScript path aliases for maintainable code
- **Route Organization**: Clean admin route structure using route groups `(admin)`
- **Clerk Authentication**: Fully integrated with custom glassmorphism dark theme styling
- **Database Integration**: Admins table synced via webhooks
- **Route Protection**: Middleware protects admin areas and API endpoints
- **Error Handling**: Graceful redirects for unauthenticated users
- **Type Safety**: Comprehensive TypeScript interfaces for auth flows
- **Build Verification**: Project builds successfully with no TypeScript errors

## [0.1.0] - 2025-01-15

### Added
- Initial project setup with Next.js 15.2.3
- TailwindCSS configuration with electric blue theme
- NeonDB PostgreSQL integration
- Database health monitoring system
- Rate limiting implementation
- Security headers configuration
- Project structure and documentation

### Infrastructure
- Next.js App Router architecture
- TypeScript strict mode configuration
- Custom database service classes
- Migration system for database schema
- Environment configuration management