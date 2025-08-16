import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/experiences/route'
import { PUT, DELETE } from '@/app/api/experiences/[id]/route'
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

describe('/api/experiences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/experiences', () => {
    it('should return all experiences sorted by start date', async () => {
      const { db } = await import('@/lib/db')
      const mockExperiences = [
        {
          id: 1,
          company: 'Test Company',
          position: 'Software Developer',
          start_date: '2023-01-01',
          end_date: null,
          description: 'Working on amazing projects',
          achievements: ['Built features'],
          technologies: ['React', 'Node.js'],
          company_logo: '/uploads/companies/test.png',
          location: 'Remote',
          employment_type: 'Full-time',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      vi.mocked(db.execute).mockResolvedValue({ rows: mockExperiences })

      const request = new NextRequest('http://localhost:3000/api/experiences')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0].company).toBe('Test Company')
    })
  })

  describe('POST /api/experiences', () => {
    it('should create a new experience', async () => {
      const { db } = await import('@/lib/db')
      const newExperience = {
        company: 'New Company',
        position: 'Senior Developer',
        startDate: '2024-01-01',
        endDate: null,
        description: 'Leading development team',
        achievements: ['Improved performance', 'Mentored juniors'],
        technologies: ['React', 'TypeScript', 'PostgreSQL'],
        location: 'San Francisco',
        employmentType: 'Full-time',
      }

      const mockCreatedExperience = {
        id: 2,
        ...newExperience,
        start_date: newExperience.startDate,
        end_date: newExperience.endDate,
        employment_type: newExperience.employmentType,
        created_at: new Date(),
        updated_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockCreatedExperience] })

      const request = new NextRequest('http://localhost:3000/api/experiences', {
        method: 'POST',
        body: JSON.stringify(newExperience),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.experience.company).toBe('New Company')
    })

    it('should reject invalid experience data', async () => {
      const invalidExperience = {
        company: '', // Empty company should be rejected
        position: 'Developer',
        startDate: '2024-01-01',
        description: 'Working',
        achievements: [],
        technologies: [],
        location: 'Remote',
        employmentType: 'Full-time',
      }

      const request = new NextRequest('http://localhost:3000/api/experiences', {
        method: 'POST',
        body: JSON.stringify(invalidExperience),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Company name is required')
    })
  })

  describe('PUT /api/experiences/[id]', () => {
    it('should update an existing experience', async () => {
      const { db } = await import('@/lib/db')
      const updates = {
        position: 'Lead Developer',
        endDate: '2024-12-31',
      }

      const mockUpdatedExperience = {
        id: 1,
        company: 'Test Company',
        position: 'Lead Developer',
        start_date: '2023-01-01',
        end_date: '2024-12-31',
        description: 'Working on projects',
        achievements: ['Built features'],
        technologies: ['React'],
        location: 'Remote',
        employment_type: 'Full-time',
        created_at: new Date(),
        updated_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockUpdatedExperience] })

      const request = new NextRequest('http://localhost:3000/api/experiences/1', {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.experience.position).toBe('Lead Developer')
    })
  })

  describe('DELETE /api/experiences/[id]', () => {
    it('should delete an existing experience', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [{ id: 1 }] })

      const request = new NextRequest('http://localhost:3000/api/experiences/1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})