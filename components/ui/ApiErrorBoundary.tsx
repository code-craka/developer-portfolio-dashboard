'use client'

import React from 'react'
import { ExclamationCircleIcon, ArrowPathIcon, WifiIcon, SignalSlashIcon } from '@heroicons/react/24/outline'
import ErrorBoundary from './ErrorBoundary'

interface ApiErrorBoundaryProps {
  children: React.ReactNode
  onRetry?: () => void
  fallbackMessage?: string
}

export function ApiErrorFallback({ 
  onRetry, 
  fallbackMessage = "Failed to load data" 
}: { 
  onRetry?: () => void
  fallbackMessage?: string 
}) {
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
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-500/10">
        {isOnline ? (
          <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
        ) : (
          <SignalSlashIcon className="w-8 h-8 text-red-400" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {isOnline ? fallbackMessage : "You're offline"}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-sm">
        {isOnline 
          ? "There was a problem loading the data. Please check your connection and try again."
          : "Please check your internet connection and try again."
        }
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        {isOnline ? (
          <WifiIcon className="w-4 h-4 text-green-400" />
        ) : (
          <SignalSlashIcon className="w-4 h-4 text-red-400" />
        )}
        <span>{isOnline ? "Connected" : "Disconnected"}</span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={!isOnline}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

export function ApiErrorBoundary({ 
  children, 
  onRetry, 
  fallbackMessage 
}: ApiErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <ApiErrorFallback 
          onRetry={onRetry} 
          fallbackMessage={fallbackMessage} 
        />
      }
      onError={(error, errorInfo) => {
        // Log API-specific errors
        console.error('API Error Boundary:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ApiErrorBoundary