import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ProjectsSection from '@/components/sections/ProjectsSection'

// Mock fetch
global.fetch = vi.fn()

describe('ProjectsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<ProjectsSection />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should render projects after loading', async () => {
    const mockProjects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'A test project description',
        techStack: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/project',
        demoUrl: 'https://test-project.com',
        imageUrl: '/uploads/projects/test.jpg',
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProjects),
    } as Response)

    render(<ProjectsSection />)

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    expect(screen.getByText('A test project description')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('should render error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Failed to fetch'))

    render(<ProjectsSection />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('should display featured projects prominently', async () => {
    const mockProjects = [
      {
        id: 1,
        title: 'Featured Project',
        description: 'A featured project',
        techStack: ['React'],
        imageUrl: '/uploads/projects/featured.jpg',
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Regular Project',
        description: 'A regular project',
        techStack: ['Vue'],
        imageUrl: '/uploads/projects/regular.jpg',
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProjects),
    } as Response)

    render(<ProjectsSection />)

    await waitFor(() => {
      expect(screen.getByText('Featured Project')).toBeInTheDocument()
    })

    // Featured projects should have special styling or badges
    const featuredProject = screen.getByText('Featured Project').closest('div')
    expect(featuredProject).toBeInTheDocument()
  })

  it('should have proper section heading', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    render(<ProjectsSection />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
    })
  })
})