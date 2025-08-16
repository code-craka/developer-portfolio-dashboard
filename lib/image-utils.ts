import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { generateSecureFileName } from './security'

/**
 * Image optimization and processing utilities for the developer portfolio dashboard
 */

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
}

export interface ImageInfo {
  path: string
  url: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
}

/**
 * Get image information from file path
 */
export function getImageInfo(filePath: string): ImageInfo | null {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    
    if (!existsSync(fullPath)) {
      return null
    }

    const stats = require('fs').statSync(fullPath)
    
    return {
      path: fullPath,
      url: filePath,
      size: stats.size
    }
  } catch (error) {
    console.error('Error getting image info:', error)
    return null
  }
}

/**
 * Delete image file from filesystem
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Remove leading slash if present
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
    const filePath = path.join(process.cwd(), 'public', cleanUrl)
    
    if (existsSync(filePath)) {
      await unlink(filePath)
      console.log(`Deleted image: ${filePath}`)
      return true
    } else {
      console.warn(`Image not found for deletion: ${filePath}`)
      return false
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

/**
 * Delete multiple images
 */
export async function deleteImages(imageUrls: string[]): Promise<{ deleted: number; failed: number }> {
  let deleted = 0
  let failed = 0

  for (const imageUrl of imageUrls) {
    const success = await deleteImage(imageUrl)
    if (success) {
      deleted++
    } else {
      failed++
    }
  }

  return { deleted, failed }
}

/**
 * Validate image file extension
 */
export function isValidImageExtension(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
  const extension = path.extname(filename).toLowerCase()
  return validExtensions.includes(extension)
}

/**
 * Get optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(imageUrl: string, width?: number, quality?: number): string {
  if (!imageUrl) return ''
  
  // If it's already an optimized URL or external URL, return as is
  if (imageUrl.includes('/_next/image') || imageUrl.startsWith('http')) {
    return imageUrl
  }

  // Build Next.js image optimization URL
  const params = new URLSearchParams()
  params.set('url', imageUrl)
  
  if (width) {
    params.set('w', width.toString())
  }
  
  if (quality) {
    params.set('q', quality.toString())
  }

  return `/_next/image?${params.toString()}`
}

/**
 * Generate responsive image sizes for different breakpoints
 */
export function generateResponsiveImageSizes(baseWidth: number): string {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536]
  const sizes = breakpoints.map(bp => `(max-width: ${bp}px) ${Math.min(bp, baseWidth)}px`)
  sizes.push(`${baseWidth}px`)
  
  return sizes.join(', ')
}

/**
 * Extract image metadata from file
 */
export async function getImageMetadata(filePath: string): Promise<{
  width?: number
  height?: number
  format?: string
  size: number
} | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    
    if (!existsSync(fullPath)) {
      return null
    }

    const stats = require('fs').statSync(fullPath)
    const extension = path.extname(filePath).toLowerCase().slice(1)
    
    return {
      format: extension,
      size: stats.size
    }
  } catch (error) {
    console.error('Error getting image metadata:', error)
    return null
  }
}

/**
 * Clean up orphaned images (images not referenced in database)
 */
export async function cleanupOrphanedImages(
  referencedImages: string[],
  directory: 'projects' | 'companies'
): Promise<{ cleaned: number; errors: string[] }> {
  try {
    const fs = require('fs')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', directory)
    
    if (!existsSync(uploadDir)) {
      return { cleaned: 0, errors: [] }
    }

    const files = fs.readdirSync(uploadDir)
    const imageFiles = files.filter((file: string) => 
      isValidImageExtension(file) && file !== '.gitkeep'
    )

    let cleaned = 0
    const errors: string[] = []

    for (const file of imageFiles) {
      const fileUrl = `/uploads/${directory}/${file}`
      
      // If this image is not referenced, delete it
      if (!referencedImages.includes(fileUrl)) {
        try {
          const success = await deleteImage(fileUrl)
          if (success) {
            cleaned++
          }
        } catch (error) {
          errors.push(`Failed to delete ${file}: ${error}`)
        }
      }
    }

    return { cleaned, errors }
  } catch (error) {
    console.error('Error cleaning up orphaned images:', error)
    return { cleaned: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] }
  }
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number,
  maxWidth: number = 2048,
  maxHeight: number = 2048
): { valid: boolean; error?: string } {
  if (width > maxWidth || height > maxHeight) {
    return {
      valid: false,
      error: `Image dimensions ${width}x${height} exceed maximum allowed size of ${maxWidth}x${maxHeight}`
    }
  }

  if (width < 100 || height < 100) {
    return {
      valid: false,
      error: `Image dimensions ${width}x${height} are too small. Minimum size is 100x100`
    }
  }

  return { valid: true }
}

/**
 * Generate image placeholder for loading states
 */
export function generateImagePlaceholder(width: number, height: number): string {
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial, sans-serif" font-size="14">
        Loading...
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Check if image URL is valid and accessible
 */
export async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    if (imageUrl.startsWith('/uploads/')) {
      // Local image - check if file exists
      const filePath = path.join(process.cwd(), 'public', imageUrl)
      return existsSync(filePath)
    } else if (imageUrl.startsWith('http')) {
      // External image - we'll assume it's valid for now
      // In a production app, you might want to make an HTTP request to verify
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error validating image URL:', error)
    return false
  }
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(imageUrl: string, widths: number[]): string {
  return widths
    .map(width => `${getOptimizedImageUrl(imageUrl, width)} ${width}w`)
    .join(', ')
}