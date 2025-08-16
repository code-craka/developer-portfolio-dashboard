'use client'

import React, { createContext, useContext, useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ErrorToast, ErrorType } from './ErrorMessage'

export interface Toast {
  id: string
  message: string
  type: ErrorType
  duration?: number
  dismissible?: boolean
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
  // Convenience methods
  showError: (message: string, duration?: number) => string
  showWarning: (message: string, duration?: number) => string
  showInfo: (message: string, duration?: number) => string
  showSuccess: (message: string, duration?: number) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
  maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const generateId = useCallback(() => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = generateId()
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      // Limit number of toasts
      return updated.slice(0, maxToasts)
    })

    return id
  }, [generateId, maxToasts])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const showError = useCallback((message: string, duration?: number) => {
    return addToast({ message, type: 'error', duration })
  }, [addToast])

  const showWarning = useCallback((message: string, duration?: number) => {
    return addToast({ message, type: 'warning', duration })
  }, [addToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    return addToast({ message, type: 'info', duration })
  }, [addToast])

  const showSuccess = useCallback((message: string, duration?: number) => {
    return addToast({ message, type: 'success', duration })
  }, [addToast])

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showError,
    showWarning,
    showInfo,
    showSuccess
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <ErrorToast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onDismiss={() => removeToast(toast.id)}
                autoHide={toast.duration !== 0}
                dismissible={toast.dismissible}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Hook for API error handling with toasts
export function useApiErrorToast() {
  const { showError, showSuccess, showWarning } = useToast()

  const handleApiError = useCallback((error: any, customMessage?: string) => {
    const message = customMessage || 
      (error?.message || 'An unexpected error occurred')
    
    showError(message)
  }, [showError])

  const handleApiSuccess = useCallback((message: string) => {
    showSuccess(message)
  }, [showSuccess])

  const handleApiWarning = useCallback((message: string) => {
    showWarning(message)
  }, [showWarning])

  return {
    handleApiError,
    handleApiSuccess,
    handleApiWarning,
    showError,
    showSuccess,
    showWarning
  }
}

export default ToastProvider