'use client'

import { useState } from 'react'
import { ContactMessage } from '@/lib/types'

interface ContactMessagesTableProps {
  messages: ContactMessage[]
  loading: boolean
  onMarkAsRead: (message: ContactMessage) => void
  onDelete: (message: ContactMessage) => void
}

export default function ContactMessagesTable({ 
  messages, 
  loading, 
  onMarkAsRead, 
  onDelete 
}: ContactMessagesTableProps) {
  const [sortField, setSortField] = useState<keyof ContactMessage>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  // Handle sorting
  const handleSort = (field: keyof ContactMessage) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort messages
  const filteredAndSortedMessages = messages
    .filter(message => {
      // Filter by read status
      if (filterRead === 'read' && !message.read) return false
      if (filterRead === 'unread' && message.read) return false
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          message.name.toLowerCase().includes(searchLower) ||
          message.email.toLowerCase().includes(searchLower) ||
          message.message.toLowerCase().includes(searchLower)
        )
      }
      
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
      
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1)
      }
      
      return sortDirection === 'asc' 
        ? (aValue < bValue ? -1 : 1)
        : (aValue > bValue ? -1 : 1)
    })

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - messageDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="glassmorphism-card p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="skeleton w-4 h-4 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/4"></div>
                <div className="skeleton h-3 w-1/3"></div>
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
  if (messages.length === 0) {
    return (
      <div className="glassmorphism-card p-12 text-center">
        <div className="w-16 h-16 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-electric-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
        <p className="text-gray-400 mb-6">Contact messages will appear here when visitors submit the contact form</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="glassmorphism-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-glass pl-10 pr-4 py-2 w-full sm:w-64"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Filter:</label>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
                className="input-glass text-sm py-2 px-3 min-w-0"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            Showing {filteredAndSortedMessages.length} of {messages.length} messages
            {messages.filter(m => !m.read).length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-electric-blue-500/20 text-electric-blue-400">
                {messages.filter(m => !m.read).length} unread
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="glassmorphism-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('read')}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Status</span>
                    {sortField === 'read' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    <span>From</span>
                    {sortField === 'name' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-medium text-gray-300">Message</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Received</span>
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
              {filteredAndSortedMessages.map((message) => (
                <tr 
                  key={message.id} 
                  className={`hover:bg-white/5 transition-colors cursor-pointer ${
                    !message.read ? 'bg-electric-blue-500/5' : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {message.read ? (
                        <div className="w-3 h-3 rounded-full bg-gray-500" title="Read"></div>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-electric-blue-500 animate-pulse" title="Unread"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`font-medium ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                        {message.name}
                      </div>
                      <div className="text-sm text-gray-400">{message.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm line-clamp-2 ${!message.read ? 'text-gray-200' : 'text-gray-400'}`}>
                      {message.message}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      {getTimeAgo(message.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsRead(message)
                        }}
                        className={`p-2 transition-colors ${
                          message.read 
                            ? 'text-gray-400 hover:text-yellow-500' 
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                        title={message.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {message.read ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(message)
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete message"
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
          {filteredAndSortedMessages.map((message) => (
            <div 
              key={message.id} 
              className={`p-6 cursor-pointer hover:bg-white/5 transition-colors ${
                !message.read ? 'bg-electric-blue-500/5' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 pt-1">
                  {message.read ? (
                    <div className="w-3 h-3 rounded-full bg-gray-500" title="Read"></div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-electric-blue-500 animate-pulse" title="Unread"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-400">{message.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsRead(message)
                        }}
                        className={`p-2 transition-colors ${
                          message.read 
                            ? 'text-gray-400 hover:text-yellow-500' 
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                        title={message.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {message.read ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(message)
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-2 line-clamp-3 ${!message.read ? 'text-gray-200' : 'text-gray-400'}`}>
                    {message.message}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {getTimeAgo(message.createdAt)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glassmorphism-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {selectedMessage.read ? (
                    <div className="w-4 h-4 rounded-full bg-gray-500" title="Read"></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-electric-blue-500 animate-pulse" title="Unread"></div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-white">Message from {selectedMessage.name}</h2>
                    <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">
                  Received {formatDate(selectedMessage.createdAt)} ({getTimeAgo(selectedMessage.createdAt)})
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    onMarkAsRead(selectedMessage)
                    setSelectedMessage(null)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMessage.read
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button
                  onClick={() => {
                    onDelete(selectedMessage)
                    setSelectedMessage(null)
                  }}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}