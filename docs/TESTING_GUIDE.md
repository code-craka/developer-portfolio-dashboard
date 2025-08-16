# Testing Guide

This document provides comprehensive information about the testing infrastructure and practices for the Developer Portfolio Dashboard.

## Testing Stack

- **Test Framework**: Vitest (fast, modern testing framework)
- **React Testing**: @testing-library/react for component testing
- **User Interactions**: @testing-library/user-event for realistic user interactions
- **API Mocking**: MSW (Mock Service Worker) for API request mocking
- **Coverage**: @vitest/coverage-v8 for code coverage reports
- **Environment**: jsdom for browser-like testing environment

## Test Structure

```
test/
├── setup.ts                    # Global test setup and mocks
├── mocks/
│   ├── server.ts              # MSW server setup
│   └── handlers.ts            # API request handlers
├── lib/                       # Unit tests for utilities
│   ├── utils.test.ts
│   ├── validation.test.ts
│   ├── security.test.ts
│   ├── clerk.test.ts
│   └── admin-service.test.ts
├── components/                # Component tests
│   ├── sections/
│   │   ├── HeroSection.test.tsx
│   │   ├── ProjectsSection.test.tsx
│   │   └── ContactSection.test.tsx
│   └── admin/
│       └── ProjectsManager.test.tsx
├── api/                       # API route integration tests
│   ├── projects.test.ts
│   ├── experiences.test.ts
│   └── contact.test.ts
├── e2e/                       # End-to-end tests
│   ├── portfolio.test.ts
│   └── admin-dashboard.test.ts
└── middleware.test.ts         # Middleware tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test categories
npm run test:unit        # Unit tests only
npm run test:integration # API integration tests
npm run test:e2e        # End-to-end tests
```

### Running Specific Tests

```bash
# Run tests for a specific file
npx vitest test/lib/utils.test.ts

# Run tests matching a pattern
npx vitest --run --reporter=verbose test/components

# Run tests in a specific directory
npx vitest test/api/
```

## Test Categories

### 1. Unit Tests (70% of test suite)

**Purpose**: Test individual functions and components in isolation

**Coverage**:
- Utility functions (`lib/utils.ts`, `lib/validation.ts`, `lib/security.ts`)
- Authentication helpers (`lib/clerk.ts`)
- Service classes (`lib/admin-service.ts`)
- Individual React components

**Example**:
```typescript
describe('validateProject', () => {
  it('should validate a correct project', () => {
    const project = {
      title: 'Test Project',
      description: 'A test project description',
      techStack: ['React', 'TypeScript'],
      imageUrl: '/uploads/projects/test.jpg',
      featured: true,
    }

    const result = validateProject(project)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })
})
```

### 2. Integration Tests (20% of test suite)

**Purpose**: Test API routes and database operations

**Coverage**:
- API endpoint functionality
- Database CRUD operations
- Authentication middleware
- File upload handling

**Example**:
```typescript
describe('POST /api/projects', () => {
  it('should create a new project', async () => {
    const newProject = {
      title: 'New Project',
      description: 'A new project description',
      techStack: ['React', 'Next.js'],
      imageUrl: '/uploads/projects/new-project.jpg',
      featured: false,
    }

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.project.title).toBe('New Project')
  })
})
```

### 3. End-to-End Tests (10% of test suite)

**Purpose**: Test complete user workflows

**Coverage**:
- Portfolio viewing experience
- Admin dashboard workflows
- Form submissions
- Navigation and interactions

**Example**:
```typescript
it('should handle contact form submission', async () => {
  const user = userEvent.setup()
  render(<HomePage />)
  
  // Fill out and submit form
  await user.type(screen.getByLabelText(/name/i), 'John Doe')
  await user.type(screen.getByLabelText(/email/i), 'john@example.com')
  await user.type(screen.getByLabelText(/message/i), 'Test message')
  await user.click(screen.getByRole('button', { name: /send/i }))
  
  // Verify success
  await waitFor(() => {
    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
  })
})
```

## Mocking Strategy

### API Mocking with MSW

All API requests are mocked using Mock Service Worker for consistent and reliable testing:

```typescript
// test/mocks/handlers.ts
export const handlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects)
  }),
  
  http.post('/api/projects', async ({ request }) => {
    const newProject = await request.json()
    return HttpResponse.json({ success: true, project: newProject })
  }),
]
```

### Component Mocking

External dependencies are mocked in the test setup:

```typescript
// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

// Mock Clerk authentication
vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: true,
    userId: 'test-user-id',
  }),
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
  },
}))
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Critical Areas (100% Coverage Required)

- Authentication logic (`lib/clerk.ts`)
- Data validation (`lib/validation.ts`)
- Security functions (`lib/security.ts`)
- API route handlers

### Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output during test runs
- **HTML**: Detailed interactive report in `coverage/index.html`
- **JSON**: Machine-readable format for CI/CD integration

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it('should validate email format', () => {
  // Arrange
  const invalidEmail = 'not-an-email'
  
  // Act
  const result = validateEmail(invalidEmail)
  
  // Assert
  expect(result.isValid).toBe(false)
  expect(result.error).toBe('Invalid email format')
})
```

### 2. Descriptive Test Names

- ✅ `should return validation error when email is invalid`
- ❌ `test email validation`

### 3. Test One Thing at a Time

Each test should focus on a single behavior or outcome.

### 4. Use Realistic Test Data

```typescript
const mockProject = {
  id: 1,
  title: 'E-commerce Platform',
  description: 'A full-stack e-commerce solution with React and Node.js',
  techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  githubUrl: 'https://github.com/user/ecommerce-platform',
  demoUrl: 'https://ecommerce-demo.com',
  imageUrl: '/uploads/projects/ecommerce.jpg',
  featured: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}
```

### 5. Test Error Conditions

Always test both success and failure scenarios:

```typescript
describe('createProject', () => {
  it('should create project with valid data', async () => {
    // Test success case
  })
  
  it('should reject project with invalid data', async () => {
    // Test validation errors
  })
  
  it('should handle database errors gracefully', async () => {
    // Test error handling
  })
})
```

### 6. Accessibility Testing

Include accessibility checks in component tests:

```typescript
it('should have proper accessibility attributes', () => {
  render(<ContactForm />)
  
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
})
```

## Continuous Integration

### GitHub Actions Integration

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

### Pre-commit Hooks

Consider adding pre-commit hooks to run tests automatically:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

## Debugging Tests

### Running Tests in Debug Mode

```bash
# Run with verbose output
npx vitest --run --reporter=verbose

# Run specific test with debugging
npx vitest --run test/lib/utils.test.ts --reporter=verbose
```

### Common Issues and Solutions

1. **Tests timing out**: Increase timeout or check for unresolved promises
2. **Mock not working**: Ensure mocks are set up before imports
3. **DOM not available**: Check that jsdom environment is configured
4. **API calls not mocked**: Verify MSW handlers are correctly defined

## Performance Testing

While not included in this basic setup, consider adding performance tests for:
- Component render times
- API response times
- Bundle size analysis
- Memory usage monitoring

## Security Testing

Include security-focused tests:
- Input sanitization
- XSS prevention
- CSRF protection
- Authentication bypass attempts

## Maintenance

### Regular Tasks

1. **Update test data**: Keep mock data realistic and current
2. **Review coverage**: Ensure new features have adequate test coverage
3. **Update mocks**: Keep mocks in sync with actual API changes
4. **Performance monitoring**: Watch for slow tests and optimize

### Test Refactoring

Regularly refactor tests to:
- Remove duplication
- Improve readability
- Update deprecated patterns
- Optimize performance

This comprehensive testing infrastructure ensures the reliability, security, and maintainability of the Developer Portfolio Dashboard while providing confidence in deployments and feature additions.