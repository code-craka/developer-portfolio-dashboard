# Contributing to Developer Portfolio Dashboard

Thank you for your interest in contributing to the Developer Portfolio Dashboard! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/code-craka/developer-portfolio-dashboard.git
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
   Update the values in `.env.local` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin route group
│   ├── api/               # API routes
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── sections/     # Page sections
│   │   └── admin/        # Admin-specific components
│   ├── lib/              # Utility functions and configurations
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
├── .github/              # GitHub workflows and templates
├── middleware.ts         # Route protection middleware
└── package.json
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use strict mode settings

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router conventions
- Implement proper error boundaries

### Styling

- Use TailwindCSS for styling
- Follow the established design system
- Use CSS modules for component-specific styles
- Maintain responsive design principles

### Code Formatting

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(auth): add JWT authentication system
fix(ui): resolve mobile navigation menu issue
docs: update API documentation
style: format code with prettier
refactor(db): optimize database queries
```

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes** thoroughly:
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes** using conventional commit format

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if applicable)
   - Test results

7. **Address review feedback** promptly

8. **Ensure CI passes** before requesting final review

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API routes
- Write component tests for React components
- Maintain good test coverage (aim for >80%)

### Test Structure

```javascript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Keep README.md up to date
- Update API documentation when adding new endpoints

### API Documentation

- Document all API endpoints
- Include request/response examples
- Specify authentication requirements
- Document error responses

## Issue Reporting

When reporting issues:

1. Use the provided issue templates
2. Include steps to reproduce
3. Provide environment information
4. Add screenshots if applicable
5. Check for existing similar issues

## Feature Requests

When requesting features:

1. Use the feature request template
2. Explain the use case
3. Provide mockups or examples if possible
4. Consider implementation complexity

## Questions and Support

- Check existing documentation first
- Search closed issues for similar questions
- Create a new issue with the question label
- Join our community discussions

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to the Developer Portfolio Dashboard! 🚀