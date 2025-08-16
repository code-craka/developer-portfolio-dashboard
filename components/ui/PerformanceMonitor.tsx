'use client'

import { useEffect } from 'react'
import { monitorImagePerformance } from '@/lib/performance'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring
    monitorImagePerformance()
    
    // Monitor page load performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        // Log performance metrics in development
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (navigation) {
              console.log('Page Performance Metrics:', {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart,
              })
            }
          }, 0)
        }
      })
    }
  }, [])

  return null // This component doesn't render anything
}