import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroSection from '@/components/sections/HeroSection'

describe('HeroSection', () => {
  it('should render hero section with main content', () => {
    render(<HeroSection />)
    
    // Check for main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    
    // Check for call-to-action buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should have proper accessibility attributes', () => {
    render(<HeroSection />)
    
    const section = screen.getByRole('banner')
    expect(section).toBeInTheDocument()
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id')
  })

  it('should render typewriter effect text', () => {
    render(<HeroSection />)
    
    // Check for developer-related text
    expect(screen.getByText(/developer/i)).toBeInTheDocument()
  })

  it('should have responsive design classes', () => {
    const { container } = render(<HeroSection />)
    
    const section = container.querySelector('section')
    expect(section).toHaveClass('min-h-screen')
  })
})