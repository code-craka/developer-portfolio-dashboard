'use client'

import OptimizedImage from './OptimizedImage'
import { IMAGE_PRESETS } from '@/lib/image-utils-client'
import { useLazyLoading } from '@/lib/hooks/useIntersectionObserver'

interface LazyImageProps {
  src: string
  alt: string
  preset?: keyof typeof IMAGE_PRESETS
  width?: number
  height?: number
  quality?: number
  className?: string
  fill?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  rootMargin?: string
  threshold?: number
  showSkeleton?: boolean
  skeletonClassName?: string
}

export default function LazyImage({
  src,
  alt,
  rootMargin = '50px',
  threshold = 0.1,
  ...imageProps
}: LazyImageProps) {
  const { elementRef, isVisible } = useLazyLoading({
    rootMargin,
    threshold,
  })

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={imageProps.className}>
      {isVisible ? (
        <OptimizedImage
          src={src}
          alt={alt}
          {...imageProps}
        />
      ) : (
        // Placeholder while not in view
        <div className={`bg-dark-800 animate-pulse ${imageProps.className}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading...</div>
          </div>
        </div>
      )}
    </div>
  )
}