# Image Upload System Documentation

## Overview

The image upload system provides secure file upload functionality for the developer portfolio dashboard. It supports project images and company logos with comprehensive validation, optimization, and cleanup capabilities.

## Features

- ✅ Secure file upload with authentication
- ✅ File type and size validation
- ✅ Automatic secure filename generation
- ✅ Image optimization and processing
- ✅ Orphaned file cleanup
- ✅ Storage statistics and monitoring
- ✅ CORS and security headers
- ✅ Error handling and logging

## API Endpoints

### Upload Files

**POST** `/api/upload`

Upload images for projects or company logos.

**Authentication:** Required (Admin only)

**Request:**
```typescript
// Form data with file and type
const formData = new FormData()
formData.append('file', file) // File object
formData.append('type', 'project' | 'logo') // Upload type
```

**Response:**
```typescript
{
  success: boolean
  data?: {
    imageUrl: string        // Relative URL: /uploads/projects/filename.jpg
    fileName: string        // Secure filename
    originalName: string    // Original filename
    size: number           // File size in bytes
    type: string           // MIME type
  }
  message?: string
  error?: string
}
```

**File Validation:**
- **Project Images:** Max 5MB, JPG/PNG/WebP
- **Company Logos:** Max 2MB, JPG/PNG/WebP/SVG
- Secure filename generation with timestamp and random string
- Path traversal protection

### File Management

**GET** `/api/admin/files`

Get storage statistics and file information.

**Authentication:** Required (Admin only)

**Response:**
```typescript
{
  success: boolean
  data: {
    projects: { count: number, totalSize: number }
    companies: { count: number, totalSize: number }
    total: { count: number, totalSize: number }
  }
}
```

**DELETE** `/api/admin/files`

Clean up orphaned files (files not referenced in database).

**Authentication:** Required (Admin only)

**Response:**
```typescript
{
  success: boolean
  data: {
    cleanup: {
      projects: { deletedFiles: number, errors: string[] }
      companies: { deletedFiles: number, errors: string[] }
    }
    summary: {
      totalDeleted: number
      totalErrors: number
      errors: string[]
    }
  }
}
```

**POST** `/api/admin/files/delete`

Delete a specific image file.

**Authentication:** Required (Admin only)

**Request:**
```typescript
{
  imageUrl: string // Relative URL to delete
}
```

## Directory Structure

```
public/
└── uploads/
    ├── projects/           # Project images
    │   ├── .gitkeep
    │   └── project-*.jpg
    └── companies/          # Company logos
        ├── .gitkeep
        └── company-*.png
```

## Security Features

### File Validation
- File type validation (MIME type checking)
- File size limits (5MB for projects, 2MB for logos)
- Filename sanitization and secure generation
- Path traversal attack prevention

### Authentication
- Clerk authentication required for all upload operations
- Admin role verification
- Session validation

### Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Strict Transport Security

## Usage Examples

### Frontend Upload Component

```typescript
import { useState } from 'react'

function ImageUpload({ type = 'project', onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpload(result.data.imageUrl)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
        disabled={uploading}
      />
      {error && <p className="error">{error}</p>}
      {uploading && <p>Uploading...</p>}
    </div>
  )
}
```

### Cleanup Orphaned Files

```typescript
async function cleanupFiles() {
  const response = await fetch('/api/admin/files', {
    method: 'DELETE',
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log(`Cleaned up ${result.data.summary.totalDeleted} files`)
  }
}
```

## Utility Functions

### Image Processing
```typescript
import { 
  deleteImage, 
  getImageInfo, 
  validateImageUrl,
  generateResponsiveImageSizes 
} from '@/lib/image-utils'

// Delete an image
await deleteImage('/uploads/projects/image.jpg')

// Get image information
const info = getImageInfo('/uploads/projects/image.jpg')

// Validate image URL
const isValid = await validateImageUrl('/uploads/projects/image.jpg')

// Generate responsive sizes
const sizes = generateResponsiveImageSizes(800)
```

### File Cleanup
```typescript
import { 
  cleanupProjectFiles, 
  cleanupExperienceFiles,
  getStorageStats 
} from '@/lib/file-cleanup'

// Clean up files for deleted project
await cleanupProjectFiles(projectId)

// Clean up files for deleted experience
await cleanupExperienceFiles(experienceId)

// Get storage statistics
const stats = await getStorageStats()
```

## Error Handling

### Common Errors

| Error | Status | Description |
|-------|--------|-------------|
| `No file provided` | 400 | File missing from request |
| `File size exceeds maximum` | 400 | File too large |
| `File type not allowed` | 400 | Invalid file type |
| `Authentication required` | 401 | Not authenticated |
| `File upload failed` | 500 | Server error |

### Error Response Format
```typescript
{
  success: false
  error: string           // User-friendly error message
  details?: string        // Technical details (development only)
}
```

## Performance Considerations

### Image Optimization
- Next.js Image component integration with production domain allowlisting
- Lazy loading support with intersection observer
- WebP/AVIF format conversion with automatic selection
- Responsive image sizing with multiple device breakpoints (640px to 3840px)
- Multiple image sizes for different use cases (16px to 384px)
- Automatic optimization and compression
- CDN-friendly caching headers (1 year cache for uploaded images)
- Secure remote pattern matching for external images

### File Management
- Orphaned file cleanup
- Storage monitoring
- Batch operations
- Efficient file operations

## Testing

Run the upload system tests:

```bash
npx tsx scripts/test-upload.ts
```

The test covers:
- File validation
- Secure filename generation
- Storage statistics
- Image URL validation
- Directory structure

## Configuration

### Environment Variables
```env
# File upload limits (optional, defaults provided)
MAX_FILE_SIZE=5242880          # 5MB in bytes
MAX_LOGO_SIZE=2097152          # 2MB in bytes

# Production domain configuration (for Next.js Image optimization)
NEXT_PUBLIC_APP_URL=https://creavibe.pro
```

### Next.js Image Configuration
The image system is configured in `next.config.js` with production-ready settings:

```javascript
images: {
  domains: ['localhost', 'creavibe.pro', 'clerk.creavibe.pro'],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'creavibe.pro',
    },
    {
      protocol: 'https',
      hostname: '*.creavibe.pro',
    },
    {
      protocol: 'https',
      hostname: 'images.clerk.dev',
    },
    {
      protocol: 'https',
      hostname: 'img.clerk.com',
    },
  ],
}
```

**Security Features:**
- **Domain Allowlisting**: Only approved domains can serve images
- **Pattern Matching**: Secure external image loading with hostname validation
- **Clerk Integration**: Approved domains for user profile images
- **Protocol Enforcement**: HTTPS-only for external images

### Security Configuration
Located in `lib/security.ts`:

```typescript
export const SECURITY_CONFIG = {
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024,     // 5MB
    MAX_LOGO_SIZE: 2 * 1024 * 1024,     // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_LOGO_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    MAX_FILES_PER_REQUEST: 1,
  }
}
```

## Monitoring and Maintenance

### Storage Monitoring
- Regular cleanup of orphaned files
- Storage usage tracking
- File integrity checks
- Performance monitoring

### Maintenance Tasks
```bash
# Check storage statistics
curl -X GET /api/admin/files

# Clean up orphaned files
curl -X DELETE /api/admin/files

# Test upload system
npx tsx scripts/test-upload.ts
```

## OptimizedImage Component

The `OptimizedImage` component provides advanced image optimization and loading features for displaying uploaded images:

### Features
- **Automatic Optimization**: Uses Next.js Image component with optimized settings
- **Preset Configurations**: Pre-defined settings for different use cases
- **Fill Mode Support**: Properly handles Next.js Image fill prop by removing conflicting width/height
- **Loading States**: Skeleton loading and smooth transitions
- **Error Handling**: Fallback images and graceful error states
- **Responsive Images**: Automatic sizing based on viewport
- **Blur Placeholder**: Generated blur data URLs for smooth loading

### Usage Examples

```tsx
// Basic usage with preset
<OptimizedImage
  src="/uploads/projects/my-project.jpg"
  alt="My Project"
  preset="project_showcase"
/>

// Custom dimensions
<OptimizedImage
  src="/uploads/companies/company-logo.png"
  alt="Company Logo"
  width={200}
  height={100}
  quality={90}
/>

// Fill mode for containers (automatically removes width/height)
<OptimizedImage
  src="/uploads/projects/project.jpg"
  alt="Project Image"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>

// With fallback
<OptimizedImage
  src="/uploads/projects/project.jpg"
  alt="Project Image"
  preset="project_card"
  fallbackSrc="/uploads/projects/placeholder.svg"
/>
```

### Fill Mode Handling

The component intelligently handles the `fill` prop by:
- Automatically removing `width` and `height` properties when `fill={true}`
- Providing sensible default `sizes` attribute for responsive images
- Adding proper object-fit classes for image scaling within containers

### Available Presets

```typescript
// Common presets for uploaded images
'project_showcase'    // Large project images (800x600)
'project_card'        // Project card thumbnails (400x300)
'company_logo'        // Company logos (200x100)
'profile'            // Profile photos (300x300)
```

## Integration with Project Management

The upload system integrates seamlessly with:
- Project CRUD operations
- Experience management
- Database cleanup
- File lifecycle management

When projects or experiences are deleted, associated files are automatically cleaned up through the `file-cleanup.ts` utilities.