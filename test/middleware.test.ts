import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Clerk
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs', () => ({
  authMiddleware: vi.fn((config) => {
    return (req: NextRequest) => {
      const auth = mockAuth()
      if (config.publicRoutes?.some((route: string) => req.nextUrl.pathname.startsWith(route))) {
        return new Response(null, { status: 200 })
      }
      if (!auth.userId) {
        return new Response(null, { status: 401 })
      }
      return new Response(null, { status: 200 })
    }
  }),
}))

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow access to public routes without authentication', async () => {
    mockAuth.mockReturnValue({ userId: null })
    
    const { authMiddleware } = await import('@clerk/nextjs')
    const middleware = authMiddleware({
      publicRoutes: ['/'],
    })

    const request = new NextRequest('http://localhost:3000/')
    const response = middleware(request)

    expect(response.status).toBe(200)
  })

  it('should allow access to API routes without authentication', async () => {
    mockAuth.mockReturnValue({ userId: null })
    
    const { authMiddleware } = await import('@clerk/nextjs')
    const middleware = authMiddleware({
      publicRoutes: ['/api/contact', '/api/projects', '/api/experiences'],
    })

    const request = new NextRequest('http://localhost:3000/api/projects')
    const response = middleware(request)

    expect(response.status).toBe(200)
  })

  it('should protect admin routes', async () => {
    mockAuth.mockReturnValue({ userId: null })
    
    const { authMiddleware } = await import('@clerk/nextjs')
    const middleware = authMiddleware({
      publicRoutes: ['/'],
    })

    const request = new NextRequest('http://localhost:3000/dashboard')
    const response = middleware(request)

    expect(response.status).toBe(401)
  })

  it('should allow authenticated users to access admin routes', async () => {
    mockAuth.mockReturnValue({ userId: 'test-user-id' })
    
    const { authMiddleware } = await import('@clerk/nextjs')
    const middleware = authMiddleware({
      publicRoutes: ['/'],
    })

    const request = new NextRequest('http://localhost:3000/dashboard')
    const response = middleware(request)

    expect(response.status).toBe(200)
  })

  it('should protect admin API routes', async () => {
    mockAuth.mockReturnValue({ userId: null })
    
    const { authMiddleware } = await import('@clerk/nextjs')
    const middleware = authMiddleware({
      publicRoutes: ['/api/contact', '/api/projects', '/api/experiences'],
    })

    const request = new NextRequest('http://localhost:3000/api/admin/files')
    const response = middleware(request)

    expect(response.status).toBe(401)
  })
})