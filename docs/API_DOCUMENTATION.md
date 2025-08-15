# API Documentation

This document provides comprehensive documentation for all API endpoints in the Developer Portfolio Dashboard.

## Base URL

```
http://localhost:3000/api (development)
https://your-domain.com/api (production)
```

## Authentication

Most admin endpoints require authentication via Clerk. Include the Clerk session token in your requests.

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

Get all projects or featured projects only.

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
  ]
}
```

### GET /api/projects/[id]

Get a specific project by ID.

**Parameters:**
- `id`: Project ID (number)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Project Title",
    "description": "Project description",
    "techStack": ["React", "TypeScript"],
    "githubUrl": "https://github.com/user/repo",
    "demoUrl": "https://demo.example.com",
    "imageUrl": "/uploads/projects/image.jpg",
    "featured": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### POST /api/admin/projects

Create a new project. **Requires authentication.**

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "techStack": ["React", "TypeScript"],
  "githubUrl": "https://github.com/user/repo",
  "demoUrl": "https://demo.example.com",
  "imageUrl": "/uploads/projects/image.jpg",
  "featured": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New Project",
    // ... other project fields
  },
  "message": "Project created successfully"
}
```

### PUT /api/admin/projects/[id]

Update an existing project. **Requires authentication.**

**Parameters:**
- `id`: Project ID (number)

**Request Body:** (partial update supported)
```json
{
  "title": "Updated Project Title",
  "featured": true
}
```

### DELETE /api/admin/projects/[id]

Delete a project. **Requires authentication.**

**Parameters:**
- `id`: Project ID (number)

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## Experience Endpoints

### GET /api/experiences

Get all work experiences, ordered by start date (most recent first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Tech Company",
      "position": "Senior Developer",
      "startDate": "2023-01-15",
      "endDate": null,
      "description": "Job description",
      "achievements": ["Achievement 1", "Achievement 2"],
      "technologies": ["React", "Node.js"],
      "companyLogo": "/uploads/logos/company.png",
      "location": "San Francisco, CA",
      "employmentType": "Full-time",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST /api/admin/experiences

Create a new experience entry. **Requires authentication.**

**Request Body:**
```json
{
  "company": "New Company",
  "position": "Developer",
  "startDate": "2024-01-15",
  "endDate": "2024-12-15",
  "description": "Job description",
  "achievements": ["Achievement 1"],
  "technologies": ["JavaScript", "Python"],
  "companyLogo": "/uploads/logos/company.png",
  "location": "Remote",
  "employmentType": "Contract"
}
```

### PUT /api/admin/experiences/[id]

Update an experience entry. **Requires authentication.**

### DELETE /api/admin/experiences/[id]

Delete an experience entry. **Requires authentication.**

## Contact Endpoints

### POST /api/contact

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss a project."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Rate Limit:** 3 submissions per 15 minutes per IP

### GET /api/admin/contacts

Get all contact messages. **Requires authentication.**

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
      "message": "Hello, I'd like to discuss a project.",
      "read": false,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### PUT /api/admin/contacts/[id]/read

Mark a contact message as read. **Requires authentication.**

### DELETE /api/admin/contacts/[id]

Delete a contact message. **Requires authentication.**

## File Upload Endpoints

### POST /api/admin/upload

Upload files (images, documents). **Requires authentication.**

**Request:** Multipart form data with file field

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/projects/filename.jpg",
    "filename": "filename.jpg",
    "size": 1024000
  }
}
```

**Limits:**
- Max file size: 5MB
- Allowed types: Images (jpg, png, gif, webp)
- Rate limit: 10 uploads per minute

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
- `getAllExperiences()`: Get all experiences
- `getExperienceById(id)`: Get experience by ID
- `createExperience(data)`: Create new experience
- `updateExperience(id, data)`: Update experience
- `deleteExperience(id)`: Delete experience

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