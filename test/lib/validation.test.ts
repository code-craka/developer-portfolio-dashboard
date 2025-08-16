import { describe, it, expect } from 'vitest'
import { validateProject, validateExperience, validateContactMessage, validateImageFile } from '@/lib/validation'

describe('Validation', () => {
  describe('validateProject', () => {
    it('should validate a correct project', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project description',
        techStack: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/project',
        demoUrl: 'https://test-project.com',
        imageUrl: '/uploads/projects/test.jpg',
        featured: true,
      }

      const result = validateProject(project)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject project with missing title', () => {
      const project = {
        title: '',
        description: 'A test project description',
        techStack: ['React'],
        imageUrl: '/uploads/projects/test.jpg',
        featured: false,
      }

      const result = validateProject(project)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Title is required')
    })

    it('should reject project with invalid URL', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project description',
        techStack: ['React'],
        githubUrl: 'invalid-url',
        imageUrl: '/uploads/projects/test.jpg',
        featured: false,
      }

      const result = validateProject(project)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('GitHub URL must be a valid URL')
    })

    it('should reject project with empty tech stack', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project description',
        techStack: [],
        imageUrl: '/uploads/projects/test.jpg',
        featured: false,
      }

      const result = validateProject(project)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('At least one technology is required')
    })
  })

  describe('validateExperience', () => {
    it('should validate a correct experience', () => {
      const experience = {
        company: 'Test Company',
        position: 'Software Developer',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        description: 'Working on amazing projects',
        achievements: ['Built features'],
        technologies: ['React', 'Node.js'],
        location: 'Remote',
        employmentType: 'Full-time' as const,
      }

      const result = validateExperience(experience)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject experience with missing company', () => {
      const experience = {
        company: '',
        position: 'Software Developer',
        startDate: new Date('2023-01-01'),
        description: 'Working on amazing projects',
        achievements: ['Built features'],
        technologies: ['React'],
        location: 'Remote',
        employmentType: 'Full-time' as const,
      }

      const result = validateExperience(experience)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Company name is required')
    })

    it('should reject experience with end date before start date', () => {
      const experience = {
        company: 'Test Company',
        position: 'Software Developer',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2023-01-01'),
        description: 'Working on amazing projects',
        achievements: ['Built features'],
        technologies: ['React'],
        location: 'Remote',
        employmentType: 'Full-time' as const,
      }

      const result = validateExperience(experience)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('End date must be after start date')
    })
  })

  describe('validateContactMessage', () => {
    it('should validate a correct contact message', () => {
      const message = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I would like to work with you!',
      }

      const result = validateContactMessage(message)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject message with invalid email', () => {
      const message = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Hello!',
      }

      const result = validateContactMessage(message)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Please enter a valid email address')
    })

    it('should reject message with short message', () => {
      const message = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hi',
      }

      const result = validateContactMessage(message)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Message must be at least 10 characters long')
    })
  })

  describe('validateImageFile', () => {
    it('should validate correct image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = validateImageFile(file)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject file that is too large', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }) // 6MB

      const result = validateImageFile(file)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File size must be less than 5MB')
    })

    it('should reject invalid file type', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 1024 })

      const result = validateImageFile(file)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File must be an image (JPG, PNG, or WebP)')
    })
  })
})