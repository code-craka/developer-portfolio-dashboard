import { deleteImage, deleteImages, cleanupOrphanedImages } from './image-utils'
import { db } from './db'

/**
 * File cleanup utilities for managing uploaded files when projects/experiences are deleted
 */

export interface CleanupResult {
  success: boolean
  deletedFiles: number
  errors: string[]
}

/**
 * Clean up files associated with a deleted project
 */
export async function cleanupProjectFiles(projectId: number): Promise<CleanupResult> {
  try {
    // Get project data to find associated image
    const result = await db.query<{ image_url: string }>(
      'SELECT image_url FROM projects WHERE id = $1',
      [projectId]
    )

    if (result.length === 0) {
      return {
        success: true,
        deletedFiles: 0,
        errors: ['Project not found']
      }
    }

    const project = result[0]
    const errors: string[] = []
    let deletedFiles = 0

    // Delete project image if it exists
    if (project.image_url) {
      const success = await deleteImage(project.image_url)
      if (success) {
        deletedFiles++
      } else {
        errors.push(`Failed to delete project image: ${project.image_url}`)
      }
    }

    return {
      success: errors.length === 0,
      deletedFiles,
      errors
    }
  } catch (error) {
    console.error('Error cleaning up project files:', error)
    return {
      success: false,
      deletedFiles: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Clean up files associated with a deleted experience
 */
export async function cleanupExperienceFiles(experienceId: number): Promise<CleanupResult> {
  try {
    // Get experience data to find associated company logo
    const result = await db.query<{ company_logo: string }>(
      'SELECT company_logo FROM experiences WHERE id = $1',
      [experienceId]
    )

    if (result.length === 0) {
      return {
        success: true,
        deletedFiles: 0,
        errors: ['Experience not found']
      }
    }

    const experience = result[0]
    const errors: string[] = []
    let deletedFiles = 0

    // Delete company logo if it exists
    if (experience.company_logo) {
      const success = await deleteImage(experience.company_logo)
      if (success) {
        deletedFiles++
      } else {
        errors.push(`Failed to delete company logo: ${experience.company_logo}`)
      }
    }

    return {
      success: errors.length === 0,
      deletedFiles,
      errors
    }
  } catch (error) {
    console.error('Error cleaning up experience files:', error)
    return {
      success: false,
      deletedFiles: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Clean up all orphaned images in the uploads directory
 */
export async function cleanupOrphanedFiles(): Promise<{
  projects: CleanupResult
  companies: CleanupResult
}> {
  try {
    // Get all referenced images from database
    const [projectsResult, experiencesResult] = await Promise.all([
      db.query<{ image_url: string }>('SELECT image_url FROM projects WHERE image_url IS NOT NULL'),
      db.query<{ company_logo: string }>('SELECT company_logo FROM experiences WHERE company_logo IS NOT NULL')
    ])

    const referencedProjectImages = projectsResult
      .map(row => row.image_url)
      .filter(Boolean)

    const referencedCompanyLogos = experiencesResult
      .map(row => row.company_logo)
      .filter(Boolean)

    // Clean up orphaned files
    const [projectCleanup, companyCleanup] = await Promise.all([
      cleanupOrphanedImages(referencedProjectImages, 'projects'),
      cleanupOrphanedImages(referencedCompanyLogos, 'companies')
    ])

    return {
      projects: {
        success: projectCleanup.errors.length === 0,
        deletedFiles: projectCleanup.cleaned,
        errors: projectCleanup.errors
      },
      companies: {
        success: companyCleanup.errors.length === 0,
        deletedFiles: companyCleanup.cleaned,
        errors: companyCleanup.errors
      }
    }
  } catch (error) {
    console.error('Error cleaning up orphaned files:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      projects: {
        success: false,
        deletedFiles: 0,
        errors: [errorMessage]
      },
      companies: {
        success: false,
        deletedFiles: 0,
        errors: [errorMessage]
      }
    }
  }
}

/**
 * Bulk delete multiple project images
 */
export async function bulkDeleteProjectImages(imageUrls: string[]): Promise<CleanupResult> {
  try {
    const result = await deleteImages(imageUrls)
    
    return {
      success: result.failed === 0,
      deletedFiles: result.deleted,
      errors: result.failed > 0 ? [`Failed to delete ${result.failed} images`] : []
    }
  } catch (error) {
    console.error('Error bulk deleting project images:', error)
    return {
      success: false,
      deletedFiles: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Validate and clean up a single image file
 */
export async function validateAndCleanupImage(imageUrl: string): Promise<{
  exists: boolean
  deleted: boolean
  error?: string
}> {
  try {
    const { validateImageUrl } = await import('./image-utils')
    const exists = await validateImageUrl(imageUrl)
    
    if (!exists) {
      return { exists: false, deleted: false }
    }

    const deleted = await deleteImage(imageUrl)
    
    return {
      exists: true,
      deleted,
      error: deleted ? undefined : 'Failed to delete image'
    }
  } catch (error) {
    console.error('Error validating and cleaning up image:', error)
    return {
      exists: false,
      deleted: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  projects: { count: number; totalSize: number }
  companies: { count: number; totalSize: number }
  total: { count: number; totalSize: number }
}> {
  try {
    const fs = require('fs')
    const path = require('path')
    
    const projectsDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    const companiesDir = path.join(process.cwd(), 'public', 'uploads', 'companies')
    
    const getDirectoryStats = (dirPath: string) => {
      if (!fs.existsSync(dirPath)) {
        return { count: 0, totalSize: 0 }
      }
      
      const files = fs.readdirSync(dirPath)
      let count = 0
      let totalSize = 0
      
      for (const file of files) {
        if (file !== '.gitkeep') {
          const filePath = path.join(dirPath, file)
          const stats = fs.statSync(filePath)
          if (stats.isFile()) {
            count++
            totalSize += stats.size
          }
        }
      }
      
      return { count, totalSize }
    }
    
    const projects = getDirectoryStats(projectsDir)
    const companies = getDirectoryStats(companiesDir)
    
    return {
      projects,
      companies,
      total: {
        count: projects.count + companies.count,
        totalSize: projects.totalSize + companies.totalSize
      }
    }
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return {
      projects: { count: 0, totalSize: 0 },
      companies: { count: 0, totalSize: 0 },
      total: { count: 0, totalSize: 0 }
    }
  }
}