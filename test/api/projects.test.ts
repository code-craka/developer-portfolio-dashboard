import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST, PUT, DELETE } from '@/app/api/projects/route'
import { PUT as PUT_ID, DELETE as DELETE_ID } from '@/app/api/projects/[id]/route'
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

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const { db } = await import('@/lib/db')
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project',
          description: 'A test project',
          tech_stack: ['React', 'TypeScript'],
          github_url: 'https://github.com/test/project',
          demo_url: 'https://test-project.com',
          image_url: '/uploads/projects/test.jpg',
          featured: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      vi.mocked(db.execute).mockResolvedValue({ rows: mockProjects })

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0].title).toBe('Test Project')
    })

    it('should filter featured projects when requested', async () => {
      const { db } = await import('@/lib/db')
      const mockProjects = [
        {
          id: 1,
          title: 'Featured Project',
          featured: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      vi.mocked(db.execute).mockResolvedValue({ rows: mockProjects })

      const request = new NextRequest('http://localhost:3000/api/projects?featured=true')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].featured).toBe(true)
    })
  })

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const { db } = await import('@/lib/db')
      const newProject = {
        title: 'New Project',
        description: 'A new project description',
        techStack: ['React', 'Next.js'],
        githubUrl: 'https://github.com/test/new-project',
        imageUrl: '/uploads/projects/new-project.jpg',
        featured: false,
      }

      const mockCreatedProject = {
        id: 2,
        ...newProject,
        tech_stack: newProject.techStack,
        github_url: newProject.githubUrl,
        image_url: newProject.imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockCreatedProject] })

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.project.title).toBe('New Project')
    })

    it('should reject invalid project data', async () => {
      const invalidProject = {
        title: '', // Empty title should be rejected
        description: 'A project description',
        techStack: [],
        imageUrl: '/uploads/projects/test.jpg',
        featured: false,
      }

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(invalidProject),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Title is required')
    })
  })

  describe('PUT /api/projects/[id]', () => {
    it('should update an existing project', async () => {
      const { db } = await import('@/lib/db')
      const updates = {
        title: 'Updated Project Title',
        featured: true,
      }

      const mockUpdatedProject = {
        id: 1,
        title: 'Updated Project Title',
        description: 'Original description',
        tech_stack: ['React'],
        image_url: '/uploads/projects/test.jpg',
        featured: true,
        created_at: new Date(),
        updated_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockUpdatedProject] })

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT_ID(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.project.title).toBe('Updated Project Title')
      expect(data.project.featured).toBe(true)
    })

    it('should return 404 for non-existent project', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [] })

      const request = new NextRequest('http://localhost:3000/api/projects/999', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PUT_ID(request, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Project not found')
    })
  })

  describe('DELETE /api/projects/[id]', () => {
    it('should delete an existing project', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [{ id: 1 }] })

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'DELETE',
      })

      const response = await DELETE_ID(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 404 for non-existent project', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [] })

      const request = new NextRequest('http://localhost:3000/api/projects/999', {
        method: 'DELETE',
      })

      const response = await DELETE_ID(request, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Project not found')
    })
  })
})