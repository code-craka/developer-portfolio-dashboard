'use client'

import { useEffect, useState, useCallback } from 'react'

interface NotificationSystemProps {
  type: 'success' | 'error'
  message: string
  onClose: () => void
  duration?: number
}

export default function NotificationSystem({ 
  type, 
  message, 
  onClose, 
  duration = 5000 
}: NotificationSystemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300) // Match animation duration
  }, [onClose])

  useEffect(() => {
    // Show notification
    setIsVisible(true)

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(hideTimer)
  }, [duration, handleClose])

  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    } else {
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  }

  const getStyles = () => {
    const baseStyles = "glassmorphism-card border-l-4 shadow-lg"
    
    if (type === 'success') {
      return `${baseStyles} border-l-green-500 bg-green-500/10`
    } else {
      return `${baseStyles} border-l-red-500 bg-red-500/10`
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${getStyles()}
          transform transition-all duration-300 ease-in-out
          ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          max-w-sm w-full
        `}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {message}
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-${duration} ease-linear ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{
              width: isVisible && !isExiting ? '0%' : '100%',
              transitionDuration: `${duration}ms`
            }}
          />
        </div>
      </div>
    </div>
  )
}