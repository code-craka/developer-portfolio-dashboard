import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectsManager from '@/components/admin/ProjectsManager'

// Mock fetch
global.fetch = vi.fn()

describe('ProjectsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render projects table', async () => {
    const mockProjects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'A test project',
        techStack: ['React', 'TypeScript'],
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

    render(<ProjectsManager />)

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('should show add project button', () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    render(<ProjectsManager />)

    expect(screen.getByRole('button', { name: /add project/i })).toBeInTheDocument()
  })

  it('should open add project modal when button is clicked', async () => {
    const user = userEvent.setup()
    
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    render(<ProjectsManager />)

    const addButton = screen.getByRole('button', { name: /add project/i })
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText(/add new project/i)).toBeInTheDocument()
    })
  })

  it('should show edit and delete buttons for each project', async () => {
    const mockProjects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'A test project',
        techStack: ['React'],
        imageUrl: '/uploads/projects/test.jpg',
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProjects),
    } as Response)

    render(<ProjectsManager />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
  })

  it('should handle delete project', async () => {
    const user = userEvent.setup()
    
    const mockProjects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'A test project',
        techStack: ['React'],
        imageUrl: '/uploads/projects/test.jpg',
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)

    render(<ProjectsManager />)

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Should show confirmation modal
    await waitFor(() => {
      expect(screen.getByText(/confirm delete/i)).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'DELETE',
      })
    })
  })

  it('should show loading state', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ProjectsManager />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Failed to fetch'))

    render(<ProjectsManager />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})