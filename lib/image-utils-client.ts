/**
 * Client-side image optimization utilities
 */

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
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
 * Generate responsive image sizes for different breakpoints
 */
export function generateResponsiveImageSizes(baseWidth: number): string {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536]
  const sizes = breakpoints.map(bp => `(max-width: ${bp}px) ${Math.min(bp, baseWidth)}px`)
  sizes.push(`${baseWidth}px`)
  
  return sizes.join(', ')
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
 * Generate srcSet for responsive images
 */
export function generateSrcSet(imageUrl: string, widths: number[]): string {
  return widths
    .map(width => `${getOptimizedImageUrl(imageUrl, width)} ${width}w`)
    .join(', ')
}

/**
 * Validate image file extension
 */
export function isValidImageExtension(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
  const extension = filename.toLowerCase().split('.').pop()
  return validExtensions.includes(`.${extension}`)
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
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}