'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import OptimizedImage from '@/components/ui/OptimizedImage'

interface ProjectsTableProps {
  projects: Project[]
  loading: boolean
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export default function ProjectsTable({ projects, loading, onEdit, onDelete }: ProjectsTableProps) {
  const [sortField, setSortField] = useState<keyof Project>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all')

  // Handle sorting
  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      if (filterFeatured === 'featured') return project.featured
      if (filterFeatured === 'regular') return !project.featured
      return true
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
              </div>
              <div className="skeleton w-20 h-8 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="glassmorphism-card p-12 text-center">
        <div className="w-16 h-16 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-electric-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
        <p className="text-gray-400 mb-6">Start building your portfolio by adding your first project</p>
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
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value as 'all' | 'featured' | 'regular')}
              className="input-glass text-sm py-2 px-3 min-w-0"
            >
              <option value="all">All Projects</option>
              <option value="featured">Featured Only</option>
              <option value="regular">Regular Only</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-400">
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
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
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Project</span>
                  {sortField === 'title' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-gray-300">Tech Stack</span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('featured')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Status</span>
                  {sortField === 'featured' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <span>Created</span>
                  {sortField === 'createdAt' && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-gray-300">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredAndSortedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-800">
                      <OptimizedImage
                        src={project.imageUrl}
                        alt={project.title}
                        preset="thumbnail"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">{project.title}</div>
                      <div className="text-sm text-gray-400 line-clamp-1">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-electric-blue-500/20 text-electric-blue-400"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {project.featured ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                      Regular
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 text-gray-400 hover:text-electric-blue-500 transition-colors"
                      title="Edit project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete project"
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
        {filteredAndSortedProjects.map((project) => (
          <div key={project.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                <OptimizedImage
                  src={project.imageUrl}
                  alt={project.title}
                  preset="thumbnail"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 text-gray-400 hover:text-electric-blue-500 transition-colors"
                      title="Edit project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.techStack.slice(0, 4).map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-electric-blue-500/20 text-electric-blue-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    {project.featured ? (
                      <span className="inline-flex items-center text-yellow-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400">Regular</span>
                    )}
                  </div>
                  <span className="text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}