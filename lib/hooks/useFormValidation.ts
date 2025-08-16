'use client'

import React from 'react'
import { 
  validateForm, 
  validateField, 
  ValidationRule, 
  ValidationResult,
  FieldValidationResult 
} from '@/lib/validation'
import { useErrorLogger } from '@/lib/error-logging'

export interface FormField<T = any> {
  value: T
  error?: string
  touched: boolean
  dirty: boolean
}

export interface FormState<T extends Record<string, any>> {
  fields: Record<keyof T, FormField>
  isValid: boolean
  isSubmitting: boolean
  hasErrors: boolean
  isDirty: boolean
  submitCount: number
}

export interface FormActions<T extends Record<string, any>> {
  setValue: (field: keyof T, value: any) => void
  setError: (field: keyof T, error: string) => void
  clearError: (field: keyof T) => void
  clearAllErrors: () => void
  setTouched: (field: keyof T, touched?: boolean) => void
  setFieldState: (field: keyof T, state: Partial<FormField>) => void
  validateField: (field: keyof T) => boolean
  validateForm: () => boolean
  reset: (newValues?: Partial<T>) => void
  submit: (onSubmit: (values: T) => Promise<void> | void) => Promise<void>
}

export interface UseFormValidationOptions<T extends Record<string, any>> {
  initialValues: T
  validationSchema: Record<keyof T, ValidationRule<any>[]>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  onSubmit?: (values: T) => Promise<void> | void
  onError?: (errors: Record<keyof T, string>) => void
  formName?: string
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  validateOnChange = false,
  validateOnBlur = true,
  validateOnSubmit = true,
  onSubmit,
  onError,
  formName = 'form'
}: UseFormValidationOptions<T>): [FormState<T>, FormActions<T>] {
  const { logFormError } = useErrorLogger()

  // Initialize form state
  const [state, setState] = React.useState<FormState<T>>(() => {
    const fields: Record<keyof T, FormField> = {} as Record<keyof T, FormField>
    
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        touched: false,
        dirty: false
      }
    }

    return {
      fields,
      isValid: true,
      isSubmitting: false,
      hasErrors: false,
      isDirty: false,
      submitCount: 0
    }
  })

  // Get current form values
  const getValues = React.useCallback((): T => {
    const values: Partial<T> = {}
    for (const key in state.fields) {
      values[key] = state.fields[key].value
    }
    return values as T
  }, [state.fields])

  // Validate a single field
  const validateSingleField = React.useCallback((field: keyof T, value: any): FieldValidationResult => {
    const rules = validationSchema[field] || []
    return validateField(value, rules)
  }, [validationSchema])

  // Validate entire form
  const validateEntireForm = React.useCallback((): ValidationResult & { fieldErrors: Record<keyof T, string | undefined> } => {
    const values = getValues()
    return validateForm(values, validationSchema)
  }, [getValues, validationSchema])

  // Update form state
  const updateState = React.useCallback((updater: (prev: FormState<T>) => FormState<T>) => {
    setState(prev => {
      const newState = updater(prev)
      
      // Calculate derived state
      const hasErrors = Object.values(newState.fields).some(field => !!field.error)
      const isDirty = Object.values(newState.fields).some(field => field.dirty)
      const isValid = !hasErrors

      return {
        ...newState,
        hasErrors,
        isDirty,
        isValid
      }
    })
  }, [])

  // Actions
  const setValue = React.useCallback((field: keyof T, value: any) => {
    updateState(prev => {
      const fieldState = prev.fields[field]
      const newFieldState: FormField = {
        ...fieldState,
        value,
        dirty: value !== initialValues[field]
      }

      // Validate on change if enabled
      if (validateOnChange && fieldState.touched) {
        const validation = validateSingleField(field, value)
        if (!validation.isValid) {
          newFieldState.error = validation.error
          logFormError(formName, String(field), validation.error!, value)
        } else {
          newFieldState.error = undefined
        }
      }

      return {
        ...prev,
        fields: {
          ...prev.fields,
          [field]: newFieldState
        }
      }
    })
  }, [updateState, validateOnChange, validateSingleField, initialValues, logFormError, formName])

  const setError = React.useCallback((field: keyof T, error: string) => {
    updateState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          error
        }
      }
    }))
  }, [updateState])

  const clearError = React.useCallback((field: keyof T) => {
    updateState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          error: undefined
        }
      }
    }))
  }, [updateState])

  const clearAllErrors = React.useCallback(() => {
    updateState(prev => {
      const newFields = { ...prev.fields }
      for (const key in newFields) {
        newFields[key] = {
          ...newFields[key],
          error: undefined
        }
      }
      return {
        ...prev,
        fields: newFields
      }
    })
  }, [updateState])

  const setTouched = React.useCallback((field: keyof T, touched = true) => {
    updateState(prev => {
      const fieldState = prev.fields[field]
      const newFieldState: FormField = {
        ...fieldState,
        touched
      }

      // Validate on blur if enabled and field is being touched
      if (validateOnBlur && touched && !fieldState.touched) {
        const validation = validateSingleField(field, fieldState.value)
        if (!validation.isValid) {
          newFieldState.error = validation.error
          logFormError(formName, String(field), validation.error!, fieldState.value)
        }
      }

      return {
        ...prev,
        fields: {
          ...prev.fields,
          [field]: newFieldState
        }
      }
    })
  }, [updateState, validateOnBlur, validateSingleField, logFormError, formName])

  const setFieldState = React.useCallback((field: keyof T, fieldState: Partial<FormField>) => {
    updateState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          ...fieldState
        }
      }
    }))
  }, [updateState])

  const validateFieldAction = React.useCallback((field: keyof T): boolean => {
    const fieldState = state.fields[field]
    const validation = validateSingleField(field, fieldState.value)
    
    if (!validation.isValid) {
      setError(field, validation.error!)
      logFormError(formName, String(field), validation.error!, fieldState.value)
      return false
    } else {
      clearError(field)
      return true
    }
  }, [state.fields, validateSingleField, setError, clearError, logFormError, formName])

  const validateFormAction = React.useCallback((): boolean => {
    const validation = validateEntireForm()
    
    // Update all field errors
    updateState(prev => {
      const newFields = { ...prev.fields }
      
      for (const key in newFields) {
        const fieldError = validation.fieldErrors[key]
        newFields[key] = {
          ...newFields[key],
          error: fieldError,
          touched: true // Mark all fields as touched during form validation
        }
        
        // Log validation errors
        if (fieldError) {
          logFormError(formName, String(key), fieldError, newFields[key].value)
        }
      }
      
      return {
        ...prev,
        fields: newFields
      }
    })

    // Call onError callback if there are errors
    if (!validation.isValid && onError) {
      const errorMap: Record<keyof T, string> = {} as Record<keyof T, string>
      for (const key in validation.fieldErrors) {
        if (validation.fieldErrors[key]) {
          errorMap[key] = validation.fieldErrors[key]!
        }
      }
      onError(errorMap)
    }

    return validation.isValid
  }, [validateEntireForm, updateState, onError, logFormError, formName])

  const reset = React.useCallback((newValues?: Partial<T>) => {
    const resetValues = { ...initialValues, ...newValues }
    
    setState(() => {
      const fields: Record<keyof T, FormField> = {} as Record<keyof T, FormField>
      
      for (const key in resetValues) {
        fields[key] = {
          value: resetValues[key],
          touched: false,
          dirty: false
        }
      }

      return {
        fields,
        isValid: true,
        isSubmitting: false,
        hasErrors: false,
        isDirty: false,
        submitCount: 0
      }
    })
  }, [initialValues])

  const submit = React.useCallback(async (submitHandler?: (values: T) => Promise<void> | void) => {
    const handler = submitHandler || onSubmit
    if (!handler) {
      console.warn('No submit handler provided')
      return
    }

    updateState(prev => ({
      ...prev,
      isSubmitting: true,
      submitCount: prev.submitCount + 1
    }))

    try {
      // Validate form if enabled
      if (validateOnSubmit) {
        const isValid = validateFormAction()
        if (!isValid) {
          return
        }
      }

      // Submit form
      const values = getValues()
      await handler(values)
      
    } catch (error) {
      console.error('Form submission error:', error)
      
      // Log submission error
      logFormError(
        formName, 
        'submit', 
        error instanceof Error ? error.message : 'Submission failed',
        getValues()
      )
      
      throw error
    } finally {
      updateState(prev => ({
        ...prev,
        isSubmitting: false
      }))
    }
  }, [onSubmit, updateState, validateOnSubmit, validateFormAction, getValues, logFormError, formName])

  // Create field helpers
  const createFieldProps = React.useCallback((field: keyof T) => ({
    value: state.fields[field].value,
    error: state.fields[field].error,
    touched: state.fields[field].touched,
    dirty: state.fields[field].dirty,
    onChange: (value: any) => setValue(field, value),
    onBlur: () => setTouched(field, true),
    onFocus: () => setTouched(field, true)
  }), [state.fields, setValue, setTouched])

  const actions: FormActions<T> = {
    setValue,
    setError,
    clearError,
    clearAllErrors,
    setTouched,
    setFieldState,
    validateField: validateFieldAction,
    validateForm: validateFormAction,
    reset,
    submit
  }

  // Add field helpers to actions
  const actionsWithHelpers = {
    ...actions,
    getFieldProps: createFieldProps,
    getValues
  }

  return [state, actionsWithHelpers]
}

// Utility hook for simple field validation
export function useFieldValidation<T>(
  initialValue: T,
  rules: ValidationRule<T>[],
  options: {
    validateOnChange?: boolean
    validateOnBlur?: boolean
    fieldName?: string
    formName?: string
  } = {}
) {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    fieldName = 'field',
    formName = 'form'
  } = options

  const { logFormError } = useErrorLogger()
  
  const [value, setValue] = React.useState<T>(initialValue)
  const [error, setError] = React.useState<string | undefined>()
  const [touched, setTouched] = React.useState(false)
  const [dirty, setDirty] = React.useState(false)

  const validate = React.useCallback((val: T): boolean => {
    const result = validateField(val, rules)
    
    if (!result.isValid) {
      setError(result.error)
      logFormError(formName, fieldName, result.error!, val)
      return false
    } else {
      setError(undefined)
      return true
    }
  }, [rules, logFormError, formName, fieldName])

  const handleChange = React.useCallback((newValue: T) => {
    setValue(newValue)
    setDirty(newValue !== initialValue)
    
    if (validateOnChange && touched) {
      validate(newValue)
    }
  }, [validate, validateOnChange, touched, initialValue])

  const handleBlur = React.useCallback(() => {
    setTouched(true)
    if (validateOnBlur) {
      validate(value)
    }
  }, [validate, validateOnBlur, value])

  const reset = React.useCallback((newValue?: T) => {
    const resetValue = newValue !== undefined ? newValue : initialValue
    setValue(resetValue)
    setError(undefined)
    setTouched(false)
    setDirty(false)
  }, [initialValue])

  return {
    value,
    error,
    touched,
    dirty,
    isValid: !error,
    setValue: handleChange,
    setError,
    clearError: () => setError(undefined),
    onBlur: handleBlur,
    onFocus: () => setTouched(true),
    validate: () => validate(value),
    reset
  }
}

export default useFormValidation