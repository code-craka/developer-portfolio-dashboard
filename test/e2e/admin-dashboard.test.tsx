import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '@/app/(admin)/dashboard/page'

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock file upload
Object.defineProperty(window, 'File', {
  value: class MockFile {
    name: string
    type: string
    size: number
    
    constructor(parts: any[], filename: string, properties: any = {}) {
      this.name = filename
      this.type = properties.type || ''
      this.size = properties.size || 0
    }
  }
})

describe('Admin Dashboard E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful API responses
    vi.mocked(fetch).mockImplementation((url, options) => {
      const method = options?.method || 'GET'
      
      if (url === '/api/projects' && method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              title: 'Existing Project',
              description: 'An existing project',
              techStack: ['React', 'TypeScript'],
              githubUrl: 'https://github.com/user/existing',
              imageUrl: '/uploads/projects/existing.jpg',
              featured: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]),
        } as Response)
      }
      
      if (url === '/api/projects' && method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            project: {
              id: 2,
              title: 'New Project',
              description: 'A newly created project',
              techStack: ['Vue', 'JavaScript'],
              imageUrl: '/uploads/projects/new.jpg',
              featured: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }),
        } as Response)
      }
      
      if (url === '/api/upload' && method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            imageUrl: '/uploads/projects/uploaded-image.jpg',
          }),
        } as Response)
      }
      
      if (url === '/api/experiences' && method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              company: 'Current Company',
              position: 'Developer',
              startDate: '2023-01-01',
              endDate: null,
              description: 'Current role',
              achievements: ['Achievement 1'],
              technologies: ['React'],
              location: 'Remote',
              employmentType: 'Full-time',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]),
        } as Response)
      }
      
      if (url === '/api/contact' && method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              message: 'Interested in your services',
              read: false,
              createdAt: new Date().toISOString(),
            },
          ]),
        } as Response)
      }
      
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  it('should render dashboard with all management sections', async () => {
    render(<DashboardPage />)
    
    // Check for main dashboard elements
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      expect(screen.getByText(/projects/i)).toBeInTheDocument()
      expect(screen.getByText(/experience/i)).toBeInTheDocument()
      expect(screen.getByText(/messages/i)).toBeInTheDocument()
    })
  })

  it('should display existing projects in table', async () => {
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Existing Project')).toBeInTheDocument()
      expect(screen.getByText('An existing project')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })
  })

  it('should handle complete project creation workflow', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Existing Project')).toBeInTheDocument()
    })
    
    // Click add project button
    const addButton = screen.getByRole('button', { name: /add project/i })
    await user.click(addButton)
    
    // Fill out project form
    await waitFor(() => {
      expect(screen.getByText(/add new project/i)).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const githubInput = screen.getByLabelText(/github/i)
    const featuredCheckbox = screen.getByLabelText(/featured/i)
    
    await user.type(titleInput, 'New Project')
    await user.type(descriptionInput, 'A newly created project')
    await user.type(githubInput, 'https://github.com/user/new-project')
    await user.click(featuredCheckbox)
    
    // Add tech stack
    const techInput = screen.getByLabelText(/tech stack/i)
    await user.type(techInput, 'Vue')
    await user.keyboard('{Enter}')
    await user.type(techInput, 'JavaScript')
    await user.keyboard('{Enter}')
    
    // Mock file upload
    const fileInput = screen.getByLabelText(/image/i)
    const file = new File([''], 'test-image.jpg', { type: 'image/jpeg' })
    await user.upload(fileInput, file)
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i })
    await user.click(submitButton)
    
    // Verify API calls
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
        method: 'POST',
      }))
      
      expect(fetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('New Project'),
      }))
    })
    
    // Check success notification
    await waitFor(() => {
      expect(screen.getByText(/project created successfully/i)).toBeInTheDocument()
    })
  })

  it('should handle project editing', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Existing Project')).toBeInTheDocument()
    })
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)
    
    // Form should be pre-populated
    await waitFor(() => {
      const titleInput = screen.getByDisplayValue('Existing Project')
      expect(titleInput).toBeInTheDocument()
    })
    
    // Update title
    const titleInput = screen.getByDisplayValue('Existing Project')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Project')
    
    // Save changes
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    
    // Verify update API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects/1', expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('Updated Project'),
      }))
    })
  })

  it('should handle project deletion with confirmation', async () => {
    const user = userEvent.setup()
    
    // Mock delete API response
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === '/api/projects/1' && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      }
      return vi.mocked(fetch).getMockImplementation()?.(url, options) || Promise.reject()
    })
    
    render(<DashboardPage />)
    
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Existing Project')).toBeInTheDocument()
    })
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByText(/confirm delete/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    // Verify delete API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'DELETE',
      })
    })
  })

  it('should display contact messages', async () => {
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Interested in your services')).toBeInTheDocument()
    })
    
    // Should show unread indicator
    expect(screen.getByText(/unread/i)).toBeInTheDocument()
  })

  it('should handle form validation errors', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Click add project button
    const addButton = screen.getByRole('button', { name: /add project/i })
    await user.click(addButton)
    
    // Try to submit empty form
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /save/i })
      expect(submitButton).toBeInTheDocument()
    })
    
    const submitButton = screen.getByRole('button', { name: /save/i })
    await user.click(submitButton)
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    vi.mocked(fetch).mockRejectedValue(new Error('Server error'))
    
    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading/i)).toBeInTheDocument()
    })
  })

  it('should be responsive and accessible', () => {
    render(<DashboardPage />)
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    
    // Check for proper form labels
    const addButton = screen.getByRole('button', { name: /add project/i })
    expect(addButton).toBeInTheDocument()
    
    // Check for table accessibility
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})