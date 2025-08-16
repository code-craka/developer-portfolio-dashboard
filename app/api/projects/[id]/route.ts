import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { validateProjectData, SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { Project, ApiResponse, ProjectFormData, ErrorResponse } from '@/lib/types'
import { unlink } from 'fs/promises'
import path from 'path'

// PUT /api/projects/[id] - Update existing project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    const { id } = await params
    const projectId = parseInt(id)
    
    // Validate project ID
    if (isNaN(projectId) || projectId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid project ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Check if project exists
    const existingProject = await db.query<Project>(`
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
      WHERE id = $1
    `, [projectId])

    if (existingProject.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Project not found'
      }, { 
        status: 404,
        headers 
      })
    }

    // Parse request body
    const body = await request.json()
    const updateData: Partial<ProjectFormData & { imageUrl: string }> = body

    // Build dynamic update query
    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    if (updateData.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`)
      updateValues.push(updateData.title.trim())
      paramIndex++
    }

    if (updateData.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`)
      updateValues.push(updateData.description.trim())
      paramIndex++
    }

    if (updateData.techStack !== undefined) {
      updateFields.push(`tech_stack = $${paramIndex}`)
      updateValues.push(JSON.stringify(updateData.techStack))
      paramIndex++
    }

    if (updateData.githubUrl !== undefined) {
      updateFields.push(`github_url = $${paramIndex}`)
      updateValues.push(updateData.githubUrl || null)
      paramIndex++
    }

    if (updateData.demoUrl !== undefined) {
      updateFields.push(`demo_url = $${paramIndex}`)
      updateValues.push(updateData.demoUrl || null)
      paramIndex++
    }

    if (updateData.imageUrl !== undefined) {
      updateFields.push(`image_url = $${paramIndex}`)
      updateValues.push(updateData.imageUrl)
      paramIndex++
    }

    if (updateData.featured !== undefined) {
      updateFields.push(`featured = $${paramIndex}`)
      updateValues.push(updateData.featured)
      paramIndex++
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = NOW()`)

    // Add project ID for WHERE clause
    updateValues.push(projectId)

    // Validate the update data if any validation fields are present
    if (updateData.title || updateData.description || updateData.techStack) {
      const validationData: ProjectFormData = {
        title: updateData.title || existingProject[0].title,
        description: updateData.description || existingProject[0].description,
        techStack: updateData.techStack || existingProject[0].techStack,
        githubUrl: updateData.githubUrl !== undefined ? updateData.githubUrl : existingProject[0].githubUrl,
        demoUrl: updateData.demoUrl !== undefined ? updateData.demoUrl : existingProject[0].demoUrl,
        featured: updateData.featured !== undefined ? updateData.featured : existingProject[0].featured
      }

      const validation = validateProjectData(validationData)
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
    }

    // Execute update query
    const updateQuery = `
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
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
    `

    const result = await db.query<Project>(updateQuery, updateValues)
    const updatedProject = result[0]

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    }, { headers })

  } catch (error) {
    console.error('Error updating project:', error)
    
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
      error: 'Failed to update project'
    }, { 
      status: 500,
      headers 
    })
  }
}

// DELETE /api/projects/[id] - Delete project (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    const { id } = await params
    const projectId = parseInt(id)
    
    // Validate project ID
    if (isNaN(projectId) || projectId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid project ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Get project details before deletion (for file cleanup)
    const existingProject = await db.query<Project>(`
      SELECT 
        id,
        title,
        image_url as "imageUrl"
      FROM projects 
      WHERE id = $1
    `, [projectId])

    if (existingProject.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Project not found'
      }, { 
        status: 404,
        headers 
      })
    }

    const project = existingProject[0]

    // Delete project from database
    const deleteResult = await db.query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING id
    `, [projectId])

    if (deleteResult.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to delete project'
      }, { 
        status: 500,
        headers 
      })
    }

    // Clean up associated image file
    if (project.imageUrl) {
      try {
        // Remove leading slash and construct full path
        const relativePath = project.imageUrl.startsWith('/') 
          ? project.imageUrl.slice(1) 
          : project.imageUrl
        
        const filePath = path.join(process.cwd(), 'public', relativePath)
        await unlink(filePath)
        console.log(`Deleted image file: ${filePath}`)
      } catch (fileError) {
        // Log error but don't fail the deletion
        console.warn(`Failed to delete image file for project ${projectId}:`, fileError)
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Project "${project.title}" deleted successfully`
    }, { headers })

  } catch (error) {
    console.error('Error deleting project:', error)
    
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
      error: 'Failed to delete project'
    }, { 
      status: 500,
      headers 
    })
  }
}