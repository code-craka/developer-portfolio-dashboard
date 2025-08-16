'use client'

import { useState, useEffect, useRef } from 'react'
import { Experience, ApiResponse } from '@/lib/types'
import Image from 'next/image'

interface ExperienceModalProps {
  experience: Experience | null
  onSave: (experienceData: any) => void
  onClose: () => void
}

export default function ExperienceModal({ experience, onSave, onClose }: ExperienceModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: [] as string[],
    technologies: [] as string[],
    location: '',
    employmentType: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship',
    companyLogo: ''
  })
  const [achievementInput, setAchievementInput] = useState('')
  const [technologyInput, setTechnologyInput] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCurrentPosition, setIsCurrentPosition] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form data when experience changes
  useEffect(() => {
    if (experience) {
      const startDate = new Date(experience.startDate).toISOString().split('T')[0]
      const endDate = experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : ''
      
      setFormData({
        company: experience.company,
        position: experience.position,
        startDate,
        endDate,
        description: experience.description,
        achievements: [...experience.achievements],
        technologies: [...experience.technologies],
        location: experience.location,
        employmentType: experience.employmentType,
        companyLogo: experience.companyLogo || ''
      })
      setLogoPreview(experience.companyLogo || '')
      setIsCurrentPosition(!experience.endDate)
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: [],
        technologies: [],
        location: '',
        employmentType: 'Full-time',
        companyLogo: ''
      })
      setLogoPreview('')
      setIsCurrentPosition(false)
    }
    setAchievementInput('')
    setTechnologyInput('')
    setLogoFile(null)
    setErrors({})
  }, [experience])

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle current position toggle
  const handleCurrentPositionChange = (checked: boolean) => {
    setIsCurrentPosition(checked)
    if (checked) {
      setFormData(prev => ({ ...prev, endDate: '' }))
    }
  }

  // Handle achievement input
  const handleAchievementInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAchievement()
    }
  }

  // Add achievement
  const addAchievement = () => {
    const achievement = achievementInput.trim()
    if (achievement && !formData.achievements.includes(achievement)) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement]
      }))
    }
    setAchievementInput('')
  }

  // Remove achievement
  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  // Handle technology input
  const handleTechnologyInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTechnology()
    }
  }

  // Add technology
  const addTechnology = () => {
    const technology = technologyInput.trim()
    if (technology && !formData.technologies.includes(technology)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, technology]
      }))
    }
    setTechnologyInput('')
  }

  // Remove technology
  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please select a valid image file' }))
        return
      }

      // Validate file size (2MB for logos)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Logo size must be less than 2MB' }))
        return
      }

      setLogoFile(file)
      setErrors(prev => ({ ...prev, logo: '' }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload logo
  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return formData.companyLogo || null

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', logoFile)
      uploadFormData.append('type', 'logo')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data: ApiResponse = await response.json()

      if (data.success && data.data?.imageUrl) {
        return data.data.imageUrl
      } else {
        setErrors(prev => ({ ...prev, logo: data.error || 'Failed to upload logo' }))
        return null
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      setErrors(prev => ({ ...prev, logo: 'Failed to upload logo' }))
      return null
    } finally {
      setUploading(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!isCurrentPosition && !formData.endDate) {
      newErrors.endDate = 'End date is required (or mark as current position)'
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.achievements.length === 0) {
      newErrors.achievements = 'At least one achievement is required'
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      // Upload logo if new file selected
      let companyLogo = formData.companyLogo
      if (logoFile) {
        const uploadedUrl = await uploadLogo()
        if (!uploadedUrl) {
          setSaving(false)
          return
        }
        companyLogo = uploadedUrl
      }

      // Prepare experience data
      const experienceData = {
        ...formData,
        companyLogo: companyLogo || undefined,
        company: formData.company.trim(),
        position: formData.position.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        startDate: new Date(formData.startDate),
        endDate: isCurrentPosition ? undefined : new Date(formData.endDate),
      }

      await onSave(experienceData)
    } catch (error) {
      console.error('Error saving experience:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">
              {experience ? 'Edit Experience' : 'Add New Experience'}
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`input-glass w-full ${errors.company ? 'border-red-500' : ''}`}
                  placeholder="Enter company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-400">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`input-glass w-full ${errors.position ? 'border-red-500' : ''}`}
                  placeholder="Enter position title"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-400">{errors.position}</p>
                )}
              </div>
            </div>

            {/* Location and Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`input-glass w-full ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="e.g., San Francisco, CA"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employment Type *
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="input-glass w-full"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`input-glass w-full ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date {!isCurrentPosition && '*'}
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  disabled={isCurrentPosition}
                  className={`input-glass w-full ${errors.endDate ? 'border-red-500' : ''} ${isCurrentPosition ? 'opacity-50' : ''}`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="currentPosition"
                    checked={isCurrentPosition}
                    onChange={(e) => handleCurrentPositionChange(e.target.checked)}
                    className="w-4 h-4 text-electric-blue-500 bg-dark-800 border-gray-600 rounded focus:ring-electric-blue-500 focus:ring-2"
                  />
                  <label htmlFor="currentPosition" className="text-sm text-gray-300">
                    This is my current position
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`textarea-glass w-full ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your role and responsibilities"
                rows={4}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Achievements *
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={handleAchievementInputKeyDown}
                    className="input-glass flex-1"
                    placeholder="Add an achievement (press Enter to add)"
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="btn-electric px-4 py-2"
                  >
                    Add
                  </button>
                </div>
                
                {formData.achievements.length > 0 && (
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex-1 text-sm text-gray-300">
                          {achievement}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.achievements && (
                <p className="mt-1 text-sm text-red-400">{errors.achievements}</p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies Used *
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={technologyInput}
                    onChange={(e) => setTechnologyInput(e.target.value)}
                    onKeyDown={handleTechnologyInputKeyDown}
                    className="input-glass flex-1"
                    placeholder="Add technology (press Enter or comma to add)"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="btn-electric px-4 py-2"
                  >
                    Add
                  </button>
                </div>
                
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-electric-blue-500/20 text-electric-blue-400 border border-electric-blue-500/30"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
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
              {errors.technologies && (
                <p className="mt-1 text-sm text-red-400">{errors.technologies}</p>
              )}
            </div>

            {/* Company Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Logo (Optional)
              </label>
              <div className="space-y-4">
                {logoPreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-dark-800">
                    <Image
                      src={logoPreview}
                      alt="Company logo preview"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
                
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-glass flex items-center space-x-2"
                    disabled={uploading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>
                      {uploading ? 'Uploading...' : logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </button>
                </div>
              </div>
              {errors.logo && (
                <p className="mt-1 text-sm text-red-400">{errors.logo}</p>
              )}
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
                {saving ? 'Saving...' : experience ? 'Update Experience' : 'Create Experience'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}