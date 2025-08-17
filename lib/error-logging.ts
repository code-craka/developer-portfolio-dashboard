// Error logging and monitoring utilities for the developer portfolio dashboard
// Provides comprehensive error tracking and reporting capabilities

export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  context?: Record<string, any>
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
}

export interface ErrorMetrics {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsByPage: Record<string, number>
  recentErrors: ErrorLog[]
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 1000 // Keep last 1000 errors in memory
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  private generateSessionId(): string {
    // Use crypto.randomUUID() for secure random session ID generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `session_${Date.now()}_${crypto.randomUUID()}`
    }
    // Fallback for environments without crypto.randomUUID
    const array = new Uint8Array(16)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array)
      return `session_${Date.now()}_${Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')}`
    }
    // Last resort fallback (should not be used in production)
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  private setupGlobalErrorHandlers() {
    // Only set up browser-specific error handlers on the client side
    if (typeof window === 'undefined') return
    
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript_error'
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: {
          type: 'unhandled_promise_rejection',
          reason: event.reason
        }
      })
    })

    // Handle React error boundary errors (will be called from ErrorBoundary)
    window.addEventListener('react-error', ((event: CustomEvent) => {
      this.logError({
        message: event.detail.error.message,
        stack: event.detail.error.stack,
        context: {
          type: 'react_error',
          componentStack: event.detail.errorInfo?.componentStack,
          errorBoundary: event.detail.errorBoundary
        }
      })
    }) as EventListener)
  }

  logError({
    message,
    stack,
    context = {},
    level = 'error'
  }: {
    message: string
    stack?: string
    context?: Record<string, any>
    level?: 'error' | 'warning' | 'info'
  }) {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      stack,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      sessionId: this.sessionId
    }

    // Add to in-memory logs
    this.logs.unshift(errorLog)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog)
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorLog)
    }

    // Store in localStorage for persistence
    this.persistError(errorLog)

    return errorLog
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  private async sendToMonitoringService(errorLog: ErrorLog) {
    try {
      // This would integrate with services like Sentry, LogRocket, Bugsnag, etc.
      // For now, we'll use a simple endpoint that could be implemented later
      
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog)
      })

      if (!response.ok) {
        console.warn('Failed to send error to monitoring service:', response.statusText)
      }
    } catch (error) {
      console.warn('Error sending to monitoring service:', error)
    }
  }

  private persistError(errorLog: ErrorLog) {
    try {
      const stored = localStorage.getItem('error_logs')
      const logs = stored ? JSON.parse(stored) : []
      
      logs.unshift(errorLog)
      
      // Keep only last 50 errors in localStorage
      const trimmedLogs = logs.slice(0, 50)
      
      localStorage.setItem('error_logs', JSON.stringify(trimmedLogs))
    } catch (error) {
      console.warn('Failed to persist error to localStorage:', error)
    }
  }

  // API error logging
  logApiError({
    endpoint,
    method,
    status,
    statusText,
    responseBody,
    requestBody,
    context = {}
  }: {
    endpoint: string
    method: string
    status: number
    statusText: string
    responseBody?: any
    requestBody?: any
    context?: Record<string, any>
  }) {
    return this.logError({
      message: `API Error: ${method} ${endpoint} - ${status} ${statusText}`,
      context: {
        type: 'api_error',
        endpoint,
        method,
        status,
        statusText,
        responseBody,
        requestBody,
        ...context
      },
      level: status >= 500 ? 'error' : 'warning'
    })
  }

  // Form validation error logging
  logValidationError({
    form,
    field,
    value,
    error,
    context = {}
  }: {
    form: string
    field: string
    value: any
    error: string
    context?: Record<string, any>
  }) {
    return this.logError({
      message: `Validation Error: ${form}.${field} - ${error}`,
      context: {
        type: 'validation_error',
        form,
        field,
        value: typeof value === 'string' ? value.substring(0, 100) : value, // Truncate long values
        error,
        ...context
      },
      level: 'warning'
    })
  }

  // User action error logging
  logUserActionError({
    action,
    error,
    context = {}
  }: {
    action: string
    error: string | Error
    context?: Record<string, any>
  }) {
    const errorMessage = error instanceof Error ? error.message : error
    const stack = error instanceof Error ? error.stack : undefined

    return this.logError({
      message: `User Action Error: ${action} - ${errorMessage}`,
      stack,
      context: {
        type: 'user_action_error',
        action,
        ...context
      }
    })
  }

  // Get error metrics
  getMetrics(): ErrorMetrics {
    const errorsByType: Record<string, number> = {}
    const errorsByPage: Record<string, number> = {}

    this.logs.forEach(log => {
      // Count by type
      const type = log.context?.type || 'unknown'
      errorsByType[type] = (errorsByType[type] || 0) + 1

      // Count by page
      if (log.url) {
        try {
          const url = new URL(log.url)
          const page = url.pathname
          errorsByPage[page] = (errorsByPage[page] || 0) + 1
        } catch {
          errorsByPage['unknown'] = (errorsByPage['unknown'] || 0) + 1
        }
      }
    })

    return {
      totalErrors: this.logs.length,
      errorsByType,
      errorsByPage,
      recentErrors: this.logs.slice(0, 10) // Last 10 errors
    }
  }

  // Get all logs
  getLogs(limit?: number): ErrorLog[] {
    return limit ? this.logs.slice(0, limit) : [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
    localStorage.removeItem('error_logs')
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString(),
      logs: this.logs
    }, null, 2)
  }

  // Load persisted logs on initialization
  loadPersistedLogs() {
    try {
      const stored = localStorage.getItem('error_logs')
      if (stored) {
        const logs = JSON.parse(stored)
        this.logs = [...logs, ...this.logs]
      }
    } catch (error) {
      console.warn('Failed to load persisted error logs:', error)
    }
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger()

// Initialize persisted logs
if (typeof window !== 'undefined') {
  errorLogger.loadPersistedLogs()
}

// Utility functions for common error scenarios
export const logError = (message: string, context?: Record<string, any>) => {
  return errorLogger.logError({ message, context })
}

export const logApiError = (params: Parameters<typeof errorLogger.logApiError>[0]) => {
  return errorLogger.logApiError(params)
}

export const logValidationError = (params: Parameters<typeof errorLogger.logValidationError>[0]) => {
  return errorLogger.logValidationError(params)
}

export const logUserActionError = (params: Parameters<typeof errorLogger.logUserActionError>[0]) => {
  return errorLogger.logUserActionError(params)
}

// React hook for error logging
export function useErrorLogger() {
  const logComponentError = React.useCallback((error: Error, errorInfo?: any) => {
    errorLogger.logError({
      message: error.message,
      stack: error.stack,
      context: {
        type: 'component_error',
        componentStack: errorInfo?.componentStack
      }
    })
  }, [])

  const logFormError = React.useCallback((form: string, field: string, error: string, value?: any) => {
    errorLogger.logValidationError({ form, field, error, value })
  }, [])

  const logActionError = React.useCallback((action: string, error: string | Error, context?: Record<string, any>) => {
    errorLogger.logUserActionError({ action, error, context })
  }, [])

  return {
    logError: errorLogger.logError.bind(errorLogger),
    logComponentError,
    logFormError,
    logActionError,
    getMetrics: errorLogger.getMetrics.bind(errorLogger),
    getLogs: errorLogger.getLogs.bind(errorLogger)
  }
}

// Custom event for React error boundaries
export function dispatchReactError(error: Error, errorInfo: any, errorBoundary?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('react-error', {
      detail: { error, errorInfo, errorBoundary }
    }))
  }
}

import React from 'react'

export default errorLogger