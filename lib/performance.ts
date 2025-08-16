/**
 * Performance monitoring utilities for image optimization
 */

export interface PerformanceMetrics {
  loadTime: number
  imageSize: number
  renderTime: number
  cacheHit: boolean
}

/**
 * Measure image load performance
 */
export function measureImageLoad(
  imageUrl: string,
  onComplete?: (metrics: PerformanceMetrics) => void
): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const startTime = performance.now()
    const img = new Image()
    
    img.onload = () => {
      const loadTime = performance.now() - startTime
      const metrics: PerformanceMetrics = {
        loadTime,
        imageSize: 0, // Would need server-side info for actual size
        renderTime: 0, // Would be measured separately
        cacheHit: loadTime < 50 // Simple heuristic
      }
      
      onComplete?.(metrics)
      resolve(metrics)
    }
    
    img.onerror = () => {
      const metrics: PerformanceMetrics = {
        loadTime: performance.now() - startTime,
        imageSize: 0,
        renderTime: 0,
        cacheHit: false
      }
      
      onComplete?.(metrics)
      resolve(metrics)
    }
    
    img.src = imageUrl
  })
}

/**
 * Monitor Core Web Vitals for images
 */
export function monitorImagePerformance() {
  if (typeof window === 'undefined') return

  // Monitor Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
        })
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('Performance monitoring not supported:', error)
    }
  }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = priority
    
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    
    document.head.appendChild(link)
  })
}

/**
 * Preload multiple images
 */
export async function preloadImages(
  images: { src: string; priority?: 'high' | 'low' }[]
): Promise<void> {
  const promises = images.map(({ src, priority }) => 
    preloadImage(src, priority).catch(error => {
      console.warn(`Failed to preload ${src}:`, error)
    })
  )
  
  await Promise.allSettled(promises)
}

/**
 * Calculate image loading priority based on viewport position
 */
export function calculateImagePriority(
  element: HTMLElement,
  threshold: number = 1000
): 'high' | 'low' {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  
  // If image is above the fold or close to it, prioritize
  if (rect.top < viewportHeight + threshold) {
    return 'high'
  }
  
  return 'low'
}

/**
 * Optimize image loading based on connection speed
 */
export function getOptimalImageQuality(): number {
  if (typeof navigator === 'undefined') return 85

  // Check for slow connection
  const connection = (navigator as any).connection
  if (connection) {
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return 60 // Lower quality for slow connections
    }
    if (connection.effectiveType === '3g') {
      return 75
    }
  }
  
  return 85 // Default quality
}

/**
 * Check if WebP is supported
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Get device pixel ratio for high-DPI displays
 */
export function getDevicePixelRatio(): number {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
}

/**
 * Calculate optimal image dimensions for device
 */
export function getOptimalImageDimensions(
  baseWidth: number,
  baseHeight: number,
  maxWidth?: number
): { width: number; height: number } {
  const dpr = getDevicePixelRatio()
  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1920
  
  let optimalWidth = Math.min(baseWidth * dpr, maxWidth || screenWidth)
  let optimalHeight = (optimalWidth / baseWidth) * baseHeight
  
  return {
    width: Math.round(optimalWidth),
    height: Math.round(optimalHeight)
  }
}