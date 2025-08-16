'use client'

import { useState } from 'react'
import { ScrollAnimation } from '../ui/PageTransition'
import { ContactFormData } from '@/lib/types'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  errorMessage?: string
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false
  })

  // Real-time validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters long'
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    if (email.length > 254) return 'Email address is too long'
    return undefined
  }

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) return 'Message is required'
    if (message.trim().length < 10) return 'Message must be at least 10 characters long'
    return undefined
  }

  // Handle input changes with real-time validation
  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear success/error states when user starts typing
    if (formState.isSuccess || formState.isError) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        isError: false
      })
    }

    // Real-time validation
    let fieldError: string | undefined
    switch (field) {
      case 'name':
        fieldError = validateName(value)
        break
      case 'email':
        fieldError = validateEmail(value)
        break
      case 'message':
        fieldError = validateMessage(value)
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }))
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      message: validateMessage(formData.message)
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      isError: false
    })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setFormState({
          isSubmitting: false,
          isSuccess: true,
          isError: false
        })
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        })
        setErrors({})
      } else {
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          errorMessage: result.error || 'Failed to send message'
        })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'Network error. Please try again.'
      })
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-electric-blue-500 mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Let&apos;s discuss your next project or collaboration opportunity
            </p>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.2}>
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            {formState.isSuccess && (
              <div className="mb-8 p-6 bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold">Message Sent Successfully!</h3>
                    <p className="text-green-300/80 text-sm mt-1">
                      Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {formState.isError && (
              <div className="mb-8 p-6 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold">Error Sending Message</h3>
                    <p className="text-red-300/80 text-sm mt-1">
                      {formState.errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-glass-lg">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 focus:border-electric-blue-500 ${
                      errors.name ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                    }`}
                    placeholder="Your full name"
                    disabled={formState.isSubmitting}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 focus:border-electric-blue-500 ${
                      errors.email ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                    }`}
                    placeholder="your.email@example.com"
                    disabled={formState.isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 focus:border-electric-blue-500 resize-none ${
                      errors.message ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                    }`}
                    placeholder="Tell me about your project or how I can help you..."
                    disabled={formState.isSubmitting}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formState.isSubmitting || Object.values(errors).some(error => error !== undefined)}
                  className="w-full bg-gradient-to-r from-electric-blue-600 to-electric-blue-400 hover:from-electric-blue-500 hover:to-electric-blue-300 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-electric focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                >
                  {formState.isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Message</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Contact Information */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-electric-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Email</h3>
                <p className="text-gray-400 text-sm">
                  Prefer email? Drop me a line directly
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-electric-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Quick Response</h3>
                <p className="text-gray-400 text-sm">
                  I typically respond within 24 hours
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}