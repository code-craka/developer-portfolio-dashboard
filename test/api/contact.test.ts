import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/contact/route'
import { PUT, DELETE } from '@/app/api/contact/[id]/route'
import { NextRequest } from 'next/server'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn(),
  },
}))

// Mock Clerk auth
vi.mock('@clerk/nextjs', () => ({
  auth: () => ({
    userId: 'test-user-id',
    sessionId: 'test-session-id',
  }),
}))

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/contact', () => {
    it('should return all contact messages for admin', async () => {
      const { db } = await import('@/lib/db')
      const mockMessages = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello, I would like to work with you!',
          read: false,
          created_at: new Date(),
        },
      ]

      vi.mocked(db.execute).mockResolvedValue({ rows: mockMessages })

      const request = new NextRequest('http://localhost:3000/api/contact')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('John Doe')
    })
  })

  describe('POST /api/contact', () => {
    it('should create a new contact message', async () => {
      const { db } = await import('@/lib/db')
      const newMessage = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'I am interested in your services. Please contact me.',
      }

      const mockCreatedMessage = {
        id: 2,
        ...newMessage,
        read: false,
        created_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockCreatedMessage] })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(newMessage),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Message sent successfully')
    })

    it('should reject invalid contact message', async () => {
      const invalidMessage = {
        name: '',
        email: 'invalid-email',
        message: 'Hi', // Too short
      }

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidMessage),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Name is required')
    })
  })

  describe('PUT /api/contact/[id]', () => {
    it('should mark message as read', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [{ id: 1 }] })

      const request = new NextRequest('http://localhost:3000/api/contact/1', {
        method: 'PUT',
        body: JSON.stringify({ read: true }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('DELETE /api/contact/[id]', () => {
    it('should delete a contact message', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [{ id: 1 }] })

      const request = new NextRequest('http://localhost:3000/api/contact/1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})