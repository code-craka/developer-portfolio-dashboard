import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withRateLimit, apiRateLimit, adminApiRateLimit, contactFormRateLimit, uploadRateLimit } from './app/lib/rate-limit'
import { SECURITY_HEADERS } from './app/lib/security'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    let rateLimiter = apiRateLimit
    
    // Choose appropriate rate limiter based on endpoint
    if (request.nextUrl.pathname.startsWith('/api/contact')) {
      rateLimiter = contactFormRateLimit
    } else if (request.nextUrl.pathname.startsWith('/api/upload')) {
      rateLimiter = uploadRateLimit
    } else if (request.nextUrl.pathname.includes('/admin/') || 
               request.nextUrl.pathname.startsWith('/api/projects') ||
               request.nextUrl.pathname.startsWith('/api/experiences')) {
      // Admin operations get higher rate limits
      rateLimiter = adminApiRateLimit
    }
    
    const rateLimitResult = withRateLimit(rateLimiter, request)
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())
    
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            ...SECURITY_HEADERS
          }
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}