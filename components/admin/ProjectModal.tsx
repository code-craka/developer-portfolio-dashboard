'use client'

import { useState, useEffect, useRef } from 'react'
import { Project, ApiResponse } from '@/lib/types'
import OptimizedImage from '@/components/ui/OptimizedImage'

interface ProjectModalProps {
  project: Project | null
  onSave: (projectData: any) => void
  onClose: () => void
}

export default function ProjectModal({ project, onSave, onClose }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    githubUrl: '',
    demoUrl: '',
    featured: false,
    imageUrl: ''
  })
  const [techInput, setTechInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
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
      setFormData({
        title: '',
        description: '',
        techStack: [],
        githubUrl: '',
        demoUrl: '',
        featured: false,
        imageUrl: ''
      })
      setImagePreview('')
    }
    setTechInput('')
    setImageFile(null)
    setErrors({})
  }, [project])

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle tech stack input
  const handleTechInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTechStack()
    }
  }

  // Add tech stack item
  const addTechStack = () => {
    const tech = techInput.trim()
    if (tech && !formData.techStack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech]
      }))
    }
    setTechInput('')
  }

  // Remove tech stack item
  const removeTechStack = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }))
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }))
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }))
        return
      }

      setImageFile(file)
      setErrors(prev => ({ ...prev, image: '' }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload image
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imageUrl || null

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', imageFile)
      uploadFormData.append('type', 'project')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data: ApiResponse = await response.json()

      if (data.success && data.data?.imageUrl) {
        return data.data.imageUrl
      } else {
        setErrors(prev => ({ ...prev, image: data.error || 'Failed to upload image' }))
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setErrors(prev => ({ ...prev, image: 'Failed to upload image' }))
      return null
    } finally {
      setUploading(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.techStack.length === 0) {
      newErrors.techStack = 'At least one technology is required'
    }

    if (!formData.imageUrl && !imageFile) {
      newErrors.image = 'Project image is required'
    }

    // Validate URLs if provided
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL'
    }

    if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
      newErrors.demoUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // URL validation helper
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      // Upload image if new file selected
      let imageUrl = formData.imageUrl
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          setSaving(false)
          return
        }
        imageUrl = uploadedUrl
      }

      // Prepare project data
      const projectData = {
        ...formData,
        imageUrl,
        title: formData.title.trim(),
        description: formData.description.trim(),
        githubUrl: formData.githubUrl.trim() || undefined,
        demoUrl: formData.demoUrl.trim() || undefined,
      }

      await onSave(projectData)
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`input-glass w-full ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`textarea-glass w-full ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your project"
                rows={4}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>

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
                  />
                  <button
                    type="button"
                    onClick={addTechStack}
                    className="btn-electric px-4 py-2"
                  >
                    Add
                  </button>
                </div>
                
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-electric-blue-500/20 text-electric-blue-400 border border-electric-blue-500/30"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(index)}
                          className="ml-2 text-electric-blue-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {errors.techStack && (
                <p className="mt-1 text-sm text-red-400">{errors.techStack}</p>
              )}
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  className={`input-glass w-full ${errors.githubUrl ? 'border-red-500' : ''}`}
                  placeholder="https://github.com/username/repo"
                />
                {errors.githubUrl && (
                  <p className="mt-1 text-sm text-red-400">{errors.githubUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                  className={`input-glass w-full ${errors.demoUrl ? 'border-red-500' : ''}`}
                  placeholder="https://your-demo.com"
                />
                {errors.demoUrl && (
                  <p className="mt-1 text-sm text-red-400">{errors.demoUrl}</p>
                )}
              </div>
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
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-glass w-full flex items-center justify-center space-x-2"
                    disabled={uploading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>
                      {uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}
                    </span>
                  </button>
                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-400">{errors.image}</p>
              )}
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 text-electric-blue-500 bg-dark-800 border-gray-600 rounded focus:ring-electric-blue-500 focus:ring-2"
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
              disabled={saving || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-electric px-6 py-2 flex items-center space-x-2"
              disabled={saving || uploading}
            >
              {saving && (
                <div className="loading-spinner w-4 h-4"></div>
              )}
              <span>
                {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}