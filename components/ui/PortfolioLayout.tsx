'use client'

import { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import PageTransition from './PageTransition'

interface PortfolioLayoutProps {
  children: ReactNode
  className?: string
}

export default function PortfolioLayout({ children, className = '' }: PortfolioLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg ${className}`}>
      <ScrollProgress />
      <Navigation />
      
      <PageTransition>
        <main className="relative">
          {children}
        </main>
      </PageTransition>
      
      <Footer />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </div>
  )
}