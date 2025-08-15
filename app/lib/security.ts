import { NextRequest } from 'next/server'

// Security configuration
export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT: {
    SECRET_MIN_LENGTH: 32,
    EXPIRES_IN: '7d',
    ALGORITHM: 'HS256' as const,
  },
  
  // Password Configuration
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SALT_ROUNDS: 12,
  },
  
  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    MAX_FILES_PER_REQUEST: 5,
  },
  
  // Rate Limiting Configuration
  RATE_LIMIT: {
    API_REQUESTS_PER_MINUTE: 100,
    AUTH_ATTEMPTS_PER_15_MIN: 5,
    UPLOAD_REQUESTS_PER_MINUTE: 10,
  },
  
  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  }
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD.MIN_LENGTH} characters long`)
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Validate file upload
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (file.size > SECURITY_CONFIG.UPLOAD.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${SECURITY_CONFIG.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }
  
  if (!SECURITY_CONFIG.UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${SECURITY_CONFIG.UPLOAD.ALLOWED_TYPES.join(', ')}`
    }
  }
  
  return { valid: true }
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// Check if request is from allowed origin
export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  
  if (!origin) {
    // Allow requests without origin (same-origin requests)
    return true
  }
  
  return SECURITY_CONFIG.CORS.ALLOWED_ORIGINS.includes(origin)
}

// Security headers for API responses
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}