/**
 * Dynamic import utilities for code splitting and performance optimization
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

/**
 * Create a dynamic component with loading and error states
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    ssr?: boolean
  } = {}
) {
  return dynamic(importFn, {
    ssr: options.ssr ?? true,
  })
}

/**
 * Example dynamic component creation
 * Use this pattern for components that have default exports
 */
export const createDynamicAdminComponent = (componentPath: string) => {
  return createDynamicComponent(
    () => import(componentPath as any),
    { ssr: false }
  )
}

/**
 * Preload critical components for better performance
 */
export function preloadCriticalComponents() {
  if (typeof window !== 'undefined') {
    // Preload admin components if user is likely to access admin
    const isAdmin = window.location.pathname.includes('/admin') || 
                   document.cookie.includes('__session')
    
    if (isAdmin) {
      // Preload admin components
      console.log('Preloading admin components...')
    }
  }
}

/**
 * Lazy load non-critical features
 */
export const LazyFeatures = {
  // Advanced animations (load on interaction)
  animations: () => import('framer-motion').then(m => m.motion),
  
  // Monitoring utilities
  monitoring: () => import('@/lib/monitoring'),
}

const DynamicImports = {
  createDynamicComponent,
  createDynamicAdminComponent,
  preloadCriticalComponents,
  LazyFeatures,
}

export default DynamicImports