'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Performance monitoring hook
export function usePerformanceOptimization() {
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      // Check for low-end devices
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 || // Low CPU cores
        (navigator as any).deviceMemory <= 2 || // Low RAM
        /Android.*Chrome\/[0-5]/.test(navigator.userAgent) || // Old Android Chrome
        /iPhone.*OS [0-9]_/.test(navigator.userAgent) // Old iOS

      // Check current performance
      if ('performance' in window && 'memory' in performance) {
        const memory = (performance as any).memory
        const isMemoryConstrained = memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8
        setIsLowPerformance(isLowEnd || isMemoryConstrained)
      } else {
        setIsLowPerformance(isLowEnd)
      }
    }

    checkPerformance()

    // Monitor frame rate
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount
        frameCount = 0
        lastTime = currentTime
        
        // If FPS is consistently low, enable performance mode
        if (fps < 30) {
          setIsLowPerformance(true)
        }
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    const rafId = requestAnimationFrame(measureFPS)
    
    return () => cancelAnimationFrame(rafId)
  }, [])

  return {
    isLowPerformance: isLowPerformance || Boolean(prefersReducedMotion),
    prefersReducedMotion
  }
}

// Optimized animation variants
export const getOptimizedVariants = (isLowPerformance: boolean) => {
  if (isLowPerformance) {
    return {
      // Simplified animations for low-performance devices
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      },
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      },
      scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
      }
    }
  }

  return {
    // Full animations for high-performance devices
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, type: 'spring', stiffness: 100 }
    }
  }
}

// Performance-aware animation component
interface OptimizedMotionProps {
  children: React.ReactNode
  className?: string
  variant?: 'fadeIn' | 'slideUp' | 'scale'
  delay?: number
  [key: string]: any
}

export function OptimizedMotion({
  children,
  className = '',
  variant = 'fadeIn',
  delay = 0,
  ...props
}: OptimizedMotionProps) {
  const { isLowPerformance } = usePerformanceOptimization()
  const variants = getOptimizedVariants(isLowPerformance)
  const selectedVariant = variants[variant]

  if (isLowPerformance) {
    // For low-performance devices, use simpler animations
    return (
      <motion.div
        className={className}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        transition={{ ...selectedVariant.transition, delay }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  // For high-performance devices, use full animations
  return (
    <motion.div
      className={className}
      initial={selectedVariant.initial}
      whileInView={selectedVariant.animate}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ ...selectedVariant.transition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Intersection Observer optimization
export function useOptimizedIntersection(threshold = 0.1) {
  const { isLowPerformance } = usePerformanceOptimization()
  
  return {
    threshold: isLowPerformance ? 0.05 : threshold,
    rootMargin: isLowPerformance ? '100px' : '50px'
  }
}

// Animation performance monitor
export function AnimationPerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    isOptimized: false
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const monitor = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount
        frameCount = 0
        lastTime = currentTime
        
        // Get memory usage if available
        let memoryUsage = 0
        if ('performance' in window && 'memory' in performance) {
          const memory = (performance as any).memory
          memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        }
        
        setMetrics({
          fps,
          memoryUsage,
          isOptimized: fps < 30 || memoryUsage > 80
        })
      }
      
      requestAnimationFrame(monitor)
    }
    
    const rafId = requestAnimationFrame(monitor)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}%</div>
      <div>Optimized: {metrics.isOptimized ? 'Yes' : 'No'}</div>
    </div>
  )
}

// GPU acceleration utilities
export const gpuAcceleration = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  willChange: 'transform' as const
}

// Optimized hover effects
export const getOptimizedHoverEffects = (isLowPerformance: boolean) => {
  if (isLowPerformance) {
    return {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  return {
    scale: 1.05,
    y: -5,
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

// Batch animation updates
export function useBatchedAnimations() {
  const [animationQueue, setAnimationQueue] = useState<Array<() => void>>([])

  useEffect(() => {
    if (animationQueue.length === 0) return

    const processQueue = () => {
      animationQueue.forEach(animation => animation())
      setAnimationQueue([])
    }

    const rafId = requestAnimationFrame(processQueue)
    return () => cancelAnimationFrame(rafId)
  }, [animationQueue])

  const queueAnimation = (animation: () => void) => {
    setAnimationQueue(prev => [...prev, animation])
  }

  return { queueAnimation }
}