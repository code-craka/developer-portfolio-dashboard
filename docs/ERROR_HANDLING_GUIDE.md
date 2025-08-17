# Error Handling and Logging Guide

This guide covers the comprehensive error handling and logging system implemented in the Developer Portfolio Dashboard.

## Overview

The application includes a robust error logging system (`lib/error-logging.ts`) that provides comprehensive error tracking, monitoring, and debugging capabilities with enterprise-grade security features.

## Key Features

### 🔒 Security Enhancements
- **Cryptographically Secure Session IDs**: Uses `crypto.randomUUID()` for secure session tracking
- **Multiple Fallback Layers**: Secure random number generation with graceful degradation
- **Session Correlation**: All errors are tracked with unique, secure session identifiers
- **Data Sanitization**: Sensitive data is automatically sanitized in error logs

### 📊 Comprehensive Error Tracking
- **Automatic Error Capture**: Catches unhandled JavaScript errors and promise rejections
- **API Error Logging**: Detailed tracking of API failures with request/response context
- **Validation Error Monitoring**: Form validation failures with field-level details
- **User Action Tracking**: User interaction errors with behavioral context
- **Component Error Boundaries**: React error boundary integration

### 🔍 Advanced Monitoring
- **Real-time Metrics**: Error frequency, distribution, and trend analysis
- **Performance Impact**: Error correlation with performance metrics
- **Persistent Storage**: Local storage backup for offline debugging
- **Export Capabilities**: Full error log export for analysis

## Implementation Details

### Session ID Generation

The system uses a multi-layered approach for secure session ID generation:

```typescript
private generateSessionId(): string {
  // Primary: Use crypto.randomUUID() for secure random session ID generation
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `session_${Date.now()}_${crypto.randomUUID()}`
  }
  
  // Fallback: Use crypto.getRandomValues for secure random bytes
  const array = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
    return `session_${Date.now()}_${Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')).join('')}`
  }
  
  // Last resort: Math.random (development only)
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
```

**Security Benefits:**
- **Cryptographic Strength**: Uses browser's secure random number generator
- **Uniqueness Guarantee**: Combines timestamp with UUID for global uniqueness
- **Fallback Safety**: Multiple layers ensure functionality across all environments
- **Production Ready**: Secure by default with development-only fallbacks

### Error Types and Context

The system categorizes errors into specific types for better analysis:

#### 1. JavaScript Errors
```typescript
{
  type: 'javascript_error',
  filename: 'script.js',
  lineno: 42,
  colno: 15,
  message: 'TypeError: Cannot read property...'
}
```

#### 2. API Errors
```typescript
{
  type: 'api_error',
  endpoint: '/api/projects',
  method: 'POST',
  status: 500,
  statusText: 'Internal Server Error',
  requestBody: { /* sanitized request */ },
  responseBody: { /* error response */ }
}
```

#### 3. Validation Errors
```typescript
{
  type: 'validation_error',
  form: 'project-form',
  field: 'title',
  value: 'ab', // truncated if too long
  error: 'Title must be at least 3 characters'
}
```

#### 4. User Action Errors
```typescript
{
  type: 'user_action_error',
  action: 'project_creation',
  context: {
    projectId: 123,
    step: 'image_upload',
    userAgent: 'Mozilla/5.0...'
  }
}
```

## Usage Examples

### Basic Error Logging

```typescript
import { logError } from '@/lib/error-logging'

// Simple error logging
logError('Something went wrong', { 
  component: 'ProjectForm',
  userId: 'user123' 
})
```

### API Error Logging

```typescript
import { logApiError } from '@/lib/error-logging'

try {
  const response = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
  })
  
  if (!response.ok) {
    logApiError({
      endpoint: '/api/projects',
      method: 'POST',
      status: response.status,
      statusText: response.statusText,
      requestBody: projectData,
      responseBody: await response.json()
    })
  }
} catch (error) {
  logError('Network error', { error: error.message })
}
```

### React Hook Usage

```typescript
import { useErrorLogger } from '@/lib/error-logging'

function ProjectForm() {
  const { logFormError, logActionError } = useErrorLogger()
  
  const handleSubmit = async (data) => {
    try {
      await createProject(data)
    } catch (error) {
      logActionError('project_creation', error, {
        formData: data,
        timestamp: Date.now()
      })
    }
  }
  
  const handleValidationError = (field, error, value) => {
    logFormError('project-form', field, error, value)
  }
  
  return (
    // Form JSX
  )
}
```

### Error Boundary Integration

```typescript
import { dispatchReactError } from '@/lib/error-logging'

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Dispatch to error logging system
    dispatchReactError(error, errorInfo, 'ProjectFormBoundary')
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

## Error Metrics and Analysis

### Getting Error Metrics

```typescript
import { errorLogger } from '@/lib/error-logging'

const metrics = errorLogger.getMetrics()
console.log({
  totalErrors: metrics.totalErrors,
  errorsByType: metrics.errorsByType,
  errorsByPage: metrics.errorsByPage,
  recentErrors: metrics.recentErrors
})
```

### Example Metrics Output

```json
{
  "totalErrors": 15,
  "errorsByType": {
    "api_error": 8,
    "validation_error": 4,
    "javascript_error": 2,
    "user_action_error": 1
  },
  "errorsByPage": {
    "/admin/projects": 10,
    "/admin/dashboard": 3,
    "/": 2
  },
  "recentErrors": [
    {
      "id": "error_1642234567890_abc123",
      "timestamp": "2025-01-15T10:30:00.000Z",
      "level": "error",
      "message": "API Error: POST /api/projects - 500",
      "sessionId": "session_1642234567890_550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

## Production Integration

### Monitoring Service Integration

The system is designed to integrate with external monitoring services:

```typescript
// Example integration with Sentry
private async sendToMonitoringService(errorLog: ErrorLog) {
  if (process.env.NODE_ENV === 'production') {
    try {
      // Send to Sentry, LogRocket, Bugsnag, etc.
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog)
      })
    } catch (error) {
      console.warn('Failed to send error to monitoring service:', error)
    }
  }
}
```

### Server-Side Error Collection

Create an API endpoint to collect client-side errors:

```typescript
// app/api/errors/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const errorLog = await request.json()
    
    // Store in database or forward to monitoring service
    await storeErrorLog(errorLog)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    )
  }
}
```

## Configuration Options

### Environment Variables

```bash
# Error logging configuration
ERROR_LOGGING_ENABLED=true
ERROR_LOGGING_LEVEL=error
ERROR_MONITORING_ENDPOINT=/api/errors
MAX_ERROR_LOGS=1000
PERSIST_ERRORS_LOCALLY=true
```

### Runtime Configuration

```typescript
// Configure error logger
errorLogger.configure({
  maxLogs: 1000,
  enablePersistence: true,
  enableMonitoring: process.env.NODE_ENV === 'production',
  logLevel: 'error'
})
```

## Best Practices

### 1. Error Context
Always provide meaningful context with errors:

```typescript
// Good
logError('Failed to save project', {
  projectId: project.id,
  userId: user.id,
  action: 'save',
  formData: sanitizedFormData
})

// Avoid
logError('Error occurred')
```

### 2. Sensitive Data Handling
Never log sensitive information:

```typescript
// Good - sanitized
logApiError({
  endpoint: '/api/auth/login',
  requestBody: { email: user.email, password: '[REDACTED]' }
})

// Avoid - exposes sensitive data
logApiError({
  requestBody: { email: user.email, password: user.password }
})
```

### 3. Error Categorization
Use consistent error types and categories:

```typescript
// Consistent categorization
logError('Validation failed', { 
  type: 'validation_error',
  form: 'project-form',
  field: 'title'
})
```

### 4. Performance Considerations
Avoid logging in tight loops or high-frequency operations:

```typescript
// Good - throttled logging
const throttledLogger = throttle(logError, 1000)

// Avoid - excessive logging
array.forEach(item => {
  logError('Processing item', { item }) // Called for every item
})
```

## Debugging and Troubleshooting

### Exporting Error Logs

```typescript
// Export all logs for analysis
const exportedLogs = errorLogger.exportLogs()
console.log(exportedLogs)

// Download as file
const blob = new Blob([exportedLogs], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'error-logs.json'
a.click()
```

### Clearing Error Logs

```typescript
// Clear all logs (development only)
if (process.env.NODE_ENV === 'development') {
  errorLogger.clearLogs()
}
```

### Local Storage Inspection

Error logs are automatically persisted in localStorage:

```javascript
// Browser console
const logs = JSON.parse(localStorage.getItem('error_logs') || '[]')
console.table(logs)
```

## Security Considerations

### 1. Session ID Security
- Uses cryptographically secure random number generation
- Unique session IDs prevent correlation attacks
- Fallback mechanisms ensure functionality without compromising security

### 2. Data Sanitization
- Automatic truncation of long values
- Sensitive field detection and redaction
- PII filtering in error contexts

### 3. Storage Security
- Local storage encryption (if available)
- Automatic cleanup of old logs
- Size limits to prevent storage exhaustion

### 4. Network Security
- HTTPS-only transmission in production
- Request validation and rate limiting
- Authentication for error collection endpoints

## Migration and Upgrades

### From Previous Versions
If upgrading from a version without secure session IDs:

1. Clear existing error logs: `errorLogger.clearLogs()`
2. Update error collection endpoints to handle new session ID format
3. Update monitoring service integration if applicable

### Future Enhancements
The system is designed for extensibility:

- Additional error types and categories
- Enhanced metrics and analytics
- Real-time error streaming
- Machine learning-based error prediction
- Integration with APM tools

## Support and Resources

- **Error Logging Source**: `lib/error-logging.ts`
- **React Hook**: `useErrorLogger()` for component integration
- **API Endpoint**: `POST /api/errors` for server collection
- **Documentation**: This guide and inline code comments
- **Examples**: See `components/admin/EnhancedProjectModal.tsx` for usage examples

For additional support or feature requests, please refer to the project's GitHub repository.