// Enhanced API error handling utilities for the developer portfolio dashboard
// Provides comprehensive error handling for API requests and responses

import { NextRequest, NextResponse } from 'next/server'
import { SECURITY_HEADERS } from './security'
import { ApiResponse, ErrorResponse } from './types'

export class ApiError extends Error {
  status?: number
  code?: string
  details?: any

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public query?: string,
    public params?: any[]
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class FileUploadError extends Error {
  constructor(
    message: string,
    public filename?: string,
    public fileSize?: number
  ) {
    super(message)
    this.name = 'FileUploadError'
  }
}

export class RateLimitError extends Error {
  constructor(
    message = 'Rate limit exceeded',
    public retryAfter?: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Error status code mapping
const ERROR_STATUS_MAP: Record<string, number> = {
  ValidationError: 400,
  AuthenticationError: 401,
  AuthorizationError: 403,
  RateLimitError: 429,
  DatabaseError: 500,
  FileUploadError: 400
}

// User-friendly error messages
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  ValidationError: 'Please check your input and try again.',
  AuthenticationError: 'Please sign in to continue.',
  AuthorizationError: 'You don\'t have permission to perform this action.',
  RateLimitError: 'Too many requests. Please wait a moment and try again.',
  DatabaseError: 'We\'re experiencing technical difficulties. Please try again later.',
  FileUploadError: 'There was a problem with your file upload. Please try again.',
  NetworkError: 'Network connection error. Please check your internet connection.',
  TimeoutError: 'Request timed out. Please try again.',
  ServerError: 'Server error. Please try again later.'
}

// API error handler wrapper for route handlers
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Main API error handler
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  const headers = new Headers(SECURITY_HEADERS)
  headers.set('Content-Type', 'application/json')

  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: error.message,
      code: 'VALIDATION_ERROR',
      details: {
        field: error.field,
        value: error.value
      }
    }, { 
      status: 400,
      headers 
    })
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: error.message,
      code: 'AUTHENTICATION_ERROR'
    }, { 
      status: 401,
      headers 
    })
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: error.message,
      code: 'AUTHORIZATION_ERROR'
    }, { 
      status: 403,
      headers 
    })
  }

  if (error instanceof RateLimitError) {
    if (error.retryAfter) {
      headers.set('Retry-After', error.retryAfter.toString())
    }
    
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: error.message,
      code: 'RATE_LIMIT_ERROR'
    }, { 
      status: 429,
      headers 
    })
  }

  if (error instanceof DatabaseError) {
    // Don't expose database details in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Database operation failed'
    
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: message,
      code: 'DATABASE_ERROR',
      details: process.env.NODE_ENV === 'development' ? {
        query: error.query,
        params: error.params
      } : undefined
    }, { 
      status: 500,
      headers 
    })
  }

  if (error instanceof FileUploadError) {
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: error.message,
      code: 'FILE_UPLOAD_ERROR',
      details: {
        filename: error.filename,
        fileSize: error.fileSize
      }
    }, { 
      status: 400,
      headers 
    })
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    const status = ERROR_STATUS_MAP[error.name] || 500
    const userMessage = USER_FRIENDLY_MESSAGES[error.name] || 'An unexpected error occurred'
    
    return NextResponse.json<ErrorResponse>({
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : userMessage,
      code: error.name.toUpperCase(),
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack
      } : undefined
    }, { 
      status,
      headers 
    })
  }

  // Handle unknown errors
  return NextResponse.json<ErrorResponse>({
    success: false,
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  }, { 
    status: 500,
    headers 
  })
}

// Client-side API error handler
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      let errorData: any = {}
      
      if (isJson) {
        try {
          errorData = await response.json()
        } catch {
          // Ignore JSON parsing errors
        }
      }

      const error = new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
      error.status = response.status
      error.code = errorData.code
      error.details = errorData.details

      throw error
    }

    if (isJson) {
      return response.json()
    }

    return response.text() as any
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    })

    return this.handleResponse<T>(response)
  }

  async upload<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
      ...options
    })

    return this.handleResponse<T>(response)
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// React hook for API error handling
export function useApiErrorHandler() {
  const [error, setError] = React.useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleApiCall = React.useCallback(async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: ApiError) => void
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await apiCall()
      onSuccess?.(result)
      
      return result
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(
        err instanceof Error ? err.message : 'Unknown error'
      )
      
      setError(apiError)
      onError?.(apiError)
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const retry = React.useCallback(async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void
  ): Promise<T | null> => {
    return handleApiCall(apiCall, onSuccess)
  }, [handleApiCall])

  return {
    error,
    isLoading,
    handleApiCall,
    clearError,
    retry
  }
}

// Utility function to get user-friendly error message
export function getUserFriendlyErrorMessage(error: ApiError | Error): string {
  if ('code' in error && error.code) {
    return USER_FRIENDLY_MESSAGES[error.code] || error.message
  }
  
  return USER_FRIENDLY_MESSAGES[error.name] || error.message || 'An unexpected error occurred'
}

// Utility function to check if error is retryable
export function isRetryableError(error: ApiError | Error): boolean {
  if ('status' in error) {
    // Don't retry client errors (4xx) except for rate limiting
    if (error.status && error.status >= 400 && error.status < 500) {
      return error.status === 429 // Rate limit
    }
    
    // Retry server errors (5xx) and network errors
    return !error.status || error.status >= 500
  }
  
  // Retry network and timeout errors
  return error.name === 'NetworkError' || error.name === 'TimeoutError'
}

import React from 'react'

export default {
  withErrorHandler,
  handleApiError,
  ApiClient,
  apiClient,
  useApiErrorHandler,
  getUserFriendlyErrorMessage,
  isRetryableError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
  FileUploadError,
  RateLimitError
}