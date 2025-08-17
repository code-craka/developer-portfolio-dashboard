/**
 * Environment configuration and validation
 * Ensures all required environment variables are present and valid
 */

interface EnvironmentConfig {
  // Application
  NODE_ENV: 'development' | 'production' | 'test'
  APP_URL: string
  
  // Database
  DATABASE_URL: string
  DATABASE_AUTHENTICATED_URL?: string
  
  // Authentication
  CLERK_PUBLISHABLE_KEY: string
  CLERK_SECRET_KEY: string
  CLERK_WEBHOOK_SECRET?: string
  
  // Upload
  MAX_FILE_SIZE: number
  UPLOAD_DIR: string
  
  // Security
  SESSION_SECRET?: string
  ENCRYPTION_KEY?: string
  
  // Performance
  ENABLE_ANALYTICS: boolean
  ENABLE_PERFORMANCE_MONITORING: boolean
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  
  // Rate Limiting
  RATE_LIMIT_MAX: number
  RATE_LIMIT_WINDOW: number
  
  // CDN
  CDN_URL?: string
}

/**
 * Parse and validate environment variables
 */
function parseEnvConfig(): EnvironmentConfig {
  const requiredVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
  ]

  // Check for required variables
  const missing = requiredVars.filter(key => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    
    DATABASE_URL: process.env.DATABASE_URL!,
    DATABASE_AUTHENTICATED_URL: process.env.DATABASE_AUTHENTICATED_URL,
    
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'public/uploads/projects',
    
    SESSION_SECRET: process.env.SESSION_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
    ENABLE_PERFORMANCE_MONITORING: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
    LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'info',
    
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '60'),
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
    
    CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  }
}

/**
 * Validate environment configuration
 */
function validateConfig(config: EnvironmentConfig): void {
  // Validate URLs
  try {
    new URL(config.APP_URL)
  } catch {
    throw new Error(`Invalid APP_URL: ${config.APP_URL}`)
  }

  // Validate database URL
  if (!config.DATABASE_URL.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection string')
  }

  // Validate file size limits
  if (config.MAX_FILE_SIZE <= 0 || config.MAX_FILE_SIZE > 10 * 1024 * 1024) {
    throw new Error('MAX_FILE_SIZE must be between 1 byte and 10MB')
  }

  // Validate rate limiting
  if (config.RATE_LIMIT_MAX <= 0 || config.RATE_LIMIT_WINDOW <= 0) {
    throw new Error('Rate limiting values must be positive numbers')
  }

  // Production-specific validations
  if (config.NODE_ENV === 'production') {
    if (!config.SESSION_SECRET || config.SESSION_SECRET.length < 32) {
      console.warn('SESSION_SECRET should be at least 32 characters in production')
    }
    
    if (!config.ENCRYPTION_KEY || config.ENCRYPTION_KEY.length !== 32) {
      console.warn('ENCRYPTION_KEY should be exactly 32 characters in production')
    }
    
    if (config.APP_URL.includes('localhost')) {
      console.warn('APP_URL should not contain localhost in production')
    }
  }
}

// Parse and validate configuration
let envConfig: EnvironmentConfig

try {
  envConfig = parseEnvConfig()
  validateConfig(envConfig)
} catch (error) {
  console.error('Environment configuration error:', error)
  process.exit(1)
}

export { envConfig }
export type { EnvironmentConfig }

/**
 * Helper functions for environment-specific behavior
 */
export const isProduction = () => envConfig.NODE_ENV === 'production'
export const isDevelopment = () => envConfig.NODE_ENV === 'development'
export const isTest = () => envConfig.NODE_ENV === 'test'

/**
 * Get database connection string based on environment
 */
export const getDatabaseUrl = () => {
  if (isProduction() && envConfig.DATABASE_AUTHENTICATED_URL) {
    return envConfig.DATABASE_AUTHENTICATED_URL
  }
  return envConfig.DATABASE_URL
}

/**
 * Get CDN URL or fallback to app URL
 */
export const getAssetUrl = (path: string) => {
  const baseUrl = envConfig.CDN_URL || envConfig.APP_URL
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Environment-specific logging
 */
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (envConfig.LOG_LEVEL === 'debug') {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },
  info: (message: string, ...args: any[]) => {
    if (['debug', 'info'].includes(envConfig.LOG_LEVEL)) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(envConfig.LOG_LEVEL)) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
}

export default envConfig