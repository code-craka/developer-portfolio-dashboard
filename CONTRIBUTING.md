# Contributing to Developer Portfolio Dashboard

Thank you for your interest in contributing to the Developer Portfolio Dashboard! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project follows a Code of Conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed
- Basic knowledge of TypeScript, React, and Next.js
- Familiarity with TailwindCSS (helpful but not required)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/developer-portfolio-dashboard.git
   cd developer-portfolio-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Verify Setup**
   - Visit http://localhost:3000
   - Check database health at http://localhost:3000/api/health/db
   - Test admin login at http://localhost:3000/login

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin routes (protected)
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin dashboard components
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and services
├── docs/                 # Documentation
├── scripts/              # Database and utility scripts
└── test/                 # Test files
```

### Key Technologies

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.0.0 (strict mode)
- **Styling**: TailwindCSS 3.4.3 with custom theme
- **Database**: NeonDB (PostgreSQL) with raw SQL
- **Authentication**: Clerk 6.31.1
- **Animations**: Framer Motion 10.18.0
- **UI Components**: Headless UI 2.2.7

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes**: Fix issues or improve existing functionality
2. **Features**: Add new features or enhance existing ones
3. **Documentation**: Improve docs, add examples, or fix typos
4. **Testing**: Add tests or improve test coverage
5. **Performance**: Optimize performance or bundle size
6. **Accessibility**: Improve accessibility compliance
7. **Design**: Enhance UI/UX or visual design

### Before You Start

1. **Check Existing Issues**: Look for existing issues or discussions
2. **Create an Issue**: For new features or significant changes, create an issue first
3. **Discuss**: Engage with maintainers and community before starting work
4. **Small Changes**: For small fixes, you can directly create a PR

### Development Guidelines

#### Code Style

- **TypeScript**: Use strict TypeScript with proper type definitions
- **Components**: Use functional components with hooks
- **Styling**: Use TailwindCSS utility classes, avoid custom CSS when possible
- **Imports**: Use TypeScript path aliases (`@/lib/*`, `@/components/*`)
- **Naming**: Use PascalCase for components, camelCase for functions/variables

#### Component Guidelines

```typescript
// Good component structure
'use client' // Only if needed for client-side features

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SomeIcon } from '@heroicons/react/24/outline'
import { SomeType } from '@/lib/types'

interface ComponentProps {
  title: string
  optional?: boolean
}

export default function Component({ title, optional = false }: ComponentProps) {
  const [state, setState] = useState<SomeType>()

  return (
    <motion.div className="glassmorphism-card p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      {/* Component content */}
    </motion.div>
  )
}
```

#### API Guidelines

```typescript
// API route structure
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Your logic here

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result
    }, { headers })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
```

#### Database Guidelines

- Use parameterized queries to prevent SQL injection
- Follow existing patterns in `lib/database-utils.ts`
- Add proper indexes for new queries
- Update migration scripts for schema changes

#### Styling Guidelines

- Use existing TailwindCSS utility classes
- Follow the electric blue theme (`#00D4FF`)
- Use glassmorphism effects for cards and modals
- Ensure responsive design (mobile-first approach)
- Test dark theme compatibility

## Pull Request Process

### 1. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/amazing-feature

# Or a bug fix branch
git checkout -b fix/bug-description
```

### 2. Make Changes

- Follow the development guidelines above
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Test your changes thoroughly

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests (if available)
npm test

# Test database operations
npm run test-projects
npm run test-experiences
npm run test-contact

# Test the application manually
npm run dev
```

### 4. Update Documentation

- Update relevant documentation in `/docs`
- Add JSDoc comments for new functions
- Update README.md if needed
- Add or update type definitions

### 5. Submit Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Provide detailed description of changes
   - Reference related issues
   - Add screenshots for UI changes
   - Mark as draft if work in progress

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Other (please describe)

   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] Tested on different screen sizes
   - [ ] Tested with different data

   ## Screenshots (if applicable)
   Add screenshots here

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

### 6. Review Process

- Maintainers will review your PR
- Address feedback and make requested changes
- Keep discussions respectful and constructive
- Be patient - reviews take time

## Testing

### Running Tests

```bash
# Database tests
npm run test-projects
npm run test-experiences
npm run test-contact

# HTTP API tests (requires dev server running)
npm run test-projects-http
npm run test-experiences-http
npm run test-contact-http

# Component tests (if available)
npm test
```

### Writing Tests

- Add tests for new features
- Follow existing test patterns
- Test both success and error cases
- Include edge cases and validation

### Manual Testing Checklist

- [ ] Application builds successfully
- [ ] Database operations work correctly
- [ ] Authentication flow works
- [ ] Admin dashboard functions properly
- [ ] Public portfolio displays correctly
- [ ] Responsive design works on mobile
- [ ] Images upload and display correctly
- [ ] Contact form submissions work
- [ ] Error handling works as expected

## Documentation

### Types of Documentation

1. **Code Documentation**: JSDoc comments for functions and components
2. **API Documentation**: Update `/docs/API_DOCUMENTATION.md`
3. **User Documentation**: Update guides in `/docs`
4. **README Updates**: Keep README.md current
5. **Changelog**: Update `CHANGELOG.md` for significant changes

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date with code changes
- Use proper markdown formatting

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check `/docs` folder for guides
- **Code Examples**: Look at existing code for patterns

### Communication Guidelines

- Be respectful and professional
- Provide context and details when asking questions
- Search existing issues before creating new ones
- Use clear, descriptive titles for issues and PRs
- Tag maintainers only when necessary

### Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Special mentions for outstanding contributions

## Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Run ESLint

# Database
npm run init-db         # Initialize database
npm run reset-db        # Reset database (dev only)

# Testing
npm run test-auth       # Test authentication
npm run verify-experiences  # Verify API implementation
```

### Debugging

- Use browser dev tools for frontend debugging
- Check console logs for errors
- Use database health endpoint: `/api/health/db`
- Enable debug mode: `DEBUG=* npm run dev`

### Performance Considerations

- Optimize images and assets
- Use proper loading states
- Implement error boundaries
- Follow React best practices
- Monitor bundle size

## Questions?

If you have questions about contributing, please:

1. Check existing documentation
2. Search GitHub issues and discussions
3. Create a new discussion or issue
4. Tag maintainers if needed

Thank you for contributing to the Developer Portfolio Dashboard! 🚀