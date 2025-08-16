'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollAnimation } from '@/components/ui/PageTransition'
import LazyImage from '@/components/ui/LazyImage'
import { ProjectCardSkeleton } from '@/components/ui/Skeleton'
import { Project, ApiResponse } from '@/lib/types'
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import StructuredData from '@/components/seo/StructuredData'
import { generateProjectSchema } from '@/lib/seo'

// Tech stack color mapping for visual consistency
const techStackColors: Record<string, string> = {
  // Frontend
  'React': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Next.js': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'Vue.js': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Angular': 'bg-red-500/20 text-red-400 border-red-500/30',
  'TypeScript': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  'JavaScript': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'HTML': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'CSS': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  'Tailwind CSS': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'SCSS': 'bg-pink-500/20 text-pink-400 border-pink-500/30',

  // Backend
  'Node.js': 'bg-green-600/20 text-green-400 border-green-600/30',
  'Python': 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
  'Java': 'bg-red-600/20 text-red-300 border-red-600/30',
  'C#': 'bg-purple-600/20 text-purple-300 border-purple-600/30',
  'PHP': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Go': 'bg-cyan-600/20 text-cyan-300 border-cyan-600/30',
  'Rust': 'bg-orange-600/20 text-orange-300 border-orange-600/30',

  // Databases
  'PostgreSQL': 'bg-blue-700/20 text-blue-300 border-blue-700/30',
  'MongoDB': 'bg-green-700/20 text-green-300 border-green-700/30',
  'MySQL': 'bg-orange-700/20 text-orange-300 border-orange-700/30',
  'Redis': 'bg-red-700/20 text-red-300 border-red-700/30',

  // Cloud & Tools
  'AWS': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Docker': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Kubernetes': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  'GraphQL': 'bg-pink-600/20 text-pink-300 border-pink-600/30',
  'REST API': 'bg-green-500/20 text-green-400 border-green-500/30',

  // Default fallback
  'default': 'bg-electric-blue-500/20 text-electric-blue-400 border-electric-blue-500/30'
}

interface ProjectCardProps {
  project: Project
  index: number
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const getTechStackColor = (tech: string) => {
    return techStackColors[tech] || techStackColors.default
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -10 }}
      className={`project-card group relative overflow-hidden ${project.featured ? 'ring-2 ring-electric-blue-500/50' : ''
        }`}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-electric-blue-500 text-dark-950 px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        </div>
      )}

      {/* Project image */}
      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={project.imageUrl}
          alt={project.title}
          preset="project_showcase"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          fallbackSrc="/uploads/projects/placeholder.svg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {project.githubUrl && isValidUrl(project.githubUrl) && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-electric flex items-center gap-2 text-sm"
            >
              <CodeBracketIcon className="w-4 h-4" />
              Code
            </motion.a>
          )}

          {project.demoUrl && isValidUrl(project.demoUrl) && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline-electric flex items-center gap-2 text-sm"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Demo
            </motion.a>
          )}
        </div>
      </div>

      {/* Project content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-blue-400 transition-colors duration-300">
          {project.title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: (index * 0.1) + (techIndex * 0.05)
              }}
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${getTechStackColor(tech)}`}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Project links (mobile fallback) */}
        <div className="flex gap-3 md:hidden">
          {project.githubUrl && isValidUrl(project.githubUrl) && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-electric-blue-400 hover:text-electric-blue-300 transition-colors duration-300 text-sm"
            >
              <CodeBracketIcon className="w-4 h-4" />
              Code
            </a>
          )}

          {project.demoUrl && isValidUrl(project.demoUrl) && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-electric-blue-400 hover:text-electric-blue-300 transition-colors duration-300 text-sm"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}



function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full">
      <div className="glassmorphism-card p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Projects</h3>
        <p className="text-gray-400 mb-6">
          There was an error loading the projects. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="btn-electric"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full">
      <div className="glassmorphism-card p-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
        <p className="text-gray-400">
          Projects will appear here once they are added to the portfolio.
        </p>
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/projects')
      const data: ApiResponse<Project[]> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects')
      }

      if (data.success && data.data) {
        setProjects(data.data)
      } else {
        throw new Error(data.error || 'Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Separate featured and regular projects
  const featuredProjects = projects.filter(project => project.featured)
  const regularProjects = projects.filter(project => !project.featured)

  return (
    <section
      id="projects"
      className="py-20 relative"
      aria-labelledby="projects-heading"
    >
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2
              id="projects-heading"
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue-500 bg-clip-text text-transparent"
            >
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-electric-blue-500 mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and experience
            </p>
          </div>
        </ScrollAnimation>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="grid grid-cols-1">
            <ErrorState onRetry={fetchProjects} />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="grid grid-cols-1">
            <EmptyState />
          </div>
        )}

        {/* Structured Data for Projects */}
        {!loading && !error && projects.length > 0 && (
          <>
            {projects.map((project) => (
              <StructuredData
                key={`schema-${project.id}`}
                data={generateProjectSchema({
                  title: project.title,
                  description: project.description,
                  url: project.demoUrl,
                  githubUrl: project.githubUrl,
                  techStack: project.techStack,
                  imageUrl: project.imageUrl,
                })}
              />
            ))}
          </>
        )}

        {/* Projects content */}
        {!loading && !error && projects.length > 0 && (
          <div className="space-y-12">
            {/* Featured projects section */}
            {featuredProjects.length > 0 && (
              <ScrollAnimation delay={0.2}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-electric-blue-500">⭐</span>
                    Featured Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            )}

            {/* Regular projects section */}
            {regularProjects.length > 0 && (
              <ScrollAnimation delay={featuredProjects.length > 0 ? 0.4 : 0.2}>
                <div>
                  {featuredProjects.length > 0 && (
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="text-electric-blue-500">🚀</span>
                      Other Projects
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={featuredProjects.length + index}
                      />
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            )}
          </div>
        )}

        {/* View all projects link (if there are many projects) */}
        {!loading && !error && projects.length > 6 && (
          <ScrollAnimation delay={0.6}>
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">
                Showing {Math.min(projects.length, 6)} of {projects.length} projects
              </p>
              <button className="btn-outline-electric">
                View All Projects
              </button>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  )
}