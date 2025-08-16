import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { validateExperienceData, SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { Experience, ApiResponse, ExperienceFormData, ErrorResponse } from '@/lib/types'
import { unlink } from 'fs/promises'
import path from 'path'

// PUT /api/experiences/[id] - Update existing experience (admin only)
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
    const experienceId = parseInt(id)
    
    // Validate experience ID
    if (isNaN(experienceId) || experienceId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid experience ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Check if experience exists
    const existingExperience = await db.query<Experience>(`
      SELECT 
        id,
        company,
        position,
        start_date as "startDate",
        end_date as "endDate",
        description,
        achievements,
        technologies,
        company_logo as "companyLogo",
        location,
        employment_type as "employmentType",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM experiences 
      WHERE id = $1
    `, [experienceId])

    if (existingExperience.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Experience not found'
      }, { 
        status: 404,
        headers 
      })
    }

    // Parse request body
    const body = await request.json()
    const updateData: Partial<ExperienceFormData & { companyLogo?: string }> = body

    // Build dynamic update query
    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    if (updateData.company !== undefined) {
      updateFields.push(`company = $${paramIndex}`)
      updateValues.push(updateData.company.trim())
      paramIndex++
    }

    if (updateData.position !== undefined) {
      updateFields.push(`position = $${paramIndex}`)
      updateValues.push(updateData.position.trim())
      paramIndex++
    }

    if (updateData.startDate !== undefined) {
      updateFields.push(`start_date = $${paramIndex}`)
      updateValues.push(new Date(updateData.startDate))
      paramIndex++
    }

    if (updateData.endDate !== undefined) {
      updateFields.push(`end_date = $${paramIndex}`)
      updateValues.push(updateData.endDate ? new Date(updateData.endDate) : null)
      paramIndex++
    }

    if (updateData.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`)
      updateValues.push(updateData.description.trim())
      paramIndex++
    }

    if (updateData.achievements !== undefined) {
      updateFields.push(`achievements = $${paramIndex}`)
      updateValues.push(JSON.stringify(updateData.achievements || []))
      paramIndex++
    }

    if (updateData.technologies !== undefined) {
      updateFields.push(`technologies = $${paramIndex}`)
      updateValues.push(JSON.stringify(updateData.technologies || []))
      paramIndex++
    }

    if (updateData.companyLogo !== undefined) {
      updateFields.push(`company_logo = $${paramIndex}`)
      updateValues.push(updateData.companyLogo || null)
      paramIndex++
    }

    if (updateData.location !== undefined) {
      updateFields.push(`location = $${paramIndex}`)
      updateValues.push(updateData.location.trim())
      paramIndex++
    }

    if (updateData.employmentType !== undefined) {
      updateFields.push(`employment_type = $${paramIndex}`)
      updateValues.push(updateData.employmentType)
      paramIndex++
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = NOW()`)

    // Add experience ID for WHERE clause
    updateValues.push(experienceId)

    // Validate the update data if any validation fields are present
    if (updateData.company || updateData.position || updateData.startDate || updateData.description || updateData.location || updateData.employmentType) {
      const validationData: ExperienceFormData = {
        company: updateData.company || existingExperience[0].company,
        position: updateData.position || existingExperience[0].position,
        startDate: updateData.startDate ? new Date(updateData.startDate) : existingExperience[0].startDate,
        endDate: updateData.endDate !== undefined 
          ? (updateData.endDate ? new Date(updateData.endDate) : undefined)
          : existingExperience[0].endDate,
        description: updateData.description || existingExperience[0].description,
        achievements: updateData.achievements !== undefined ? updateData.achievements : existingExperience[0].achievements,
        technologies: updateData.technologies !== undefined ? updateData.technologies : existingExperience[0].technologies,
        location: updateData.location || existingExperience[0].location,
        employmentType: updateData.employmentType || existingExperience[0].employmentType
      }

      const validation = validateExperienceData(validationData)
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
      UPDATE experiences 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        company,
        position,
        start_date as "startDate",
        end_date as "endDate",
        description,
        achievements,
        technologies,
        company_logo as "companyLogo",
        location,
        employment_type as "employmentType",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `

    const result = await db.query<Experience>(updateQuery, updateValues)
    const updatedExperience = result[0]

    return NextResponse.json<ApiResponse<Experience>>({
      success: true,
      data: updatedExperience,
      message: 'Experience updated successfully'
    }, { headers })

  } catch (error) {
    console.error('Error updating experience:', error)
    
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
      error: 'Failed to update experience'
    }, { 
      status: 500,
      headers 
    })
  }
}

// DELETE /api/experiences/[id] - Delete experience (admin only)
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
    const experienceId = parseInt(id)
    
    // Validate experience ID
    if (isNaN(experienceId) || experienceId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid experience ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Get experience details before deletion (for file cleanup)
    const existingExperience = await db.query<Experience>(`
      SELECT 
        id,
        company,
        position,
        company_logo as "companyLogo"
      FROM experiences 
      WHERE id = $1
    `, [experienceId])

    if (existingExperience.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Experience not found'
      }, { 
        status: 404,
        headers 
      })
    }

    const experience = existingExperience[0]

    // Delete experience from database
    const deleteResult = await db.query(`
      DELETE FROM experiences 
      WHERE id = $1
      RETURNING id
    `, [experienceId])

    if (deleteResult.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to delete experience'
      }, { 
        status: 500,
        headers 
      })
    }

    // Clean up associated company logo file
    if (experience.companyLogo) {
      try {
        // Remove leading slash and construct full path
        const relativePath = experience.companyLogo.startsWith('/') 
          ? experience.companyLogo.slice(1) 
          : experience.companyLogo
        
        const filePath = path.join(process.cwd(), 'public', relativePath)
        await unlink(filePath)
        console.log(`Deleted company logo file: ${filePath}`)
      } catch (fileError) {
        // Log error but don't fail the deletion
        console.warn(`Failed to delete company logo file for experience ${experienceId}:`, fileError)
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Experience "${experience.position} at ${experience.company}" deleted successfully`
    }, { headers })

  } catch (error) {
    console.error('Error deleting experience:', error)
    
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
      error: 'Failed to delete experience'
    }, { 
      status: 500,
      headers 
    })
  }
}