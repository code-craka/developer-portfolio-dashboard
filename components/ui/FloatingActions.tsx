'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingActionButton, MorphingIconButton } from './InteractiveElements'

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300
      setIsVisible(scrolled)

      // Update active section
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMenuOpen(false)
  }

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👨‍💻' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Navigation Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="absolute bottom-16 right-0 space-y-3"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2, staggerChildren: 0.05 }}
              >
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-full backdrop-blur-xl border
                        transition-all duration-300 text-sm font-medium min-w-[120px]
                        ${activeSection === item.id 
                          ? 'bg-electric-blue-500 text-dark-950 border-electric-blue-500 shadow-electric' 
                          : 'bg-black/40 text-white border-white/20 hover:border-electric-blue-500/50 hover:bg-electric-blue-500/10'
                        }
                      `}
                      whileHover={{ 
                        scale: 1.05,
                        x: -5
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              delay: 0.2 
            }}
          >
            <MorphingIconButton
              icon1={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
              icon2={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              isToggled={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              className="
                w-14 h-14 bg-electric-blue-500 hover:bg-electric-blue-400 
                text-dark-950 rounded-full shadow-electric hover:shadow-electric-lg
                flex items-center justify-center transition-colors duration-300
              "
              size={24}
            />
          </motion.div>

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {!isMenuOpen && (
              <motion.div
                className="absolute bottom-16 right-0"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ delay: 0.1 }}
              >
                <FloatingActionButton
                  onClick={scrollToTop}
                  className="w-12 h-12 bg-black/40 hover:bg-black/60 text-white border border-white/20 hover:border-electric-blue-500/50"
                >
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </motion.svg>
                </FloatingActionButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background overlay when menu is open */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}