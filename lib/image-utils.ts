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
    // Sanitize the URL to prevent directory traversal
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
    const sanitizedUrl = cleanUrl.replace(/\.\./g, '').replace(/\/+/g, '/')
    
    // Ensure the path is within uploads directory
    if (!sanitizedUrl.startsWith('uploads/')) {
      console.warn(`Invalid image path for deletion: ${sanitizedUrl}`)
      return false
    }
    
    const filePath = path.join(process.cwd(), 'public', sanitizedUrl)
    
    // Additional security: ensure the resolved path is still within public/uploads
    const publicDir = path.join(process.cwd(), 'public', 'uploads')
    const resolvedPath = path.resolve(filePath)
    const resolvedPublicDir = path.resolve(publicDir)
    
    if (!resolvedPath.startsWith(resolvedPublicDir)) {
      console.warn(`Path traversal attempt detected: ${imageUrl}`)
      return false
    }
    
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
 * Image optimization presets for different use cases
 */
export const IMAGE_PRESETS = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  card: { width: 400, height: 300, quality: 85 },
  hero: { width: 1200, height: 800, quality: 90 },
  profile: { width: 300, height: 300, quality: 90 },
  company_logo: { width: 200, height: 200, quality: 85 },
  project_showcase: { width: 800, height: 600, quality: 85 }
} as const

/**
 * Get image preset configuration
 */
export function getImagePreset(preset: keyof typeof IMAGE_PRESETS) {
  return IMAGE_PRESETS[preset]
}

/**
 * Generate blur data URL for image placeholders
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Create optimized image props for Next.js Image component
 */
export function createOptimizedImageProps(
  src: string,
  alt: string,
  preset?: keyof typeof IMAGE_PRESETS,
  customOptions?: Partial<typeof IMAGE_PRESETS.thumbnail>
) {
  const options = preset ? getImagePreset(preset) : customOptions || {}
  
  return {
    src,
    alt,
    width: options.width,
    height: options.height,
    quality: options.quality || 85,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(),
    sizes: generateResponsiveImageSizes(options.width || 400),
    priority: false, // Set to true for above-the-fold images
  }
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
      // Sanitize the path to prevent directory traversal
      const sanitizedPath = imageUrl.replace(/\.\./g, '').replace(/\/+/g, '/')
      
      // Ensure the path stays within the uploads directory
      if (!sanitizedPath.startsWith('/uploads/')) {
        return false
      }
      
      // Local image - check if file exists
      const filePath = path.join(process.cwd(), 'public', sanitizedPath)
      
      // Additional security: ensure the resolved path is still within public/uploads
      const publicDir = path.join(process.cwd(), 'public', 'uploads')
      const resolvedPath = path.resolve(filePath)
      const resolvedPublicDir = path.resolve(publicDir)
      
      if (!resolvedPath.startsWith(resolvedPublicDir)) {
        return false
      }
      
      return existsSync(filePath)
    } else if (imageUrl.startsWith('http')) {
      // External image - validate URL format and protocol
      try {
        const url = new URL(imageUrl)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
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

/**
 * Convert image to WebP format (server-side utility)
 * Note: This would require sharp or similar library in production
 */
export async function convertToWebP(inputPath: string, outputPath: string, quality: number = 85): Promise<boolean> {
  try {
    // This is a placeholder for WebP conversion
    // In production, you would use sharp:
    // const sharp = require('sharp')
    // await sharp(inputPath)
    //   .webp({ quality })
    //   .toFile(outputPath)
    
    console.log(`WebP conversion placeholder: ${inputPath} -> ${outputPath}`)
    return true
  } catch (error) {
    console.error('Error converting to WebP:', error)
    return false
  }
}

/**
 * Generate multiple image sizes for responsive images
 */
export async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  baseName: string,
  sizes: number[] = [400, 800, 1200]
): Promise<{ size: number; path: string; url: string }[]> {
  const results: { size: number; path: string; url: string }[] = []
  
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${baseName}-${size}w.webp`)
      const success = await convertToWebP(inputPath, outputPath)
      
      if (success) {
        results.push({
          size,
          path: outputPath,
          url: outputPath.replace(path.join(process.cwd(), 'public'), '')
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('Error generating responsive images:', error)
    return []
  }
}

/**
 * Optimize image on upload
 */
export async function optimizeUploadedImage(
  filePath: string,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    generateResponsive?: boolean
  } = {}
): Promise<{
  optimized: boolean
  originalSize: number
  optimizedSize?: number
  responsiveImages?: { size: number; path: string; url: string }[]
}> {
  try {
    const stats = require('fs').statSync(filePath)
    const originalSize = stats.size
    
    // In production, you would implement actual image optimization here
    // using sharp or similar library
    
    const result = {
      optimized: true,
      originalSize,
      optimizedSize: originalSize, // Placeholder
    }
    
    if (options.generateResponsive) {
      const dir = path.dirname(filePath)
      const baseName = path.basename(filePath, path.extname(filePath))
      const responsiveImages = await generateResponsiveImages(filePath, dir, baseName)
      
      return {
        ...result,
        responsiveImages
      }
    }
    
    return result
  } catch (error) {
    console.error('Error optimizing image:', error)
    return {
      optimized: false,
      originalSize: 0
    }
  }
}