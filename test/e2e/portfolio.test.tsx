import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/page'

// Mock fetch for API calls
global.fetch = vi.fn()

describe('Portfolio E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful API responses
    vi.mocked(fetch).mockImplementation((url) => {
      if (url === '/api/projects') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              title: 'Amazing Project',
              description: 'This is an amazing project that showcases my skills',
              techStack: ['React', 'TypeScript', 'Next.js'],
              githubUrl: 'https://github.com/user/amazing-project',
              demoUrl: 'https://amazing-project.com',
              imageUrl: '/uploads/projects/amazing-project.jpg',
              featured: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]),
        } as Response)
      }
      
      if (url === '/api/experiences') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              company: 'Tech Company',
              position: 'Senior Developer',
              startDate: '2023-01-01',
              endDate: null,
              description: 'Leading development of cutting-edge applications',
              achievements: ['Improved performance by 50%', 'Led team of 5 developers'],
              technologies: ['React', 'Node.js', 'PostgreSQL'],
              companyLogo: '/uploads/companies/tech-company.png',
              location: 'San Francisco, CA',
              employmentType: 'Full-time',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]),
        } as Response)
      }
      
      if (url === '/api/contact') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Message sent successfully' }),
        } as Response)
      }
      
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  it('should render complete portfolio page', async () => {
    render(<HomePage />)
    
    // Check hero section
    expect(screen.getByRole('banner')).toBeInTheDocument()
    
    // Check main sections
    await waitFor(() => {
      expect(screen.getByText(/about/i)).toBeInTheDocument()
      expect(screen.getByText(/projects/i)).toBeInTheDocument()
      expect(screen.getByText(/experience/i)).toBeInTheDocument()
      expect(screen.getByText(/contact/i)).toBeInTheDocument()
    })
  })

  it('should display projects from API', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Project')).toBeInTheDocument()
      expect(screen.getByText('This is an amazing project that showcases my skills')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Next.js')).toBeInTheDocument()
    })
    
    // Check for project links
    const githubLink = screen.getByRole('link', { name: /github/i })
    const demoLink = screen.getByRole('link', { name: /demo/i })
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/user/amazing-project')
    expect(demoLink).toHaveAttribute('href', 'https://amazing-project.com')
  })

  it('should display experience timeline', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tech Company')).toBeInTheDocument()
      expect(screen.getByText('Senior Developer')).toBeInTheDocument()
      expect(screen.getByText('Leading development of cutting-edge applications')).toBeInTheDocument()
      expect(screen.getByText('Improved performance by 50%')).toBeInTheDocument()
    })
  })

  it('should handle contact form submission', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    
    // Find contact form
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send/i })
    
    // Fill out form
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'I am interested in working with you on exciting projects!')
    
    // Submit form
    await user.click(submitButton)
    
    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'I am interested in working with you on exciting projects!',
        }),
      })
    })
    
    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('should have proper navigation between sections', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    
    // Check navigation links
    const aboutLink = screen.getByRole('link', { name: /about/i })
    const projectsLink = screen.getByRole('link', { name: /projects/i })
    const contactLink = screen.getByRole('link', { name: /contact/i })
    
    expect(aboutLink).toBeInTheDocument()
    expect(projectsLink).toBeInTheDocument()
    expect(contactLink).toBeInTheDocument()
    
    // Navigation should use smooth scrolling (href="#section")
    expect(aboutLink).toHaveAttribute('href', '#about')
    expect(projectsLink).toHaveAttribute('href', '#projects')
    expect(contactLink).toHaveAttribute('href', '#contact')
  })

  it('should be responsive and accessible', () => {
    render(<HomePage />)
    
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    
    // Check for semantic HTML
    expect(screen.getByRole('banner')).toBeInTheDocument() // header/hero
    expect(screen.getByRole('main')).toBeInTheDocument() // main content
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
    
    // Check for proper form labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('should handle loading states gracefully', async () => {
    // Mock slow API response
    vi.mocked(fetch).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve([])
        } as Response), 100)
      )
    )
    
    render(<HomePage />)
    
    // Should show loading states
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
    
    // Should still render other sections
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })
})