'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ScrollAnimation } from '../ui/PageTransition'

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return displayText
}

// Particle component for background animation
const Particle = ({ delay = 0 }: { delay?: number }) => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
      
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <motion.div
      className="absolute w-1 h-1 bg-electric-blue-500 rounded-full opacity-60"
      initial={{ 
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        scale: 0
      }}
      animate={{
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        scale: [0, 1, 0],
        opacity: [0, 0.6, 0]
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  )
}

// Smooth scroll function
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const name = useTypewriter("John Developer", 150)
  const title = useTypewriter("Full Stack Developer", 100)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-blue-500/5 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(0,212,255,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} delay={i * 0.2} />
        ))}
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-electric-blue-500/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-electric-blue-500/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-electric-blue-500/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollAnimation delay={0.2}>
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4"
            >
              <span className="block bg-gradient-to-r from-white via-electric-blue-400 to-white bg-clip-text text-transparent">
                {name}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-electric-blue-500"
                  aria-hidden="true"
                >
                  |
                </motion.span>
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-300 mt-4">
              {title}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                className="text-electric-blue-500"
              >
                |
              </motion.span>
            </h2>
          </motion.div>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.4}>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting exceptional digital experiences with modern technologies, 
            clean code, and innovative solutions that bring ideas to life.
          </motion.p>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.6}>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto px-8 py-4 bg-electric-blue-500 text-dark-950 font-semibold rounded-lg transition-all duration-300 shadow-electric hover:shadow-electric-lg transform-gpu"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)",
                backgroundColor: "#33CFFF"
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="View my projects"
            >
              <span className="flex items-center justify-center gap-2">
                View My Work
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-electric-blue-500 text-electric-blue-500 font-semibold rounded-lg transition-all duration-300 hover:bg-electric-blue-500/10 hover:shadow-electric backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                borderColor: "#33CFFF",
                color: "#33CFFF"
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Get in touch with me"
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.8}>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => scrollToSection('about')}
              className="group flex flex-col items-center gap-2 text-electric-blue-500 hover:text-electric-blue-400 transition-colors duration-300"
              whileHover={{ y: -5 }}
              aria-label="Scroll to about section"
            >
              <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                Discover More
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 border-2 border-electric-blue-500 rounded-full flex justify-center relative overflow-hidden"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-3 bg-electric-blue-500 rounded-full mt-2"
                />
              </motion.div>
            </motion.button>
          </motion.div>
        </ScrollAnimation>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-electric-blue-500 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-1 h-1 bg-electric-blue-400 rounded-full opacity-40"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-electric-blue-300 rounded-full opacity-50"
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </section>
  )
}