// Comprehensive form validation utilities for the developer portfolio dashboard
// Extends the existing security validation with client-side validation

export interface ValidationRule<T = any> {
  validate: (value: T) => boolean
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

// Generic validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule<any> => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.trim().length >= min,
    message: message || `Must be at least ${min} characters long`
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.trim().length <= max,
    message: message || `Must be no more than ${max} characters long`
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule<string> => ({
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) && value.length <= 254
    },
    message
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value.trim()) return true // Optional URL
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message
  }),

  githubUrl: (message = 'Please enter a valid GitHub URL'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value.trim()) return true // Optional
      try {
        const url = new URL(value)
        return url.hostname === 'github.com' && url.pathname.length > 1
      } catch {
        return false
      }
    },
    message
  }),

  arrayMinLength: (min: number, message?: string): ValidationRule<any[]> => ({
    validate: (value) => Array.isArray(value) && value.length >= min,
    message: message || `Must have at least ${min} item${min !== 1 ? 's' : ''}`
  }),

  dateRange: (startDate: Date | null, message = 'End date must be after start date'): ValidationRule<Date | null> => ({
    validate: (endDate) => {
      if (!endDate || !startDate) return true
      return endDate >= startDate
    },
    message
  }),

  fileSize: (maxSizeBytes: number, message?: string): ValidationRule<File> => ({
    validate: (file) => file.size <= maxSizeBytes,
    message: message || `File size must be less than ${Math.round(maxSizeBytes / (1024 * 1024))}MB`
  }),

  fileType: (allowedTypes: string[], message?: string): ValidationRule<File> => ({
    validate: (file) => allowedTypes.includes(file.type),
    message: message || `File type must be one of: ${allowedTypes.join(', ')}`
  })
}

// Validate a single field with multiple rules
export function validateField<T>(value: T, rules: ValidationRule<T>[]): FieldValidationResult {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return {
        isValid: false,
        error: rule.message
      }
    }
  }
  
  return { isValid: true }
}

// Validate multiple fields
export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ValidationRule<any>[]>
): ValidationResult & { fieldErrors: Record<keyof T, string | undefined> } {
  const errors: string[] = []
  const fieldErrors: Record<keyof T, string | undefined> = {} as Record<keyof T, string | undefined>

  for (const [field, rules] of Object.entries(schema) as [keyof T, ValidationRule<any>[]][]) {
    const fieldResult = validateField(data[field], rules)
    if (!fieldResult.isValid) {
      errors.push(`${String(field)}: ${fieldResult.error}`)
      fieldErrors[field] = fieldResult.error
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  }
}

// Real-time validation hook for React components
export function useFieldValidation<T>(
  initialValue: T,
  rules: ValidationRule<T>[],
  validateOnChange = true
) {
  const [value, setValue] = React.useState<T>(initialValue)
  const [error, setError] = React.useState<string | undefined>()
  const [touched, setTouched] = React.useState(false)

  const validate = React.useCallback((val: T) => {
    const result = validateField(val, rules)
    setError(result.error)
    return result.isValid
  }, [rules])

  const handleChange = React.useCallback((newValue: T) => {
    setValue(newValue)
    if (validateOnChange && touched) {
      validate(newValue)
    }
  }, [validate, validateOnChange, touched])

  const handleBlur = React.useCallback(() => {
    setTouched(true)
    validate(value)
  }, [validate, value])

  const reset = React.useCallback(() => {
    setValue(initialValue)
    setError(undefined)
    setTouched(false)
  }, [initialValue])

  return {
    value,
    error,
    touched,
    isValid: !error,
    setValue: handleChange,
    onBlur: handleBlur,
    validate: () => validate(value),
    reset
  }
}

// Specific validation schemas for forms
export const projectValidationSchema = {
  title: [
    validationRules.required('Project title is required'),
    validationRules.minLength(3, 'Title must be at least 3 characters'),
    validationRules.maxLength(100, 'Title must be less than 100 characters')
  ],
  description: [
    validationRules.required('Project description is required'),
    validationRules.minLength(10, 'Description must be at least 10 characters'),
    validationRules.maxLength(1000, 'Description must be less than 1000 characters')
  ],
  techStack: [
    validationRules.required('At least one technology is required'),
    validationRules.arrayMinLength(1, 'At least one technology must be selected')
  ],
  githubUrl: [
    validationRules.githubUrl('Please enter a valid GitHub URL')
  ],
  demoUrl: [
    validationRules.url('Please enter a valid demo URL')
  ],
  imageUrl: [
    validationRules.required('Project image is required')
  ],
  featured: []
}

export const contactValidationSchema = {
  name: [
    validationRules.required('Name is required'),
    validationRules.minLength(2, 'Name must be at least 2 characters'),
    validationRules.maxLength(100, 'Name must be less than 100 characters')
  ],
  email: [
    validationRules.required('Email is required'),
    validationRules.email('Please enter a valid email address')
  ],
  message: [
    validationRules.required('Message is required'),
    validationRules.minLength(10, 'Message must be at least 10 characters'),
    validationRules.maxLength(2000, 'Message must be less than 2000 characters')
  ]
}

export const experienceValidationSchema = {
  company: [
    validationRules.required('Company name is required'),
    validationRules.minLength(2, 'Company name must be at least 2 characters'),
    validationRules.maxLength(100, 'Company name must be less than 100 characters')
  ],
  position: [
    validationRules.required('Position is required'),
    validationRules.minLength(2, 'Position must be at least 2 characters'),
    validationRules.maxLength(100, 'Position must be less than 100 characters')
  ],
  description: [
    validationRules.required('Description is required'),
    validationRules.minLength(10, 'Description must be at least 10 characters'),
    validationRules.maxLength(2000, 'Description must be less than 2000 characters')
  ],
  location: [
    validationRules.required('Location is required'),
    validationRules.minLength(2, 'Location must be at least 2 characters'),
    validationRules.maxLength(100, 'Location must be less than 100 characters')
  ],
  employmentType: [
    validationRules.required('Employment type is required')
  ]
}

// File upload validation
export const fileValidationRules = {
  projectImage: [
    validationRules.fileSize(5 * 1024 * 1024, 'Image must be less than 5MB'),
    validationRules.fileType(['image/jpeg', 'image/png', 'image/webp'], 'Only JPEG, PNG, and WebP images are allowed')
  ],
  companyLogo: [
    validationRules.fileSize(2 * 1024 * 1024, 'Logo must be less than 2MB'),
    validationRules.fileType(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'], 'Only JPEG, PNG, WebP, and SVG images are allowed')
  ]
}

// Import React for the hook
import React from 'react'