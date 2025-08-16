'use client'

import { useState, useEffect } from 'react'
import { Experience, ApiResponse } from '@/lib/types'
import ExperienceTable from './ExperienceTable'
import ExperienceModal from './ExperienceModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import NotificationSystem from './NotificationSystem'

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/experiences')
      const data: ApiResponse<Experience[]> = await response.json()

      if (data.success && data.data) {
        setExperiences(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch experiences')
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
      setNotification({
        type: 'error',
        message: 'Failed to load experiences. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Load experiences on component mount
  useEffect(() => {
    fetchExperiences()
  }, [])

  // Handle add experience
  const handleAddExperience = () => {
    setSelectedExperience(null)
    setShowModal(true)
  }

  // Handle edit experience
  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience)
    setShowModal(true)
  }

  // Handle delete experience
  const handleDeleteExperience = (experience: Experience) => {
    setExperienceToDelete(experience)
    setShowDeleteModal(true)
  }

  // Handle save experience (create or update)
  const handleSaveExperience = async (experienceData: any) => {
    try {
      const isEditing = selectedExperience !== null
      const url = isEditing 
        ? `/api/experiences/${selectedExperience.id}`
        : '/api/experiences'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      })

      const data: ApiResponse<Experience> = await response.json()

      if (data.success && data.data) {
        // Update local state
        if (isEditing) {
          setExperiences(prev => 
            prev.map(exp => exp.id === selectedExperience.id ? data.data! : exp)
          )
          setNotification({
            type: 'success',
            message: `Experience "${data.data.position} at ${data.data.company}" updated successfully!`
          })
        } else {
          setExperiences(prev => [data.data!, ...prev])
          setNotification({
            type: 'success',
            message: `Experience "${data.data.position} at ${data.data.company}" created successfully!`
          })
        }

        setShowModal(false)
        setSelectedExperience(null)
      } else {
        throw new Error(data.error || 'Failed to save experience')
      }
    } catch (error) {
      console.error('Error saving experience:', error)
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save experience. Please try again.'
      })
    }
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!experienceToDelete) return

    try {
      const response = await fetch(`/api/experiences/${experienceToDelete.id}`, {
        method: 'DELETE',
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        // Remove from local state
        setExperiences(prev => prev.filter(exp => exp.id !== experienceToDelete.id))
        setNotification({
          type: 'success',
          message: `Experience "${experienceToDelete.position} at ${experienceToDelete.company}" deleted successfully!`
        })
      } else {
        throw new Error(data.error || 'Failed to delete experience')
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete experience. Please try again.'
      })
    } finally {
      setShowDeleteModal(false)
      setExperienceToDelete(null)
    }
  }

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedExperience(null)
  }

  // Handle close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setExperienceToDelete(null)
  }

  // Handle close notification
  const handleCloseNotification = () => {
    setNotification(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Experience Management</h1>
          <p className="text-gray-400 mt-1">
            Manage your work experience and career timeline
          </p>
        </div>
        
        <button
          onClick={handleAddExperience}
          className="btn-electric flex items-center space-x-2 px-6 py-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Experience</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glassmorphism-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-electric-blue-500">
                {experiences.length}
              </div>
              <div className="text-sm text-gray-400">Total Experiences</div>
            </div>
            <div className="w-10 h-10 bg-electric-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-electric-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glassmorphism-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {experiences.filter(exp => !exp.endDate).length}
              </div>
              <div className="text-sm text-gray-400">Current Positions</div>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glassmorphism-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-500">
                {experiences.filter(exp => exp.employmentType === 'Full-time').length}
              </div>
              <div className="text-sm text-gray-400">Full-time Roles</div>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Table */}
      <ExperienceTable
        experiences={experiences}
        loading={loading}
        onEdit={handleEditExperience}
        onDelete={handleDeleteExperience}
      />

      {/* Experience Modal */}
      {showModal && (
        <ExperienceModal
          experience={selectedExperience}
          onSave={handleSaveExperience}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && experienceToDelete && (
        <DeleteConfirmModal
          title="Delete Experience"
          message={`Are you sure you want to delete the experience "${experienceToDelete.position} at ${experienceToDelete.company}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
        />
      )}

      {/* Notification System */}
      {notification && (
        <NotificationSystem
          type={notification.type}
          message={notification.message}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  )
}