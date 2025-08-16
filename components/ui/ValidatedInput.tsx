'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExclamationCircleIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { FieldError } from './ErrorMessage'
import { ValidationRule, validateField } from '@/lib/validation'

interface BaseInputProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  containerClassName?: string
  labelClassName?: string
  helpText?: string
  showValidIcon?: boolean
}

interface ValidatedInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  error?: string
  touched?: boolean
  validationRules?: ValidationRule<string>[]
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

interface ValidatedTextareaProps extends BaseInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  error?: string
  touched?: boolean
  validationRules?: ValidationRule<string>[]
  validateOnChange?: boolean
  validateOnBlur?: boolean
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

interface ValidatedSelectProps extends BaseInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  error?: string
  touched?: boolean
  validationRules?: ValidationRule<string>[]
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

// Base input styling
const baseInputClasses = `
  w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg
  text-white placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`

const errorInputClasses = `
  border-red-500 focus:ring-red-500
`

const validInputClasses = `
  border-green-500 focus:ring-green-500
`

// Validated Input Component
export function ValidatedInput({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  helpText,
  showValidIcon = true,
  validationRules = [],
  validateOnChange = false,
  validateOnBlur = true
}: ValidatedInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | undefined>()
  const [isValid, setIsValid] = React.useState(false)

  const displayError = error || localError
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  // Validation function
  const validate = React.useCallback((val: string) => {
    if (validationRules.length === 0) return true

    const result = validateField(val, validationRules)
    setLocalError(result.error)
    setIsValid(result.isValid)
    return result.isValid
  }, [validationRules])

  // Handle change with optional validation
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    if (validateOnChange && touched) {
      validate(newValue)
    }
  }, [onChange, validateOnChange, touched, validate])

  // Handle blur with optional validation
  const handleBlur = React.useCallback(() => {
    if (validateOnBlur) {
      validate(value)
    }
    onBlur?.()
  }, [validateOnBlur, validate, value, onBlur])

  // Determine input styling
  const getInputClasses = () => {
    let classes = baseInputClasses
    
    if (displayError && touched) {
      classes += ` ${errorInputClasses}`
    } else if (isValid && touched && showValidIcon) {
      classes += ` ${validInputClasses}`
    }
    
    if (isPassword) {
      classes += ' pr-12' // Space for password toggle
    } else if (isValid && touched && showValidIcon) {
      classes += ' pr-12' // Space for valid icon
    }
    
    return `${classes} ${className}`
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={getInputClasses()}
        />
        
        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
        
        {/* Valid icon */}
        {!isPassword && isValid && touched && showValidIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      <FieldError error={displayError} touched={touched} />
      
      {/* Help text */}
      {helpText && !displayError && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  )
}

// Validated Textarea Component
export function ValidatedTextarea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  helpText,
  showValidIcon = true,
  validationRules = [],
  validateOnChange = false,
  validateOnBlur = true,
  rows = 4,
  maxLength,
  showCharCount = false
}: ValidatedTextareaProps) {
  const [localError, setLocalError] = React.useState<string | undefined>()
  const [isValid, setIsValid] = React.useState(false)

  const displayError = error || localError
  const charCount = value.length
  const isOverLimit = maxLength ? charCount > maxLength : false

  // Validation function
  const validate = React.useCallback((val: string) => {
    if (validationRules.length === 0) return true

    const result = validateField(val, validationRules)
    setLocalError(result.error)
    setIsValid(result.isValid)
    return result.isValid
  }, [validationRules])

  // Handle change with optional validation
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    // Respect maxLength
    if (maxLength && newValue.length > maxLength) {
      return
    }
    
    onChange(newValue)

    if (validateOnChange && touched) {
      validate(newValue)
    }
  }, [onChange, validateOnChange, touched, validate, maxLength])

  // Handle blur with optional validation
  const handleBlur = React.useCallback(() => {
    if (validateOnBlur) {
      validate(value)
    }
    onBlur?.()
  }, [validateOnBlur, validate, value, onBlur])

  // Determine textarea styling
  const getTextareaClasses = () => {
    let classes = baseInputClasses
    
    if (displayError && touched) {
      classes += ` ${errorInputClasses}`
    } else if (isValid && touched && showValidIcon) {
      classes += ` ${validInputClasses}`
    }
    
    return `${classes} ${className} resize-none`
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={getTextareaClasses()}
        />
        
        {/* Valid icon */}
        {isValid && touched && showValidIcon && (
          <div className="absolute right-3 top-3">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
        )}
      </div>
      
      {/* Character count */}
      {showCharCount && maxLength && (
        <div className="flex justify-end">
          <span className={`text-sm ${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
            {charCount}/{maxLength}
          </span>
        </div>
      )}
      
      {/* Error message */}
      <FieldError error={displayError} touched={touched} />
      
      {/* Help text */}
      {helpText && !displayError && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  )
}

// Validated Select Component
export function ValidatedSelect({
  label,
  placeholder = 'Select an option...',
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  helpText,
  showValidIcon = true,
  validationRules = [],
  options
}: ValidatedSelectProps) {
  const [localError, setLocalError] = React.useState<string | undefined>()
  const [isValid, setIsValid] = React.useState(false)

  const displayError = error || localError

  // Validation function
  const validate = React.useCallback((val: string) => {
    if (validationRules.length === 0) return true

    const result = validateField(val, validationRules)
    setLocalError(result.error)
    setIsValid(result.isValid)
    return result.isValid
  }, [validationRules])

  // Handle change with validation
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    validate(newValue)
  }, [onChange, validate])

  // Handle blur
  const handleBlur = React.useCallback(() => {
    validate(value)
    onBlur?.()
  }, [validate, value, onBlur])

  // Determine select styling
  const getSelectClasses = () => {
    let classes = baseInputClasses
    
    if (displayError && touched) {
      classes += ` ${errorInputClasses}`
    } else if (isValid && touched && showValidIcon) {
      classes += ` ${validInputClasses}`
    }
    
    if (isValid && touched && showValidIcon) {
      classes += ' pr-12' // Space for valid icon
    }
    
    return `${classes} ${className}`
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={getSelectClasses()}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Valid icon */}
        {isValid && touched && showValidIcon && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      <FieldError error={displayError} touched={touched} />
      
      {/* Help text */}
      {helpText && !displayError && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  )
}

export default ValidatedInput