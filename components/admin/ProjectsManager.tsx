'use client'

import { useState, useEffect, useCallback } from 'react'
import { Project, ApiResponse } from '@/lib/types'
import ProjectsTable from './ProjectsTable'
import ProjectModal from './ProjectModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import NotificationSystem from './NotificationSystem'

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }, [])

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data: ApiResponse<Project[]> = await response.json()
      
      if (data.success && data.data) {
        setProjects(data.data)
      } else {
        showNotification('error', 'Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      showNotification('error', 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Handle add project
  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  // Handle edit project
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  // Handle delete project
  const handleDeleteProject = (project: Project) => {
    setDeletingProject(project)
  }

  // Handle project save (create or update)
  const handleProjectSave = async (projectData: any) => {
    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : '/api/projects'
      
      const method = editingProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const data: ApiResponse<Project> = await response.json()

      if (data.success) {
        showNotification('success', editingProject ? 'Project updated successfully' : 'Project created successfully')
        setIsModalOpen(false)
        setEditingProject(null)
        await fetchProjects() // Refresh the list
      } else {
        showNotification('error', data.error || 'Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      showNotification('error', 'Failed to save project')
    }
  }

  // Handle project deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return

    try {
      const response = await fetch(`/api/projects/${deletingProject.id}`, {
        method: 'DELETE',
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        showNotification('success', 'Project deleted successfully')
        setDeletingProject(null)
        await fetchProjects() // Refresh the list
      } else {
        showNotification('error', data.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      showNotification('error', 'Failed to delete project')
    }
  }

  // Load projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">
            Projects ({projects.length})
          </h2>
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-electric-blue-500 transition-colors duration-200"
            title="Refresh projects"
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={handleAddProject}
          className="btn-electric flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <ProjectsTable
        projects={projects}
        loading={loading}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {/* Project Modal */}
      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onSave={handleProjectSave}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProject(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <DeleteConfirmModal
          title="Delete Project"
          message={`Are you sure you want to delete "${deletingProject.title}"? This action cannot be undone and will also delete the associated image file.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProject(null)}
        />
      )}

      {/* Notification System */}
      {notification && (
        <NotificationSystem
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}