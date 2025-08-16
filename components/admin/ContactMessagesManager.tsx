'use client'

import { useState, useEffect } from 'react'
import { ContactMessage, ApiResponse } from '@/lib/types'
import ContactMessagesTable from './ContactMessagesTable'
import DeleteConfirmModal from './DeleteConfirmModal'
import NotificationSystem from './NotificationSystem'

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    message: ContactMessage | null
  }>({
    isOpen: false,
    message: null
  })

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact')
      const data: ApiResponse<ContactMessage[]> = await response.json()

      if (data.success && data.data) {
        setMessages(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch messages'
      })
    } finally {
      setLoading(false)
    }
  }

  // Mark message as read/unread
  const handleMarkAsRead = async (message: ContactMessage) => {
    try {
      const newReadStatus = !message.read
      
      const response = await fetch(`/api/contact/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: newReadStatus }),
      })

      const data: ApiResponse<ContactMessage> = await response.json()

      if (data.success && data.data) {
        // Update the message in the local state
        setMessages(prevMessages =>
          prevMessages.map(m =>
            m.id === message.id ? { ...m, read: newReadStatus } : m
          )
        )

        setNotification({
          type: 'success',
          message: `Message marked as ${newReadStatus ? 'read' : 'unread'}`
        })
      } else {
        throw new Error(data.error || 'Failed to update message status')
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update message status'
      })
    }
  }

  // Delete message
  const handleDelete = async (message: ContactMessage) => {
    try {
      const response = await fetch(`/api/contact/${message.id}`, {
        method: 'DELETE',
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        // Remove the message from local state
        setMessages(prevMessages =>
          prevMessages.filter(m => m.id !== message.id)
        )

        setNotification({
          type: 'success',
          message: 'Message deleted successfully'
        })
      } else {
        throw new Error(data.error || 'Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete message'
      })
    } finally {
      setDeleteModal({ isOpen: false, message: null })
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (message: ContactMessage) => {
    setDeleteModal({ isOpen: true, message })
  }

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, message: null })
  }

  // Close notification
  const closeNotification = () => {
    setNotification(null)
  }

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
          <p className="text-gray-400 mt-1">
            Manage and respond to contact form submissions
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          
          {/* Stats */}
          <div className="hidden sm:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-electric-blue-500"></div>
              <span className="text-gray-400">
                {messages.filter(m => !m.read).length} unread
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-gray-400">
                {messages.filter(m => m.read).length} read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <ContactMessagesTable
        messages={messages}
        loading={loading}
        onMarkAsRead={handleMarkAsRead}
        onDelete={openDeleteModal}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.message && (
        <DeleteConfirmModal
          onCancel={closeDeleteModal}
          onConfirm={() => handleDelete(deleteModal.message!)}
          title="Delete Message"
          message={`Are you sure you want to delete the message from ${deleteModal.message.name}? This action cannot be undone.`}
        />
      )}

      {/* Notification System */}
      {notification && (
        <NotificationSystem
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  )
}