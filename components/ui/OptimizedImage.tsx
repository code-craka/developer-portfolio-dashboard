'use client'

import { useState, forwardRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { createOptimizedImageProps, IMAGE_PRESETS, generateBlurDataURL } from '@/lib/image-utils-client'

interface OptimizedImageProps {
  src: string
  alt: string
  preset?: keyof typeof IMAGE_PRESETS
  width?: number
  height?: number
  quality?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  showSkeleton?: boolean
  skeletonClassName?: string
}

const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(({
  src,
  alt,
  preset,
  width,
  height,
  quality = 85,
  className = '',
  priority = false,
  fill = false,
  sizes,
  onLoad,
  onError,
  fallbackSrc,
  showSkeleton = true,
  skeletonClassName = '',
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Get optimized props based on preset or custom dimensions
  const imageProps = preset 
    ? createOptimizedImageProps(currentSrc, alt, preset)
    : {
        src: currentSrc,
        alt,
        width: width || 400,
        height: height || 300,
        quality,
        placeholder: 'blur' as const,
        blurDataURL: generateBlurDataURL(),
        sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        priority,
      }

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
    } else {
      onError?.()
    }
  }

  const containerClassName = `relative overflow-hidden ${className}`
  const skeletonClass = `absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 animate-pulse ${skeletonClassName}`

  if (hasError && !fallbackSrc) {
    return (
      <div ref={ref} className={containerClassName}>
        <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-gray-400 text-sm">Image not available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={containerClassName}>
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <motion.div
          className={skeletonClass}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Optimized image */}
      <Image
        {...imageProps}
        alt={alt}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${fill ? 'object-cover' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Loading indicator overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50">
          <motion.div
            className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage