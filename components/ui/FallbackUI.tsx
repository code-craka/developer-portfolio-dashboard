'use client'

import React from 'react'
import { 
  ExclamationCircleIcon, 
  ArrowPathIcon, 
  WifiIcon, 
  SignalSlashIcon, 
  CircleStackIcon, 
  PhotoIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface FallbackUIProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    loading?: boolean
  }
  className?: string
}

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

// Generic fallback UI component
export function FallbackUI({ 
  title, 
  description, 
  icon, 
  action, 
  className = '' 
}: FallbackUIProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-500/10">
        {icon || <ExclamationCircleIcon className="w-8 h-8 text-gray-400" />}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-sm">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          disabled={action.loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {action.loading ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowPathIcon className="w-4 h-4" />
          )}
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

// Network error fallback
export function NetworkErrorFallback({ onRetry }: { onRetry?: () => void }) {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <FallbackUI
      title={isOnline ? "Connection Error" : "You're Offline"}
      description={
        isOnline 
          ? "Unable to connect to the server. Please check your connection and try again."
          : "Please check your internet connection and try again."
      }
      icon={isOnline ? <WifiIcon className="w-8 h-8 text-red-400" /> : <SignalSlashIcon className="w-8 h-8 text-red-400" />}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
    />
  )
}

// Database error fallback
export function DatabaseErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <FallbackUI
      title="Database Error"
      description="Unable to connect to the database. This might be a temporary issue."
      icon={<CircleStackIcon className="w-8 h-8 text-red-400" />}
      action={onRetry ? {
        label: "Retry Connection",
        onClick: onRetry
      } : undefined}
    />
  )
}

// Image loading error fallback
export function ImageErrorFallback({ 
  onRetry, 
  showPlaceholder = true 
}: { 
  onRetry?: () => void
  showPlaceholder?: boolean 
}) {
  if (!showPlaceholder) {
    return (
      <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
        <PhotoIcon className="w-8 h-8 text-gray-500" />
      </div>
    )
  }

  return (
    <FallbackUI
      title="Image Failed to Load"
      description="The image could not be loaded. Please try again or check your connection."
      icon={<PhotoIcon className="w-8 h-8 text-red-400" />}
      action={onRetry ? {
        label: "Retry",
        onClick: onRetry
      } : undefined}
      className="min-h-[200px]"
    />
  )
}

// File not found fallback
export function NotFoundFallback({ 
  resource = "page",
  onGoHome 
}: { 
  resource?: string
  onGoHome?: () => void 
}) {
  return (
    <FallbackUI
      title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
      description={`The ${resource} you're looking for doesn't exist or has been moved.`}
      icon={<DocumentIcon className="w-8 h-8 text-red-400" />}
      action={onGoHome ? {
        label: "Go Home",
        onClick: onGoHome
      } : undefined}
    />
  )
}

// Empty state component
export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gray-500/5 border border-gray-500/10">
        {icon || <InboxIcon className="w-10 h-10 text-gray-500" />}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

// Specific empty states
export function EmptyProjectsState({ onAddProject }: { onAddProject?: () => void }) {
  return (
    <EmptyState
      title="No Projects Yet"
      description="Start building your portfolio by adding your first project. Showcase your skills and experience to potential employers."
      icon={<MagnifyingGlassIcon className="w-10 h-10 text-gray-500" />}
      action={onAddProject ? {
        label: "Add Your First Project",
        onClick: onAddProject
      } : undefined}
    />
  )
}

export function EmptyExperienceState({ onAddExperience }: { onAddExperience?: () => void }) {
  return (
    <EmptyState
      title="No Experience Added"
      description="Add your work experience to showcase your professional journey and career progression."
      icon={<Cog6ToothIcon className="w-10 h-10 text-gray-500" />}
      action={onAddExperience ? {
        label: "Add Experience",
        onClick: onAddExperience
      } : undefined}
    />
  )
}

export function EmptyMessagesState() {
  return (
    <EmptyState
      title="No Messages"
      description="When visitors contact you through the portfolio, their messages will appear here."
      icon={<InboxIcon className="w-10 h-10 text-gray-500" />}
    />
  )
}

// Loading fallback with skeleton
export function LoadingFallback({ 
  title = "Loading...", 
  description = "Please wait while we load your content.",
  showSkeleton = false 
}: { 
  title?: string
  description?: string
  showSkeleton?: boolean 
}) {
  if (showSkeleton) {
    return (
      <div className="space-y-4 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <FallbackUI
      title={title}
      description={description}
      icon={<ArrowPathIcon className="w-8 h-8 text-blue-400 animate-spin" />}
    />
  )
}

export default FallbackUI