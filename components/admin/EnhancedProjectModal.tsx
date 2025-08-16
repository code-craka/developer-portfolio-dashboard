'use client'

import React from 'react'
import { Project, ApiResponse } from '@/lib/types'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from '@/components/ui/ValidatedInput'
import { ErrorMessage, ErrorList } from '@/components/ui/ErrorMessage'
import { useFormValidation } from '@/lib/hooks/useFormValidation'
import { projectValidationSchema, fileValidationRules } from '@/lib/validation'
import { useApiErrorHandler, getUserFriendlyErrorMessage } from '@/lib/api-error-handler'
import { useToast } from '@/components/ui/ToastProvider'
import { useErrorLogger } from '@/lib/error-logging'
import ApiErrorBoundary from '@/components/ui/ApiErrorBoundary'
import { XMarkIcon, ArrowUpTrayIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ProjectModalProps {
  project: Project | null
  onSave: (projectData: any) => void
  onClose: () => void
}

interface ProjectFormData {
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  demoUrl: string
  featured: boolean
  imageUrl: string
}

export default function EnhancedProjectModal({ project, onSave, onClose }: ProjectModalProps) {
  const { showError, showSuccess } = useToast()
  const { logActionError } = useErrorLogger()
  const { handleApiCall, error: apiError, isLoading } = useApiErrorHandler()

  // Form state
  const [formState, formActions] = useFormValidation<ProjectFormData>({
    initialValues: {
      title: project?.title || '',
      description: project?.description || '',
      techStack: project?.techStack || [],
      githubUrl: project?.githubUrl || '',
      demoUrl: project?.demoUrl || '',
      featured: project?.featured || false,
      imageUrl: project?.imageUrl || ''
    },
    validationSchema: projectValidationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    formName: 'project-modal'
  })

  // Additional state for image handling
  const [techInput, setTechInput] = React.useState('')
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>(project?.imageUrl || '')
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Reset form when project changes
  React.useEffect(() => {
    if (project) {
      formActions.reset({
        title: project.title,
        description: project.description,
        techStack: [...project.techStack],
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        featured: project.featured,
        imageUrl: project.imageUrl
      })
      setImagePreview(project.imageUrl)
    } else {
      formActions.reset()
      setImagePreview('')
    }
    setTechInput('')
    setImageFile(null)
  }, [project, formActions])

  // Tech stack management
  const handleTechInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTechStack()
    }
  }

  const addTechStack = () => {
    const tech = techInput.trim()
    if (tech && !formState.fields.techStack.value.includes(tech)) {
      const newTechStack = [...formState.fields.techStack.value, tech]
      formActions.setValue('techStack', newTechStack)
      setTechInput('')
    }
  }

  const removeTechStack = (index: number) => {
    const newTechStack = formState.fields.techStack.value.filter((_: string, i: number) => i !== index)
    formActions.setValue('techStack', newTechStack)
  }

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Validate file using validation rules
      const validation = fileValidationRules.projectImage.find(rule => !rule.validate(file))
      if (validation) {
        showError(validation.message)
        logActionError('image_upload_validation', validation.message, { filename: file.name, size: file.size, type: file.type })
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

    } catch (error) {
      const errorMessage = 'Failed to process image file'
      showError(errorMessage)
      logActionError('image_file_processing', error instanceof Error ? error : errorMessage, { filename: file.name })
    }
  }

  // Upload image
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formState.fields.imageUrl.value || null

    setUploading(true)
    
    return handleApiCall(
      async () => {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('type', 'project')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const data: ApiResponse = await response.json()

        if (!data.success || !data.data?.imageUrl) {
          throw new Error(data.error || 'Failed to upload image')
        }

        return data.data.imageUrl
      },
      (imageUrl) => {
        showSuccess('Image uploaded successfully')
        return imageUrl
      },
      (error) => {
        const message = getUserFriendlyErrorMessage(error)
        showError(`Image upload failed: ${message}`)
        logActionError('image_upload', error, { filename: imageFile.name })
      }
    ).finally(() => {
      setUploading(false)
    })
  }

  // Handle form submission
  const handleSubmit = async (values: ProjectFormData) => {
    try {
      // Upload image if new file selected
      let imageUrl = values.imageUrl
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          throw new Error('Image upload failed')
        }
        imageUrl = uploadedUrl
      }

      // Validate image URL
      if (!imageUrl) {
        formActions.setError('imageUrl', 'Project image is required')
        showError('Please upload a project image')
        return
      }

      // Prepare project data
      const projectData = {
        ...values,
        imageUrl,
        title: values.title.trim(),
        description: values.description.trim(),
        githubUrl: values.githubUrl.trim() || undefined,
        demoUrl: values.demoUrl.trim() || undefined,
      }

      await onSave(projectData)
      showSuccess(project ? 'Project updated successfully' : 'Project created successfully')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save project'
      showError(errorMessage)
      logActionError('project_save', error instanceof Error ? error : errorMessage, { projectId: project?.id, isEdit: !!project })
    }
  }

  const handleRetry = () => {
    formActions.clearAllErrors()
    // Could also retry the last failed operation
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <ApiErrorBoundary onRetry={handleRetry}>
          <form onSubmit={(e) => {
            e.preventDefault()
            formActions.submit(handleSubmit)
          }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                {project ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                disabled={formState.isSubmitting || uploading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* API Error Display */}
              {apiError && (
                <ErrorMessage
                  message={getUserFriendlyErrorMessage(apiError)}
                  type="error"
                  dismissible
                  onDismiss={() => {/* Clear API error */}}
                />
              )}

              {/* Form Validation Errors */}
              {!formState.isValid && formState.submitCount > 0 && (
                <ErrorList
                  errors={Object.values(formState.fields)
                    .filter(field => field.error && field.touched)
                    .map(field => field.error!)
                  }
                  title="Please fix the following errors:"
                />
              )}

              {/* Title */}
              <ValidatedInput
                label="Project Title"
                placeholder="Enter project title"
                value={formState.fields.title.value}
                onChange={(value) => formActions.setValue('title', value)}
                onBlur={() => formActions.setTouched('title')}
                error={formState.fields.title.error}
                touched={formState.fields.title.touched}
                required
                validationRules={projectValidationSchema.title}
                validateOnBlur
              />

              {/* Description */}
              <ValidatedTextarea
                label="Description"
                placeholder="Describe your project"
                value={formState.fields.description.value}
                onChange={(value) => formActions.setValue('description', value)}
                onBlur={() => formActions.setTouched('description')}
                error={formState.fields.description.error}
                touched={formState.fields.description.touched}
                required
                rows={4}
                maxLength={1000}
                showCharCount
                validationRules={projectValidationSchema.description}
                validateOnBlur
              />

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack *
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={handleTechInputKeyDown}
                      className="input-glass flex-1"
                      placeholder="Add technology (press Enter or comma to add)"
                      disabled={formState.isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={addTechStack}
                      className="btn-electric px-4 py-2 flex items-center gap-2"
                      disabled={formState.isSubmitting || !techInput.trim()}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {formState.fields.techStack.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formState.fields.techStack.value.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-electric-blue-500/20 text-electric-blue-400 border border-electric-blue-500/30"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechStack(index)}
                            className="ml-2 text-electric-blue-400 hover:text-red-400 transition-colors"
                            disabled={formState.isSubmitting}
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {formState.fields.techStack.error && formState.fields.techStack.touched && (
                  <p className="mt-1 text-sm text-red-400">{formState.fields.techStack.error}</p>
                )}
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  type="url"
                  label="GitHub URL"
                  placeholder="https://github.com/username/repo"
                  value={formState.fields.githubUrl.value}
                  onChange={(value) => formActions.setValue('githubUrl', value)}
                  onBlur={() => formActions.setTouched('githubUrl')}
                  error={formState.fields.githubUrl.error}
                  touched={formState.fields.githubUrl.touched}
                  validationRules={projectValidationSchema.githubUrl}
                  validateOnBlur
                />

                <ValidatedInput
                  type="url"
                  label="Demo URL"
                  placeholder="https://your-demo.com"
                  value={formState.fields.demoUrl.value}
                  onChange={(value) => formActions.setValue('demoUrl', value)}
                  onBlur={() => formActions.setTouched('demoUrl')}
                  error={formState.fields.demoUrl.error}
                  touched={formState.fields.demoUrl.touched}
                  validationRules={projectValidationSchema.demoUrl}
                  validateOnBlur
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Image *
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-dark-800">
                      <OptimizedImage
                        src={imagePreview}
                        alt="Project preview"
                        preset="card"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading || formState.isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-glass w-full flex items-center justify-center space-x-2"
                      disabled={uploading || formState.isSubmitting}
                    >
                      <ArrowUpTrayIcon className="w-5 h-5" />
                      <span>
                        {uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}
                      </span>
                    </button>
                  </div>
                </div>
                {!formState.fields.imageUrl.value && !imageFile && formState.submitCount > 0 && (
                  <p className="mt-1 text-sm text-red-400">Project image is required</p>
                )}
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formState.fields.featured.value}
                  onChange={(e) => formActions.setValue('featured', e.target.checked)}
                  className="w-4 h-4 text-electric-blue-500 bg-dark-800 border-gray-600 rounded focus:ring-electric-blue-500 focus:ring-2"
                  disabled={formState.isSubmitting}
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                  Mark as featured project
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="btn-glass px-6 py-2"
                disabled={formState.isSubmitting || uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-electric px-6 py-2 flex items-center space-x-2"
                disabled={formState.isSubmitting || uploading || isLoading}
              >
                {(formState.isSubmitting || isLoading) && (
                  <div className="loading-spinner w-4 h-4"></div>
                )}
                <span>
                  {formState.isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                </span>
              </button>
            </div>
          </form>
        </ApiErrorBoundary>
      </div>
    </div>
  )
}