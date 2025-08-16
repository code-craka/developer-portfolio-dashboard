import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Clerk
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs', () => ({
  auth: mockAuth,
  currentUser: vi.fn(),
}))

describe('Clerk Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('requireAdminAuth', () => {
    it('should return auth data for authenticated user', async () => {
      mockAuth.mockReturnValue({
        userId: 'test-user-id',
        sessionId: 'test-session-id',
      })

      const { requireAdminAuth } = await import('@/lib/clerk')
      const auth = requireAdminAuth()

      expect(auth.userId).toBe('test-user-id')
      expect(auth.sessionId).toBe('test-session-id')
    })

    it('should throw error for unauthenticated user', async () => {
      mockAuth.mockReturnValue({
        userId: null,
        sessionId: null,
      })

      const { requireAdminAuth } = await import('@/lib/clerk')
      
      expect(() => requireAdminAuth()).toThrow('Unauthorized')
    })
  })

  describe('getOptionalAuth', () => {
    it('should return auth data when user is authenticated', async () => {
      mockAuth.mockReturnValue({
        userId: 'test-user-id',
        sessionId: 'test-session-id',
      })

      const { getOptionalAuth } = await import('@/lib/clerk')
      const auth = getOptionalAuth()

      expect(auth.userId).toBe('test-user-id')
      expect(auth.sessionId).toBe('test-session-id')
    })

    it('should return null values when user is not authenticated', async () => {
      mockAuth.mockReturnValue({
        userId: null,
        sessionId: null,
      })

      const { getOptionalAuth } = await import('@/lib/clerk')
      const auth = getOptionalAuth()

      expect(auth.userId).toBeNull()
      expect(auth.sessionId).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true for authenticated user', async () => {
      mockAuth.mockReturnValue({
        userId: 'test-user-id',
      })

      const { isAuthenticated } = await import('@/lib/clerk')
      const result = isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false for unauthenticated user', async () => {
      mockAuth.mockReturnValue({
        userId: null,
      })

      const { isAuthenticated } = await import('@/lib/clerk')
      const result = isAuthenticated()

      expect(result).toBe(false)
    })
  })
})