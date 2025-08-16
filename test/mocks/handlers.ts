import { http, HttpResponse } from 'msw'
import type { Project, Experience, ContactMessage } from '@/lib/types'

// Mock data
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Test Project',
    description: 'A test project description',
    techStack: ['React', 'TypeScript', 'Next.js'],
    githubUrl: 'https://github.com/test/project',
    demoUrl: 'https://test-project.com',
    imageUrl: '/uploads/projects/test-project.jpg',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockExperiences: Experience[] = [
  {
    id: 1,
    company: 'Test Company',
    position: 'Software Developer',
    startDate: new Date('2023-01-01'),
    endDate: undefined,
    description: 'Working on amazing projects',
    achievements: ['Built awesome features', 'Improved performance'],
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    companyLogo: '/uploads/companies/test-company.png',
    location: 'Remote',
    employmentType: 'Full-time',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockMessages: ContactMessage[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like to work with you!',
    read: false,
    createdAt: new Date('2024-01-01'),
  },
]

export const handlers = [
  // Projects API
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects)
  }),

  http.post('/api/projects', async ({ request }) => {
    const newProject = await request.json() as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
    const project: Project = {
      ...newProject,
      id: mockProjects.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockProjects.push(project)
    return HttpResponse.json({ success: true, project })
  }),

  http.put('/api/projects/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updates = await request.json() as Partial<Project>
    const projectIndex = mockProjects.findIndex(p => p.id === id)
    
    if (projectIndex === -1) {
      return HttpResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }
    
    mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...updates, updatedAt: new Date() }
    return HttpResponse.json({ success: true, project: mockProjects[projectIndex] })
  }),

  http.delete('/api/projects/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const projectIndex = mockProjects.findIndex(p => p.id === id)
    
    if (projectIndex === -1) {
      return HttpResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }
    
    mockProjects.splice(projectIndex, 1)
    return HttpResponse.json({ success: true })
  }),

  // Experiences API
  http.get('/api/experiences', () => {
    return HttpResponse.json(mockExperiences)
  }),

  http.post('/api/experiences', async ({ request }) => {
    const newExperience = await request.json() as Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>
    const experience: Experience = {
      ...newExperience,
      id: mockExperiences.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockExperiences.push(experience)
    return HttpResponse.json({ success: true, experience })
  }),

  http.put('/api/experiences/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updates = await request.json() as Partial<Experience>
    const experienceIndex = mockExperiences.findIndex(e => e.id === id)
    
    if (experienceIndex === -1) {
      return HttpResponse.json({ success: false, error: 'Experience not found' }, { status: 404 })
    }
    
    mockExperiences[experienceIndex] = { ...mockExperiences[experienceIndex], ...updates, updatedAt: new Date() }
    return HttpResponse.json({ success: true, experience: mockExperiences[experienceIndex] })
  }),

  http.delete('/api/experiences/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const experienceIndex = mockExperiences.findIndex(e => e.id === id)
    
    if (experienceIndex === -1) {
      return HttpResponse.json({ success: false, error: 'Experience not found' }, { status: 404 })
    }
    
    mockExperiences.splice(experienceIndex, 1)
    return HttpResponse.json({ success: true })
  }),

  // Contact API
  http.get('/api/contact', () => {
    return HttpResponse.json(mockMessages)
  }),

  http.post('/api/contact', async ({ request }) => {
    const newMessage = await request.json() as Omit<ContactMessage, 'id' | 'createdAt' | 'read'>
    const message: ContactMessage = {
      ...newMessage,
      id: mockMessages.length + 1,
      read: false,
      createdAt: new Date(),
    }
    mockMessages.push(message)
    return HttpResponse.json({ success: true, message })
  }),

  http.put('/api/contact/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updates = await request.json() as { read: boolean }
    const messageIndex = mockMessages.findIndex(m => m.id === id)
    
    if (messageIndex === -1) {
      return HttpResponse.json({ success: false, error: 'Message not found' }, { status: 404 })
    }
    
    mockMessages[messageIndex] = { ...mockMessages[messageIndex], ...updates }
    return HttpResponse.json({ success: true })
  }),

  http.delete('/api/contact/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const messageIndex = mockMessages.findIndex(m => m.id === id)
    
    if (messageIndex === -1) {
      return HttpResponse.json({ success: false, error: 'Message not found' }, { status: 404 })
    }
    
    mockMessages.splice(messageIndex, 1)
    return HttpResponse.json({ success: true })
  }),

  // Upload API
  http.post('/api/upload', () => {
    return HttpResponse.json({
      success: true,
      imageUrl: '/uploads/projects/test-image.jpg'
    })
  }),

  // Health check
  http.get('/api/health/db', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    })
  }),
]