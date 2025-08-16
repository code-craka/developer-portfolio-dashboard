'use client'

import { useState } from 'react'
import { Experience } from '@/lib/types'
import OptimizedImage from '@/components/ui/OptimizedImage'

interface ExperienceTableProps {
  experiences: Experience[]
  loading: boolean
  onEdit: (experience: Experience) => void
  onDelete: (experience: Experience) => void
}

export default function ExperienceTable({ experiences, loading, onEdit, onDelete }: ExperienceTableProps) {
  const [sortField, setSortField] = useState<keyof Experience>('startDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterEmploymentType, setFilterEmploymentType] = useState<string>('all')

  // Handle sorting
  const handleSort = (field: keyof Experience) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort experiences
  const filteredAndSortedExperiences = experiences
    .filter(experience => {
      if (filterEmploymentType === 'all') return true
      return experience.employmentType === filterEmploymentType
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }
      
      return sortDirection === 'asc' 
        ? (aValue < bValue ? -1 : 1)
        : (aValue > bValue ? -1 : 1)
    })

  // Format date range
  const formatDateRange = (startDate: Date, endDate?: Date) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
    
    if (!endDate) {
      return `${start} - Present`
    }
    
    const end = new Date(endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
    
    return `${start} - ${end}`
  }

  // Calculate duration
  const calculateDuration = (startDate: Date, endDate?: Date) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
    }
    
    const years = Math.floor(diffMonths / 12)
    const remainingMonths = diffMonths % 12
    
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="glassmorphism-card p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="skeleton w-16 h-16 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3"></div>
                <div className="skeleton h-3 w-2/3"></div>
                <div className="skeleton h-3 w-1/2"></div>
              </div>
              <div className="skeleton w-20 h-8 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (experiences.length === 0) {
    return (
      <div className="glassmorphism-card p-12 text-center">
        <div className="w-16 h-16 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-electric-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No experience entries yet</h3>
        <p className="text-gray-400 mb-6">Start building your career timeline by adding your first work experience</p>
      </div>
    )
  }

  return (
    <div className="glassmorphism-card overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300">Filter:</label>
            <select
              value={filterEmploymentType}
              onChange={(e) => setFilterEmploymentType(e.target.value)}
              className="input-glass text-sm py-2 px-3 min-w-0"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-400">
            Showing {filteredAndSortedExperiences.length} of {experiences.length} experiences
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-900/50">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Company</span>
                  {sortField === 'company' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('position')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Position</span>
                  {sortField === 'position' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('startDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Duration</span>
                  {sortField === 'startDate' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('employmentType')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Type</span>
                  {sortField === 'employmentType' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-gray-300">Technologies</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-gray-300">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredAndSortedExperiences.map((experience) => (
              <tr key={experience.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                      {experience.companyLogo ? (
                        <OptimizedImage
                          src={experience.companyLogo}
                          alt={`${experience.company} logo`}
                          preset="company_logo"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{experience.company}</div>
                      <div className="text-sm text-gray-400">{experience.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{experience.position}</div>
                  <div className="text-sm text-gray-400 line-clamp-1">
                    {experience.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white">
                    {formatDateRange(experience.startDate, experience.endDate)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {calculateDuration(experience.startDate, experience.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    experience.employmentType === 'Full-time' ? 'bg-green-500/20 text-green-400' :
                    experience.employmentType === 'Part-time' ? 'bg-blue-500/20 text-blue-400' :
                    experience.employmentType === 'Contract' ? 'bg-yellow-500/20 text-yellow-400' :
                    experience.employmentType === 'Freelance' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {experience.employmentType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {experience.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-electric-blue-500/20 text-electric-blue-400"
                      >
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                        +{experience.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(experience)}
                      className="p-2 text-gray-400 hover:text-electric-blue-500 transition-colors"
                      title="Edit experience"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(experience)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete experience"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-white/10">
        {filteredAndSortedExperiences.map((experience) => (
          <div key={experience.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                {experience.companyLogo ? (
                  <OptimizedImage
                    src={experience.companyLogo}
                    alt={`${experience.company} logo`}
                    preset="company_logo"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{experience.position}</h3>
                    <p className="text-sm text-electric-blue-400 font-medium">{experience.company}</p>
                    <p className="text-xs text-gray-400 mt-1">{experience.location}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(experience)}
                      className="p-2 text-gray-400 hover:text-electric-blue-500 transition-colors"
                      title="Edit experience"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(experience)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete experience"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {experience.description}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {experience.technologies.slice(0, 4).map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-electric-blue-500/20 text-electric-blue-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {experience.technologies.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                      +{experience.technologies.length - 4}
                    </span>
                  )}
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      experience.employmentType === 'Full-time' ? 'bg-green-500/20 text-green-400' :
                      experience.employmentType === 'Part-time' ? 'bg-blue-500/20 text-blue-400' :
                      experience.employmentType === 'Contract' ? 'bg-yellow-500/20 text-yellow-400' :
                      experience.employmentType === 'Freelance' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {experience.employmentType}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300">
                      {formatDateRange(experience.startDate, experience.endDate)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {calculateDuration(experience.startDate, experience.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}