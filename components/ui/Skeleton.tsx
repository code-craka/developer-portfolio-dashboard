'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'rectangular' | 'circular' | 'text'
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800'
  const animationClasses = animate ? 'animate-pulse' : ''
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  }

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
    />
  )
}

// Specialized skeleton components
export function ImageSkeleton({ 
  className = '', 
  aspectRatio = 'aspect-video' 
}: { 
  className?: string
  aspectRatio?: string 
}) {
  return (
    <div className={`${aspectRatio} ${className}`}>
      <Skeleton className="w-full h-full" />
    </div>
  )
}

export function ProjectCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton */}
      <ImageSkeleton className="mb-4" aspectRatio="aspect-video" />
      
      {/* Title skeleton */}
      <Skeleton className="h-6 mb-3" width="80%" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4" width="100%" />
        <Skeleton className="h-4" width="90%" />
        <Skeleton className="h-4" width="70%" />
      </div>
      
      {/* Tech stack skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6 rounded-full" width={`${60 + i * 10}px`} />
        ))}
      </div>
      
      {/* Links skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-10 rounded-lg" width="100px" />
        <Skeleton className="h-10 rounded-lg" width="100px" />
      </div>
    </motion.div>
  )
}

export function ExperienceCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-4">
        {/* Company logo skeleton */}
        <Skeleton variant="circular" width={64} height={64} className="flex-shrink-0" />
        
        <div className="flex-1">
          {/* Company and position */}
          <Skeleton className="h-6 mb-2" width="60%" />
          <Skeleton className="h-5 mb-3" width="80%" />
          
          {/* Date range */}
          <Skeleton className="h-4 mb-4" width="40%" />
          
          {/* Description */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4" width="100%" />
            <Skeleton className="h-4" width="95%" />
            <Skeleton className="h-4" width="85%" />
          </div>
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 rounded-full" width={`${50 + i * 8}px`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      {/* Profile image skeleton */}
      <div className="relative mx-auto mb-6">
        <div className="w-64 h-64 sm:w-80 sm:h-80 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
          <Skeleton variant="circular" className="w-56 h-56 sm:w-72 sm:h-72" />
        </div>
      </div>
      
      {/* Name and title */}
      <Skeleton className="h-8 mb-4 mx-auto" width="300px" />
      <Skeleton className="h-6 mb-6 mx-auto" width="200px" />
      
      {/* Bio */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <Skeleton className="h-4" width="100%" />
        <Skeleton className="h-4" width="95%" />
        <Skeleton className="h-4" width="90%" />
        <Skeleton className="h-4" width="85%" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 4, className = '' }: { columns?: number; className?: string }) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4" width={i === 0 ? '80%' : '60%'} />
        </td>
      ))}
    </tr>
  )
}