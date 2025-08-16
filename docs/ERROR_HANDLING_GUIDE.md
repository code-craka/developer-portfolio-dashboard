# Error Handling and Validation Enhancement Guide

This guide covers the comprehensive error handling and validation system implemented for the developer portfolio dashboard.

## Overview

The error handling system provides:
- **React Error Boundaries** for catching and handling component errors
- **Comprehensive Form Validation** with real-time feedback
- **API Error Handling** with user-friendly messages
- **Error Logging and Monitoring** for debugging and analytics
- **Fallback UI Components** for graceful error recovery
- **Toast Notifications** for user feedback

## Components

### 1. Error Boundaries

#### ErrorBoundary
Main error boundary component that catches React errors and provides fallback UI.

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary'

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <YourComponent />
</ErrorBoundary>
```

#### ApiErrorBoundary
Specialized error boundary for API-related components.

```tsx
import ApiErrorBoundary from '@/components/ui/ApiErrorBoundary'

<ApiErrorBoundary
  onRetry={() => refetchData()}
  fallbackMessage="Failed to load projects"
>
  <ProjectsList />
</ApiErrorBoundary>
```

### 2. Error Display Components

#### ErrorMessage
Displays error messages with different types and styling.

```tsx
import { ErrorMessage } from '@/components/ui/ErrorMessage'

<ErrorMessage
  message="Something went wrong"
  type="error" // 'error' | 'warning' | 'info' | 'success'
  dismissible
  onDismiss={() => clearError()}
/>
```

#### ErrorList
Displays multiple errors in a formatted list.

```tsx
import { ErrorList } from '@/components/ui/ErrorMessage'

<ErrorList
  errors={['Field is required', 'Invalid email format']}
  title="Please fix the following errors:"
  type="error"
/>
```

#### FieldError
Displays field-specific validation errors.

```tsx
import { FieldError } from '@/components/ui/ErrorMessage'

<FieldError
  error={fieldError}
  touched={fieldTouched}
/>
```

### 3. Toast Notifications

#### ToastProvider
Provides toast notification context throughout the app.

```tsx
import ToastProvider from '@/components/ui/ToastProvider'

<ToastProvider maxToasts={5}>
  <App />
</ToastProvider>
```

#### useToast Hook
Hook for displaying toast notifications.

```tsx
import { useToast } from '@/components/ui/ToastProvider'

function MyComponent() {
  const { showError, showSuccess, showWarning, showInfo } = useToast()

  const handleError = () => {
    showError('Something went wrong!')
  }

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!')
  }
}
```

### 4. Validated Form Components

#### ValidatedInput
Input component with built-in validation.

```tsx
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { validationRules } from '@/lib/validation'

<ValidatedInput
  type="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  error={emailError}
  touched={emailTouched}
  required
  validationRules={[
    validationRules.required(),
    validationRules.email()
  ]}
  validateOnBlur
/>
```

#### ValidatedTextarea
Textarea component with validation and character counting.

```tsx
import { ValidatedTextarea } from '@/components/ui/ValidatedInput'

<ValidatedTextarea
  label="Message"
  value={message}
  onChange={setMessage}
  maxLength={500}
  showCharCount
  validationRules={[
    validationRules.required(),
    validationRules.minLength(10)
  ]}
/>
```

#### ValidatedSelect
Select component with validation.

```tsx
import { ValidatedSelect } from '@/components/ui/ValidatedInput'

<ValidatedSelect
  label="Employment Type"
  value={employmentType}
  onChange={setEmploymentType}
  options={[
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' }
  ]}
  validationRules={[validationRules.required()]}
/>
```

### 5. Fallback UI Components

#### FallbackUI
Generic fallback component for error states.

```tsx
import { FallbackUI } from '@/components/ui/FallbackUI'

<FallbackUI
  title="Something went wrong"
  description="Please try again later"
  action={{
    label: "Retry",
    onClick: handleRetry
  }}
/>
```

#### Specialized Fallback Components

```tsx
import { 
  NetworkErrorFallback,
  DatabaseErrorFallback,
  EmptyProjectsState,
  LoadingFallback
} from '@/components/ui/FallbackUI'

// Network error
<NetworkErrorFallback onRetry={refetch} />

// Database error
<DatabaseErrorFallback onRetry={reconnect} />

// Empty state
<EmptyProjectsState onAddProject={openModal} />

// Loading state
<LoadingFallback showSkeleton />
```

## Validation System

### Validation Rules

Pre-built validation rules for common scenarios:

```tsx
import { validationRules } from '@/lib/validation'

const rules = [
  validationRules.required('This field is required'),
  validationRules.minLength(3, 'Must be at least 3 characters'),
  validationRules.maxLength(100, 'Must be less than 100 characters'),
  validationRules.email('Please enter a valid email'),
  validationRules.url('Please enter a valid URL'),
  validationRules.githubUrl('Please enter a valid GitHub URL'),
  validationRules.fileSize(5 * 1024 * 1024, 'File must be less than 5MB'),
  validationRules.fileType(['image/jpeg', 'image/png'], 'Only JPEG and PNG allowed')
]
```

### Form Validation Hook

Comprehensive form validation with real-time feedback:

```tsx
import { useFormValidation } from '@/lib/hooks/useFormValidation'
import { projectValidationSchema } from '@/lib/validation'

function ProjectForm() {
  const [formState, formActions] = useFormValidation({
    initialValues: {
      title: '',
      description: '',
      techStack: []
    },
    validationSchema: projectValidationSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await saveProject(values)
    }
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      formActions.submit()
    }}>
      <ValidatedInput
        label="Title"
        value={formState.fields.title.value}
        onChange={(value) => formActions.setValue('title', value)}
        onBlur={() => formActions.setTouched('title')}
        error={formState.fields.title.error}
        touched={formState.fields.title.touched}
      />
      
      <button 
        type="submit" 
        disabled={formState.isSubmitting || !formState.isValid}
      >
        {formState.isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

### Field Validation Hook

Simple field validation for individual inputs:

```tsx
import { useFieldValidation } from '@/lib/hooks/useFormValidation'
import { validationRules } from '@/lib/validation'

function EmailInput() {
  const email = useFieldValidation('', [
    validationRules.required(),
    validationRules.email()
  ], {
    validateOnBlur: true,
    fieldName: 'email'
  })

  return (
    <ValidatedInput
      type="email"
      label="Email"
      value={email.value}
      onChange={email.setValue}
      onBlur={email.onBlur}
      error={email.error}
      touched={email.touched}
    />
  )
}
```

## API Error Handling

### Error Handler Wrapper

Wrap API route handlers with error handling:

```tsx
import { withErrorHandler } from '@/lib/api-error-handler'

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Your API logic here
  // Errors are automatically caught and formatted
})
```

### Custom Error Classes

Use specific error classes for different scenarios:

```tsx
import { 
  ValidationError,
  AuthenticationError,
  DatabaseError,
  FileUploadError
} from '@/lib/api-error-handler'

// Validation error
throw new ValidationError('Invalid email format', 'email', 'invalid@')

// Authentication error
throw new AuthenticationError('Please sign in to continue')

// Database error
throw new DatabaseError('Connection failed', 'SELECT * FROM users', [])

// File upload error
throw new FileUploadError('File too large', 'image.jpg', 10485760)
```

### API Client

Use the enhanced API client for consistent error handling:

```tsx
import { apiClient } from '@/lib/api-error-handler'

try {
  const projects = await apiClient.get<Project[]>('/projects')
  // Handle success
} catch (error) {
  // Error is automatically typed and includes status, code, etc.
  console.error('API Error:', error.message)
}
```

### API Error Hook

React hook for handling API calls with error management:

```tsx
import { useApiErrorHandler } from '@/lib/api-error-handler'

function ProjectsList() {
  const { handleApiCall, error, isLoading } = useApiErrorHandler()
  const [projects, setProjects] = useState<Project[]>([])

  const loadProjects = () => {
    handleApiCall(
      () => apiClient.get<Project[]>('/projects'),
      (data) => setProjects(data),
      (error) => console.error('Failed to load projects:', error)
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} type="error" />
  }

  if (isLoading) {
    return <LoadingFallback />
  }

  return <ProjectGrid projects={projects} />
}
```

## Error Logging

### Error Logger

Comprehensive error logging with metrics and persistence:

```tsx
import { errorLogger, logError, logApiError } from '@/lib/error-logging'

// Log general errors
logError('Something went wrong', { 
  component: 'ProjectForm',
  action: 'submit'
})

// Log API errors
logApiError({
  endpoint: '/api/projects',
  method: 'POST',
  status: 500,
  statusText: 'Internal Server Error',
  responseBody: { error: 'Database connection failed' }
})

// Get error metrics
const metrics = errorLogger.getMetrics()
console.log('Total errors:', metrics.totalErrors)
console.log('Errors by type:', metrics.errorsByType)
```

### Error Logging Hook

React hook for component-level error logging:

```tsx
import { useErrorLogger } from '@/lib/error-logging'

function MyComponent() {
  const { logComponentError, logFormError, logActionError } = useErrorLogger()

  const handleSubmit = async () => {
    try {
      await submitForm()
    } catch (error) {
      logActionError('form_submit', error, { formType: 'project' })
    }
  }
}
```

## Best Practices

### 1. Error Boundary Placement

Place error boundaries at strategic levels:

```tsx
// App level - catches all errors
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Feature level - isolates feature errors
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <ProjectsFeature />
</ErrorBoundary>

// Component level - specific error handling
<ApiErrorBoundary onRetry={refetch}>
  <DataTable />
</ApiErrorBoundary>
```

### 2. Validation Strategy

- Use server-side validation for security
- Use client-side validation for UX
- Validate on blur for immediate feedback
- Show errors only after user interaction

### 3. Error Messages

- Keep messages user-friendly
- Provide actionable guidance
- Avoid technical jargon
- Include recovery options when possible

### 4. Error Logging

- Log errors with sufficient context
- Include user actions and state
- Respect user privacy
- Monitor error trends and patterns

### 5. Fallback UI

- Provide meaningful fallback content
- Include retry mechanisms
- Maintain visual consistency
- Consider offline scenarios

## Integration Example

Complete example showing all components working together:

```tsx
import React from 'react'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ToastProvider, { useToast } from '@/components/ui/ToastProvider'
import { useFormValidation } from '@/lib/hooks/useFormValidation'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ErrorList } from '@/components/ui/ErrorMessage'
import { projectValidationSchema } from '@/lib/validation'
import { useApiErrorHandler } from '@/lib/api-error-handler'

function ProjectForm() {
  const { showSuccess, showError } = useToast()
  const { handleApiCall } = useApiErrorHandler()
  
  const [formState, formActions] = useFormValidation({
    initialValues: { title: '', description: '' },
    validationSchema: projectValidationSchema,
    validateOnBlur: true
  })

  const handleSubmit = async (values) => {
    await handleApiCall(
      () => fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(values)
      }),
      () => showSuccess('Project created successfully!'),
      (error) => showError(`Failed to create project: ${error.message}`)
    )
  }

  return (
    <ErrorBoundary>
      <form onSubmit={(e) => {
        e.preventDefault()
        formActions.submit(handleSubmit)
      }}>
        {!formState.isValid && formState.submitCount > 0 && (
          <ErrorList
            errors={Object.values(formState.fields)
              .filter(field => field.error && field.touched)
              .map(field => field.error!)
            }
          />
        )}

        <ValidatedInput
          label="Project Title"
          value={formState.fields.title.value}
          onChange={(value) => formActions.setValue('title', value)}
          onBlur={() => formActions.setTouched('title')}
          error={formState.fields.title.error}
          touched={formState.fields.title.touched}
          required
        />

        <button 
          type="submit" 
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <ToastProvider>
      <ProjectForm />
    </ToastProvider>
  )
}
```

This comprehensive error handling system provides robust error management, user-friendly feedback, and detailed logging for debugging and monitoring.