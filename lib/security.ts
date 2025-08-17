import { NextRequest } from 'next/server'
import { ContactFormData, ProjectFormData, ExperienceFormData } from './types'

// Security configuration for the developer portfolio dashboard
// Using Clerk authentication and NeonDB PostgreSQL
export const SECURITY_CONFIG = {
  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB for projects
    MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB for company logos
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_LOGO_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    MAX_FILES_PER_REQUEST: 1, // Single file upload
  },

  // Rate Limiting Configuration
  RATE_LIMIT: {
    API_REQUESTS_PER_MINUTE: 100,
    CONTACT_FORM_PER_15_MIN: 3, // Contact form submissions
    UPLOAD_REQUESTS_PER_MINUTE: 10,
    ADMIN_API_PER_MINUTE: 200, // Higher limit for admin operations
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

// Validation functions for form data
export function validateProjectData(data: ProjectFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Project title must be at least 3 characters long')
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Project description must be at least 10 characters long')
  }

  if (!data.techStack || data.techStack.length === 0) {
    errors.push('At least one technology must be specified')
  }

  if (data.githubUrl && !isValidUrl(data.githubUrl)) {
    errors.push('GitHub URL must be a valid URL')
  }

  if (data.demoUrl && !isValidUrl(data.demoUrl)) {
    errors.push('Demo URL must be a valid URL')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateContactData(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email address is required')
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateExperienceData(data: ExperienceFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.company || data.company.trim().length < 2) {
    errors.push('Company name must be at least 2 characters long')
  }

  if (!data.position || data.position.trim().length < 2) {
    errors.push('Position title must be at least 2 characters long')
  }

  if (!data.startDate) {
    errors.push('Start date is required')
  }

  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    errors.push('End date cannot be before start date')
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long')
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.push('Location is required')
  }

  if (!data.employmentType) {
    errors.push('Employment type is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    // Only allow http and https protocols
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

// Export the function for use in other modules
export { isValidUrl }

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on[a-zA-Z]+=/gi, '') // Remove event handlers (fixed ReDoS)
    .trim()
}

// Validate file upload for projects
export function validateFileUpload(file: File, isLogo: boolean = false): { valid: boolean; error?: string } {
  const maxSize = isLogo ? SECURITY_CONFIG.UPLOAD.MAX_LOGO_SIZE : SECURITY_CONFIG.UPLOAD.MAX_FILE_SIZE
  const allowedTypes = isLogo ? SECURITY_CONFIG.UPLOAD.ALLOWED_LOGO_TYPES : SECURITY_CONFIG.UPLOAD.ALLOWED_TYPES

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  // Additional validation for file name
  if (file.name.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (maximum 255 characters)'
    }
  }

  return { valid: true }
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  // Use crypto.getRandomValues for secure random generation
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length)
    }
    return result
  }
  
  // Fallback for environments without crypto (should not be used in production)
  console.warn('Using insecure random generation - crypto.getRandomValues not available')
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
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.dev https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://clerk.dev https://*.clerk.accounts.dev https://*.neon.tech;",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

// Utility to generate secure file names
export function generateSecureFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = generateSecureToken(8)
  const extension = originalName.split('.').pop()?.toLowerCase() || ''
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

  return `${baseName}-${timestamp}-${randomString}.${extension}`
}

// SQL injection prevention helper
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/['";\\]/g, '') // Remove SQL injection characters
    .replace(/--+/g, '') // Remove SQL comments (fixed multi-character)
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove SQL block comments (complete pattern)
    .replace(/union\s+select/gi, '') // Remove UNION SELECT attempts
    .replace(/drop\s+table/gi, '') // Remove DROP TABLE attempts
    .trim()
}