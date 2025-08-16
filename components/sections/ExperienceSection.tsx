'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScrollAnimation, StaggerAnimation } from '../ui/PageTransition'
import { Experience, ApiResponse } from '@/lib/types'

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null)

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/experiences')
        const data: ApiResponse<Experience[]> = await response.json()
        
        if (data.success && data.data) {
          setExperiences(data.data)
        } else {
          setError(data.error || 'Failed to fetch experiences')
        }
      } catch (err) {
        console.error('Error fetching experiences:', err)
        setError('Failed to load experiences')
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

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

  // Toggle expanded experience
  const toggleExpanded = (experienceId: number) => {
    setExpandedExperience(expandedExperience === experienceId ? null : experienceId)
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-700"></div>
          
          {/* Timeline dot */}
          <div className="absolute left-4 top-6 w-4 h-4 bg-gray-700 rounded-full"></div>
          
          {/* Content */}
          <div className="ml-16 glassmorphism-card p-6">
            <div className="flex items-start space-x-4">
              <div className="skeleton w-16 h-16 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-6 w-1/3"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Error state
  if (error) {
    return (
      <section id="experience" className="py-20 relative">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
                Work Experience
              </h2>
              <div className="w-20 h-1 bg-electric-blue mx-auto rounded-full" />
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                My professional journey and key achievements
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="glassmorphism-card p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Experience</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
              Work Experience
            </h2>
            <div className="w-20 h-1 bg-electric-blue mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              My professional journey and key achievements
            </p>
          </div>
        </ScrollAnimation>

        {loading ? (
          <LoadingSkeleton />
        ) : experiences.length === 0 ? (
          <ScrollAnimation delay={0.2}>
            <div className="glassmorphism-card p-12 text-center">
              <div className="w-16 h-16 bg-electric-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Experience Yet</h3>
              <p className="text-gray-400">
                Experience timeline will appear here once data is added
              </p>
            </div>
          </ScrollAnimation>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line - hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric-blue-500 via-electric-blue-500/50 to-transparent"></div>
            
            <StaggerAnimation staggerDelay={0.15}>
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  className="relative mb-12 last:mb-0"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.25, 0.25, 0.25, 0.75]
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                >
                  {/* Timeline dot - hidden on mobile, visible on desktop */}
                  <div className="hidden md:block absolute left-6 top-8 w-4 h-4 bg-electric-blue-500 rounded-full border-4 border-dark-900 shadow-lg shadow-electric-blue-500/50 z-10">
                    {/* Current position indicator */}
                    {!experience.endDate && (
                      <div className="absolute -inset-2 bg-electric-blue-500/30 rounded-full animate-pulse"></div>
                    )}
                  </div>

                  {/* Experience card */}
                  <div className="md:ml-20 glassmorphism-card hover:border-electric-blue-500/30 transition-all duration-300 group">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        {/* Company logo */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-dark-800 flex-shrink-0 border border-white/10 group-hover:border-electric-blue-500/30 transition-colors">
                          {experience.companyLogo ? (
                            <Image
                              src={experience.companyLogo}
                              alt={`${experience.company} logo`}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Position and company info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-electric-blue-400 transition-colors">
                                {experience.position}
                              </h3>
                              <p className="text-electric-blue-400 font-semibold">
                                {experience.company}
                              </p>
                              <p className="text-sm text-gray-400 flex items-center mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {experience.location}
                              </p>
                            </div>

                            {/* Date range and employment type */}
                            <div className="text-right mt-2 sm:mt-0">
                              <div className="text-sm font-medium text-white">
                                {formatDateRange(experience.startDate, experience.endDate)}
                              </div>
                              <div className="text-xs text-gray-400 mb-2">
                                {calculateDuration(experience.startDate, experience.endDate)}
                              </div>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                experience.employmentType === 'Full-time' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                experience.employmentType === 'Part-time' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                experience.employmentType === 'Contract' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                experience.employmentType === 'Freelance' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              }`}>
                                {experience.employmentType}
                                {!experience.endDate && (
                                  <span className="ml-1 w-2 h-2 bg-current rounded-full animate-pulse"></span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Technologies */}
                      {experience.technologies.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-electric-blue-500/20 text-electric-blue-400 border border-electric-blue-500/30 hover:bg-electric-blue-500/30 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements - Expandable */}
                      {experience.achievements.length > 0 && (
                        <div>
                          <button
                            onClick={() => toggleExpanded(experience.id)}
                            className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-400 hover:text-electric-blue-400 transition-colors mb-2"
                          >
                            <span>Key Achievements ({experience.achievements.length})</span>
                            <motion.svg
                              className="w-4 h-4"
                              animate={{ rotate: expandedExperience === experience.id ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </button>

                          <motion.div
                            initial={false}
                            animate={{
                              height: expandedExperience === experience.id ? 'auto' : 0,
                              opacity: expandedExperience === experience.id ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 pl-4">
                              {experience.achievements.map((achievement, achievementIndex) => (
                                <motion.li
                                  key={achievementIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ 
                                    opacity: expandedExperience === experience.id ? 1 : 0,
                                    x: expandedExperience === experience.id ? 0 : -10
                                  }}
                                  transition={{ 
                                    duration: 0.3, 
                                    delay: achievementIndex * 0.05,
                                    ease: 'easeOut'
                                  }}
                                  className="flex items-start space-x-2 text-sm text-gray-300"
                                >
                                  <span className="text-electric-blue-500 mt-1.5 flex-shrink-0">•</span>
                                  <span>{achievement}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerAnimation>
          </div>
        )}
      </div>
    </section>
  )
}