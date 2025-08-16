# API Documentation

This document provides comprehensive documentation for all API endpoints in the Developer Portfolio Dashboard. This is an **open-source project** available under the MIT License.

## Overview

The API supports both public endpoints for the portfolio frontend and protected admin endpoints for content management through the admin dashboard interface.

**Key Features:**
- Complete CRUD operations for projects, experiences, and contact messages
- Secure admin authentication with Clerk integration
- File upload system with validation and cleanup
- Rate limiting and comprehensive security headers
- Database health monitoring and auto-repair
- Responsive admin dashboard with real-time updates
- Public portfolio endpoints for displaying content

## Technology Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Runtime**: Node.js 18+
- **Database**: NeonDB (PostgreSQL) with @neondatabase/serverless 0.9.0
- **Authentication**: Clerk 6.31.1
- **Styling**: TailwindCSS 3.4.3 with Headless UI 2.2.7
- **Animations**: Framer Motion 10.18.0

## Base URL

```
http://localhost:3000/api (development)
https://your-domain.com/api (production)
```

## Authentication

Most admin endpoints require authentication via Clerk. Include the Clerk session token in your requests.

## Admin Dashboard Interface

The API endpoints are integrated with a comprehensive admin dashboard interface that provides:

- **Project Management**: Full CRUD interface at `/admin/projects` with image upload, editing, and deletion
- **Real-time Updates**: Automatic refresh and notifications for all operations
- **Responsive Design**: Mobile-friendly interface with glassmorphism design
- **File Management**: Drag-and-drop image upload with validation and preview
- **Error Handling**: User-friendly error messages and success notifications

### Admin Routes
- `/admin/dashboard` - Main dashboard overview
- `/admin/projects` - Project management interface (✅ Implemented)
- `/admin/experience` - Experience management interface (🚧 Planned)
- `/admin/messages` - Contact message management interface (🚧 Planned)
- `/admin/profile` - Admin profile management

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **Public API**: 100 requests per minute
- **Admin API**: 200 requests per minute  
- **Contact Form**: 3 submissions per 15 minutes
- **File Upload**: 10 uploads per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Health Check Endpoints

### GET /api/health/db

Check database connectivity and health status.

**Response:**
```json
{
  "success": true,
  "health": {
    "connected": true,
    "tablesExist": {
      "projects": true,
      "experiences": true,
      "contacts": true,
      "admins": true
    },
    "indexesExist": true,
    "lastChecked": "2025-08-15T10:30:00.000Z"
  },
  "timestamp": "2025-08-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200`: Database is healthy
- `503`: Database issues detected
- `500`: Health check failed

### POST /api/health/db

Attempt to auto-repair database issues.

**Response:**
```json
{
  "success": true,
  "message": "Database successfully repaired",
  "timestamp": "2025-08-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200`: Repair successful
- `500`: Repair failed

## Project Endpoints

### GET /api/projects

Get all projects or featured projects only. **Public endpoint - no authentication required.**

**Query Parameters:**
- `featured` (optional): Set to `true` to get only featured projects

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Project description",
      "techStack": ["React", "TypeScript", "Next.js"],
      "githubUrl": "https://github.com/user/repo",
      "demoUrl": "https://demo.example.com",
      "imageUrl": "/uploads/projects/image.jpg",
      "featured": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "message": "Retrieved 1 projects"
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

### POST /api/projects

Create a new project. **Requires admin authentication.**

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description with at least 10 characters",
  "techStack": ["React", "TypeScript", "Next.js"],
  "githubUrl": "https://github.com/user/repo",
  "demoUrl": "https://demo.example.com",
  "imageUrl": "/uploads/projects/image.jpg",
  "featured": false
}
```

**Validation Rules:**
- `title`: Required, minimum 3 characters
- `description`: Required, minimum 10 characters
- `techStack`: Required, at least one technology
- `githubUrl`: Optional, must be valid URL if provided
- `demoUrl`: Optional, must be valid URL if provided
- `imageUrl`: Required, cannot be empty string
- `featured`: Optional, defaults to false

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New Project",
    "description": "Project description with at least 10 characters",
    "techStack": ["React", "TypeScript", "Next.js"],
    "githubUrl": "https://github.com/user/repo",
    "demoUrl": "https://demo.example.com",
    "imageUrl": "/uploads/projects/image.jpg",
    "featured": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Project created successfully"
}
```

**Status Codes:**
- `201`: Project created successfully
- `400`: Validation error or missing required fields
- `401`: Authentication required
- `500`: Server error

### PUT /api/projects/[id]

Update an existing project. **Requires admin authentication.**

**Parameters:**
- `id`: Project ID (number)

**Request Body:** (partial update supported - only include fields to update)
```json
{
  "title": "Updated Project Title",
  "description": "Updated description",
  "techStack": ["React", "TypeScript", "Node.js"],
  "githubUrl": "https://github.com/user/updated-repo",
  "demoUrl": "https://updated-demo.example.com",
  "imageUrl": "/uploads/projects/new-image.jpg",
  "featured": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Project Title",
    "description": "Updated description",
    "techStack": ["React", "TypeScript", "Node.js"],
    "githubUrl": "https://github.com/user/updated-repo",
    "demoUrl": "https://updated-demo.example.com",
    "imageUrl": "/uploads/projects/new-image.jpg",
    "featured": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-16T14:20:00.000Z"
  },
  "message": "Project updated successfully"
}
```

**Status Codes:**
- `200`: Project updated successfully
- `400`: Invalid project ID or validation error
- `401`: Authentication required
- `404`: Project not found
- `500`: Server error

### DELETE /api/projects/[id]

Delete a project and its associated image file. **Requires admin authentication.**

**Parameters:**
- `id`: Project ID (number)

**Response:**
```json
{
  "success": true,
  "message": "Project \"Project Title\" deleted successfully"
}
```

**Status Codes:**
- `200`: Project deleted successfully
- `400`: Invalid project ID
- `401`: Authentication required
- `404`: Project not found
- `500`: Server error

**Note:** This endpoint automatically cleans up associated image files from the filesystem. The implementation includes proper error handling for file cleanup operations, logging warnings if file deletion fails but not failing the database deletion.

## Experience Endpoints

### GET /api/experiences

Get all work experiences, ordered chronologically with current positions first. **Public endpoint - no authentication required.**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Tech Company",
      "position": "Senior Developer",
      "startDate": "2023-01-15T00:00:00.000Z",
      "endDate": null,
      "description": "Job description with detailed responsibilities",
      "achievements": ["Achievement 1", "Achievement 2"],
      "technologies": ["React", "Node.js", "TypeScript"],
      "companyLogo": "/uploads/companies/company.png",
      "location": "San Francisco, CA",
      "employmentType": "Full-time",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "message": "Retrieved 1 experiences"
}
```

**Sorting Logic:**
- Current positions (endDate is null) appear first
- Then sorted by end date (most recent first)
- Finally sorted by start date (most recent first)

**Status Codes:**
- `200`: Success
- `500`: Server error

### POST /api/experiences

Create a new experience entry. **Requires admin authentication.**

**Request Body:**
```json
{
  "company": "New Company",
  "position": "Software Developer",
  "startDate": "2024-01-15",
  "endDate": "2024-12-15",
  "description": "Detailed job description with at least 10 characters",
  "achievements": ["Achievement 1", "Achievement 2"],
  "technologies": ["JavaScript", "Python", "React"],
  "companyLogo": "/uploads/companies/company.png",
  "location": "Remote",
  "employmentType": "Contract"
}
```

**Validation Rules:**
- `company`: Required, minimum 2 characters
- `position`: Required, minimum 2 characters
- `startDate`: Required, valid date
- `endDate`: Optional, must be after startDate if provided
- `description`: Required, minimum 10 characters
- `achievements`: Optional array of strings
- `technologies`: Optional array of strings
- `companyLogo`: Optional, valid image URL
- `location`: Required, minimum 2 characters
- `employmentType`: Required, must be one of: 'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "company": "New Company",
    "position": "Software Developer",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-12-15T00:00:00.000Z",
    "description": "Detailed job description with at least 10 characters",
    "achievements": ["Achievement 1", "Achievement 2"],
    "technologies": ["JavaScript", "Python", "React"],
    "companyLogo": "/uploads/companies/company.png",
    "location": "Remote",
    "employmentType": "Contract",
    "createdAt": "2025-01-16T10:30:00.000Z",
    "updatedAt": "2025-01-16T10:30:00.000Z"
  },
  "message": "Experience created successfully"
}
```

**Status Codes:**
- `201`: Experience created successfully
- `400`: Validation error or missing required fields
- `401`: Authentication required
- `500`: Server error

### PUT /api/experiences/[id]

Update an existing experience entry. **Requires admin authentication.**

**Parameters:**
- `id`: Experience ID (number)

**Request Body:** (partial update supported - only include fields to update)
```json
{
  "company": "Updated Company Name",
  "position": "Senior Software Developer",
  "endDate": "2025-01-15",
  "achievements": ["New Achievement", "Updated Achievement"],
  "technologies": ["React", "TypeScript", "Node.js", "PostgreSQL"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company": "Updated Company Name",
    "position": "Senior Software Developer",
    "startDate": "2023-01-15T00:00:00.000Z",
    "endDate": "2025-01-15T00:00:00.000Z",
    "description": "Original job description",
    "achievements": ["New Achievement", "Updated Achievement"],
    "technologies": ["React", "TypeScript", "Node.js", "PostgreSQL"],
    "companyLogo": "/uploads/companies/company.png",
    "location": "San Francisco, CA",
    "employmentType": "Full-time",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-16T14:20:00.000Z"
  },
  "message": "Experience updated successfully"
}
```

**Status Codes:**
- `200`: Experience updated successfully
- `400`: Invalid experience ID or validation error
- `401`: Authentication required
- `404`: Experience not found
- `500`: Server error

### DELETE /api/experiences/[id]

Delete an experience entry and its associated company logo file. **Requires admin authentication.**

**Parameters:**
- `id`: Experience ID (number)

**Response:**
```json
{
  "success": true,
  "message": "Experience \"Senior Developer at Tech Company\" deleted successfully"
}
```

**Status Codes:**
- `200`: Experience deleted successfully
- `400`: Invalid experience ID
- `401`: Authentication required
- `404`: Experience not found
- `500`: Server error

**Note:** This endpoint automatically cleans up associated company logo files from the filesystem when available.

## Contact Endpoints

### POST /api/contact

Submit a contact form message. **Public endpoint - no authentication required.**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss a project with you."
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format, maximum 254 characters
- `message`: Required, minimum 10 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'd like to discuss a project with you.",
    "read": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Contact message submitted successfully"
}
```

**Status Codes:**
- `201`: Message submitted successfully
- `400`: Validation error or missing required fields
- `500`: Server error

**Rate Limit:** 3 submissions per 15 minutes per IP

### GET /api/contact

Get all contact messages. **Requires admin authentication.**

**Query Parameters:**
- `unread` (optional): Set to `true` to get only unread messages

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello, I'd like to discuss a project with you.",
      "read": false,
      "createdAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "message": "Interested in your services.",
      "read": true,
      "createdAt": "2025-01-14T15:20:00.000Z"
    }
  ],
  "message": "Retrieved 2 contact messages"
}
```

**Status Codes:**
- `200`: Success
- `401`: Authentication required
- `500`: Server error

### GET /api/contact/[id]

Get a specific contact message by ID. **Requires admin authentication.**

**Parameters:**
- `id`: Contact message ID (number)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'd like to discuss a project with you.",
    "read": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Contact message retrieved successfully"
}
```

**Status Codes:**
- `200`: Message retrieved successfully
- `400`: Invalid message ID
- `401`: Authentication required
- `404`: Message not found
- `500`: Server error

### PUT /api/contact/[id]

Mark a contact message as read or unread. **Requires admin authentication.**

**Parameters:**
- `id`: Contact message ID (number)

**Request Body:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'd like to discuss a project with you.",
    "read": true,
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Message marked as read"
}
```

**Status Codes:**
- `200`: Message updated successfully
- `400`: Invalid message ID or read status
- `401`: Authentication required
- `404`: Message not found
- `500`: Server error

### DELETE /api/contact/[id]

Delete a contact message. **Requires admin authentication.**

**Parameters:**
- `id`: Contact message ID (number)

**Response:**
```json
{
  "success": true,
  "message": "Contact message deleted successfully"
}
```

**Status Codes:**
- `200`: Message deleted successfully
- `400`: Invalid message ID
- `401`: Authentication required
- `404`: Message not found
- `500`: Server error

## File Upload Endpoints

### POST /api/upload

Upload files (project images or company logos). **Requires admin authentication.**

**Request:** Multipart form data
```javascript
const formData = new FormData()
formData.append('file', file)           // File object
formData.append('type', 'project')      // 'project' or 'logo'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/projects/filename.jpg",
    "fileName": "secure-filename.jpg",
    "originalName": "original-filename.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  "message": "File uploaded successfully"
}
```

**Validation:**
- **Project Images**: Max 5MB, JPG/PNG/WebP
- **Company Logos**: Max 2MB, JPG/PNG/WebP/SVG
- Secure filename generation with timestamp and random string
- Path traversal protection

**Status Codes:**
- `200`: Upload successful
- `400`: Validation error (file size, type, missing file)
- `401`: Authentication required
- `500`: Upload failed

## File Management Endpoints

### GET /api/admin/files

Get storage statistics and file information. **Requires admin authentication.**

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": { "count": 5, "totalSize": 2048000 },
    "companies": { "count": 2, "totalSize": 512000 },
    "total": { "count": 7, "totalSize": 2560000 }
  }
}
```

### DELETE /api/admin/files

Clean up orphaned files (files not referenced in database). **Requires admin authentication.**

**Response:**
```json
{
  "success": true,
  "data": {
    "cleanup": {
      "projects": { "deletedFiles": 2, "errors": [] },
      "companies": { "deletedFiles": 1, "errors": [] }
    },
    "summary": {
      "totalDeleted": 3,
      "totalErrors": 0,
      "errors": []
    }
  }
}
```

### POST /api/admin/files/delete

Delete a specific image file. **Requires admin authentication.**

**Request:**
```json
{
  "imageUrl": "/uploads/projects/filename.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Admin User Endpoints

### GET /api/admin/profile

Get current admin user profile. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "clerkId": "user_abc123",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `DATABASE_ERROR`: Database operation failed
- `UPLOAD_ERROR`: File upload failed

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

## Database Service Classes

The API uses service classes for database operations:

### ProjectService
- `getAllProjects()`: Get all projects
- `getFeaturedProjects()`: Get featured projects
- `getProjectById(id)`: Get project by ID
- `createProject(data)`: Create new project
- `updateProject(id, data)`: Update project
- `deleteProject(id)`: Delete project

### ExperienceService
- `getAllExperiences()`: Get all experiences with chronological sorting
- `getExperienceById(id)`: Get experience by ID
- `createExperience(data)`: Create new experience with validation
- `updateExperience(id, data)`: Update experience with partial data support
- `deleteExperience(id)`: Delete experience and cleanup associated files

### ContactService
- `getAllMessages()`: Get all contact messages
- `getUnreadMessages()`: Get unread messages
- `createMessage(data)`: Create new message
- `markAsRead(id)`: Mark message as read
- `deleteMessage(id)`: Delete message

### AdminService
- `getAdminByClerkId(clerkId)`: Get admin by Clerk ID
- `upsertAdmin(data)`: Create or update admin
- `deleteAdmin(clerkId)`: Delete admin

## Security Considerations

1. **Authentication**: All admin endpoints require valid Clerk session
2. **Rate Limiting**: Prevents abuse and DoS attacks
3. **Input Validation**: All inputs are validated and sanitized
4. **SQL Injection Prevention**: Parameterized queries used throughout
5. **File Upload Security**: File type and size restrictions
6. **CORS**: Configured for production domains only
7. **HTTPS**: Required in production

## Development vs Production

### Development
- Detailed error messages
- Debug logging enabled
- Relaxed CORS policy
- Local file uploads

### Production
- Generic error messages
- Minimal logging
- Strict CORS policy
- Cloud file storage recommended
- Rate limiting enforced
- HTTPS required

## Testing

Use tools like Postman, curl, or automated testing frameworks to test the API:

```bash
# Test database health
curl http://localhost:3000/api/health/db

# Get all projects
curl http://localhost:3000/api/projects

# Get featured projects only
curl http://localhost:3000/api/projects?featured=true

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## Support

For API-related issues:
1. Check the database health endpoint
2. Verify authentication tokens
3. Check rate limiting headers
4. Review error messages and codes
5. Consult the application logs