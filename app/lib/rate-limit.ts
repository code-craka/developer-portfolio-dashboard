import { NextRequest } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.config.interval

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || []
    
    // Filter out requests outside the current window
    const validRequests = requests.filter(time => time > windowStart)
    
    // Check if limit exceeded
    const success = validRequests.length < this.config.uniqueTokenPerInterval
    
    if (success) {
      // Add current request
      validRequests.push(now)
      this.requests.set(identifier, validRequests)
    }

    return {
      success,
      limit: this.config.uniqueTokenPerInterval,
      remaining: Math.max(0, this.config.uniqueTokenPerInterval - validRequests.length),
      reset: windowStart + this.config.interval
    }
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > now - this.config.interval)
      if (validRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, validRequests)
      }
    }
  }
}

// Create rate limiters for different endpoints
export const apiRateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100 // 100 requests per minute for public API
})

export const adminApiRateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 200 // 200 requests per minute for admin operations
})

export const contactFormRateLimit = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 3 // 3 contact form submissions per 15 minutes
})

export const uploadRateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10 // 10 uploads per minute
})

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for production behind proxy)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback to connection IP
  return request.ip || 'unknown'
}

// Middleware helper for rate limiting
export function withRateLimit(
  rateLimiter: RateLimiter,
  request: NextRequest
): RateLimitResult {
  const identifier = getClientIdentifier(request)
  return rateLimiter.check(identifier)
}

// Cleanup function to be called periodically
setInterval(() => {
  apiRateLimit.cleanup()
  adminApiRateLimit.cleanup()
  contactFormRateLimit.cleanup()
  uploadRateLimit.cleanup()
}, 5 * 60 * 1000) // Cleanup every 5 minutes