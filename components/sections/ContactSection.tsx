'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollAnimation, StaggerAnimation } from '@/components/ui/PageTransition'
import { InteractiveButton } from '@/components/ui/InteractiveElements'
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
            {/* Animated Success Message */}
            <AnimatePresence>
              {formState.isSuccess && (
                <motion.div 
                  className="mb-8 p-6 bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
                >
                  {/* Success animation background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-green-400/10 to-green-500/5"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                  
                  <div className="flex items-center space-x-3 relative z-10">
                    <motion.div 
                      className="flex-shrink-0"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    >
                      <motion.svg 
                        className="w-6 h-6 text-green-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <motion.path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        />
                      </motion.svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-green-400 font-semibold">Message Sent Successfully!</h3>
                      <p className="text-green-300/80 text-sm mt-1">
                        Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated Error Message */}
            <AnimatePresence>
              {formState.isError && (
                <motion.div 
                  className="mb-8 p-6 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="flex-shrink-0"
                      animate={{ 
                        rotate: [0, -5, 5, -5, 5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 0.6,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                      }}
                    >
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-red-400 font-semibold">Error Sending Message</h3>
                      <p className="text-red-300/80 text-sm mt-1">
                        {formState.errorMessage}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Contact Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-glass-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Form background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-transparent to-electric-blue/5 opacity-0"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="space-y-6 relative z-10">
                <StaggerAnimation staggerDelay={0.1}>
                  {/* Name Field */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-300 mb-2"
                      whileHover={{ color: '#00D4FF' }}
                    >
                      Name *
                    </motion.label>
                    <motion.input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 focus:border-electric-blue-500 will-change-transform ${
                        errors.name ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                      }`}
                      placeholder="Your full name"
                      disabled={formState.isSubmitting}
                      whileFocus={{ 
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                      }}
                      whileHover={{ 
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                      }}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p 
                          className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </motion.svg>
                          <span>{errors.name}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-300 mb-2"
                      whileHover={{ color: '#00D4FF' }}
                    >
                      Email *
                    </motion.label>
                    <motion.input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 focus:border-electric-blue-500 will-change-transform ${
                        errors.email ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                      }`}
                      placeholder="your.email@example.com"
                      disabled={formState.isSubmitting}
                      whileFocus={{ 
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                      }}
                      whileHover={{ 
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                      }}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p 
                          className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </motion.svg>
                          <span>{errors.email}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-gray-300 mb-2"
                      whileHover={{ color: '#00D4FF' }}
                    >
                      Message *
                    </motion.label>
                    <motion.textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50 focus:border-electric-blue-500 resize-none will-change-transform ${
                        errors.message ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                      }`}
                      placeholder="Tell me about your project or how I can help you..."
                      disabled={formState.isSubmitting}
                      whileFocus={{ 
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                      }}
                      whileHover={{ 
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                      }}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p 
                          className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </motion.svg>
                          <span>{errors.message}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Enhanced Submit Button */}
                  <InteractiveButton
                    variant="electric"
                    size="lg"
                    onClick={() => {}}
                    disabled={formState.isSubmitting || Object.values(errors).some(error => error !== undefined)}
                    loading={formState.isSubmitting}
                    className="w-full"
                  >
                    {!formState.isSubmitting && (
                      <>
                        <motion.svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </motion.svg>
                        <span>Send Message</span>
                      </>
                    )}
                  </InteractiveButton>
                </StaggerAnimation>
              </div>
            </motion.form>

            {/* Enhanced Contact Information */}
            <motion.div 
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <StaggerAnimation staggerDelay={0.1}>
                <motion.div 
                  className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center group cursor-pointer"
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-blue-500/30 transition-colors duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.svg 
                      className="w-6 h-6 text-electric-blue-400 group-hover:text-electric-blue-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ scale: 1.1 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </motion.svg>
                  </motion.div>
                  <motion.h3 
                    className="text-white font-semibold mb-2 group-hover:text-electric-blue-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    Email
                  </motion.h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                    Prefer email? Drop me a line directly
                  </p>
                  
                  {/* Floating particles on hover */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-electric-blue/50 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.div>

                <motion.div 
                  className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center group cursor-pointer"
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-blue-500/30 transition-colors duration-300"
                    whileHover={{ 
                      rotate: [0, 15, -15, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.svg 
                      className="w-6 h-6 text-electric-blue-400 group-hover:text-electric-blue-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ scale: 1.1 }}
                    >
                      <motion.path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                        animate={{
                          pathLength: [1, 0.8, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.h3 
                    className="text-white font-semibold mb-2 group-hover:text-electric-blue-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    Quick Response
                  </motion.h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                    I typically respond within 24 hours
                  </p>
                  
                  {/* Floating particles on hover */}
                  <motion.div
                    className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-electric-blue/30 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      y: [0, 6, 0],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5
                    }}
                  />
                </motion.div>
              </StaggerAnimation>
            </motion.div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}