import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { validateProjectData, SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { Project, ApiResponse, ProjectFormData, ErrorResponse } from '@/lib/types'

// GET /api/projects - Fetch all projects (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    let query = `
      SELECT 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects
    `

    // Filter by featured if requested
    if (featured === 'true') {
      query += ' WHERE featured = true'
    }

    // Order by featured first, then by creation date
    query += ' ORDER BY featured DESC, created_at DESC'

    const projects = await db.query<Project>(query)

    return NextResponse.json<ApiResponse<Project[]>>({
      success: true,
      data: projects,
      message: `Retrieved ${projects.length} projects`
    }, { headers })

  } catch (error) {
    console.error('Error fetching projects:', error)
    
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch projects'
    }, { 
      status: 500,
      headers 
    })
  }
}

// POST /api/projects - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Parse request body
    const body = await request.json()
    const projectData: ProjectFormData = body

    // Validate required fields
    if (!projectData.imageUrl) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Image URL is required'
      }, { 
        status: 400,
        headers 
      })
    }

    // Validate project data
    const validation = validateProjectData(projectData)
    if (!validation.valid) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      }, { 
        status: 400,
        headers 
      })
    }

    // Insert project into database
    const result = await db.query<Project>(`
      INSERT INTO projects (
        title, 
        description, 
        tech_stack, 
        github_url, 
        demo_url, 
        image_url, 
        featured,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `, [
      projectData.title.trim(),
      projectData.description.trim(),
      JSON.stringify(projectData.techStack),
      projectData.githubUrl || null,
      projectData.demoUrl || null,
      projectData.imageUrl,
      projectData.featured || false
    ])

    const newProject = result[0]

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    }, { 
      status: 201,
      headers 
    })

  } catch (error) {
    console.error('Error creating project:', error)
    
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { 
        status: 401,
        headers 
      })
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create project'
    }, { 
      status: 500,
      headers 
    })
  }
}