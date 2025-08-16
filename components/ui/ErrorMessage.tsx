'use client'

import React from 'react'
import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export type ErrorType = 'error' | 'warning' | 'info' | 'success'

interface ErrorMessageProps {
  message: string
  type?: ErrorType
  className?: string
  onDismiss?: () => void
  dismissible?: boolean
  icon?: boolean
}

interface FieldErrorProps {
  error?: string
  touched?: boolean
  className?: string
}

interface ErrorListProps {
  errors: string[]
  type?: ErrorType
  className?: string
  title?: string
}

const iconMap = {
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon
}

const colorMap = {
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: 'text-red-400'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    icon: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: 'text-blue-400'
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    icon: 'text-green-400'
  }
}

// Main error message component
export function ErrorMessage({ 
  message, 
  type = 'error', 
  className = '', 
  onDismiss,
  dismissible = false,
  icon = true
}: ErrorMessageProps) {
  const Icon = iconMap[type]
  const colors = colorMap[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border
        ${colors.bg} ${colors.border}
        ${className}
      `}
    >
      {icon && (
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
      )}
      
      <div className="flex-1">
        <p className={`text-sm ${colors.text}`}>
          {message}
        </p>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors ${colors.text}`}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

// Field-specific error message
export function FieldError({ error, touched, className = '' }: FieldErrorProps) {
  return (
    <AnimatePresence>
      {error && touched && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mt-1 ${className}`}
        >
          <p className="text-sm text-red-400 flex items-center gap-2">
            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
            {error}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// List of errors
export function ErrorList({ 
  errors, 
  type = 'error', 
  className = '', 
  title = 'Please fix the following errors:' 
}: ErrorListProps) {
  if (errors.length === 0) return null

  const colors = colorMap[type]
  const Icon = iconMap[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-lg border
        ${colors.bg} ${colors.border}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
        
        <div className="flex-1">
          <h4 className={`text-sm font-medium mb-2 ${colors.text}`}>
            {title}
          </h4>
          
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`text-sm ${colors.text} flex items-start gap-2`}
              >
                <span className="text-xs mt-1.5">•</span>
                <span>{error}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// Toast notification for errors
export function ErrorToast({ 
  message, 
  type = 'error', 
  onDismiss,
  autoHide = true,
  duration = 5000 
}: ErrorMessageProps & { autoHide?: boolean; duration?: number }) {
  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, onDismiss])

  const colors = colorMap[type]
  const Icon = iconMap[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        ${colors.bg} ${colors.border}
      `}
    >
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
      
      <div className="flex-1">
        <p className={`text-sm ${colors.text}`}>
          {message}
        </p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors ${colors.text}`}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

// Hook for managing error states
export function useErrorState(initialError?: string) {
  const [error, setError] = React.useState<string | undefined>(initialError)
  const [isVisible, setIsVisible] = React.useState(!!initialError)

  const showError = React.useCallback((message: string) => {
    setError(message)
    setIsVisible(true)
  }, [])

  const hideError = React.useCallback(() => {
    setIsVisible(false)
    // Clear error after animation completes
    setTimeout(() => setError(undefined), 200)
  }, [])

  const clearError = React.useCallback(() => {
    setError(undefined)
    setIsVisible(false)
  }, [])

  return {
    error,
    isVisible,
    showError,
    hideError,
    clearError,
    hasError: !!error
  }
}

export default ErrorMessage