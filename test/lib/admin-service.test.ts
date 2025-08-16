import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AdminService } from '@/lib/admin-service'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn(),
  },
}))

describe('AdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllProjects', () => {
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

      const projects = await AdminService.getAllProjects()

      expect(projects).toHaveLength(1)
      expect(projects[0].title).toBe('Test Project')
      expect(projects[0].techStack).toEqual(['React', 'TypeScript'])
      expect(projects[0].githubUrl).toBe('https://github.com/test/project')
    })

    it('should handle database errors', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockRejectedValue(new Error('Database error'))

      await expect(AdminService.getAllProjects()).rejects.toThrow('Database error')
    })
  })

  describe('createProject', () => {
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
        title: newProject.title,
        description: newProject.description,
        tech_stack: newProject.techStack,
        github_url: newProject.githubUrl,
        demo_url: null,
        image_url: newProject.imageUrl,
        featured: newProject.featured,
        created_at: new Date(),
        updated_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockCreatedProject] })

      const project = await AdminService.createProject(newProject)

      expect(project.title).toBe('New Project')
      expect(project.techStack).toEqual(['React', 'Next.js'])
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.arrayContaining([
          newProject.title,
          newProject.description,
          JSON.stringify(newProject.techStack),
          newProject.githubUrl,
          undefined,
          newProject.imageUrl,
          newProject.featured,
        ])
      )
    })
  })

  describe('updateProject', () => {
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
        github_url: null,
        demo_url: null,
        image_url: '/uploads/projects/test.jpg',
        featured: true,
        created_at: new Date(),
        updated_at: new Date(),
      }

      vi.mocked(db.execute).mockResolvedValue({ rows: [mockUpdatedProject] })

      const project = await AdminService.updateProject(1, updates)

      expect(project.title).toBe('Updated Project Title')
      expect(project.featured).toBe(true)
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE projects'),
        expect.arrayContaining([
          updates.title,
          updates.featured,
          1,
        ])
      )
    })

    it('should throw error when project not found', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [] })

      await expect(AdminService.updateProject(999, { title: 'Updated' }))
        .rejects.toThrow('Project not found')
    })
  })

  describe('deleteProject', () => {
    it('should delete an existing project', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [{ id: 1 }] })

      await AdminService.deleteProject(1)

      expect(db.execute).toHaveBeenCalledWith(
        'DELETE FROM projects WHERE id = $1 RETURNING id',
        [1]
      )
    })

    it('should throw error when project not found', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.execute).mockResolvedValue({ rows: [] })

      await expect(AdminService.deleteProject(999))
        .rejects.toThrow('Project not found')
    })
  })

  describe('getAllExperiences', () => {
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

      const experiences = await AdminService.getAllExperiences()

      expect(experiences).toHaveLength(1)
      expect(experiences[0].company).toBe('Test Company')
      expect(experiences[0].startDate).toEqual(new Date('2023-01-01'))
      expect(experiences[0].endDate).toBeNull()
    })
  })

  describe('getAllContactMessages', () => {
    it('should return all contact messages', async () => {
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

      const messages = await AdminService.getAllContactMessages()

      expect(messages).toHaveLength(1)
      expect(messages[0].name).toBe('John Doe')
      expect(messages[0].read).toBe(false)
    })
  })
})