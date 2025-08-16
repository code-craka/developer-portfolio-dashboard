import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { validateExperienceData, SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { Experience, ApiResponse, ExperienceFormData, ErrorResponse } from '@/lib/types'

// GET /api/experiences - Fetch all experiences (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Fetch all experiences with chronological sorting (most recent first)
    const query = `
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
      ORDER BY 
        CASE WHEN end_date IS NULL THEN 1 ELSE 0 END DESC,
        COALESCE(end_date, start_date) DESC,
        start_date DESC
    `

    const experiences = await db.query<Experience>(query)

    return NextResponse.json<ApiResponse<Experience[]>>({
      success: true,
      data: experiences,
      message: `Retrieved ${experiences.length} experiences`
    }, { headers })

  } catch (error) {
    console.error('Error fetching experiences:', error)
    
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch experiences'
    }, { 
      status: 500,
      headers 
    })
  }
}

// POST /api/experiences - Create new experience (admin only)
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Parse request body
    const body = await request.json()
    const experienceData: ExperienceFormData & { companyLogo?: string } = body

    // Validate experience data
    const validation = validateExperienceData(experienceData)
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

    // Convert date strings to Date objects if needed
    const startDate = new Date(experienceData.startDate)
    const endDate = experienceData.endDate ? new Date(experienceData.endDate) : null

    // Insert experience into database
    const result = await db.query<Experience>(`
      INSERT INTO experiences (
        company, 
        position, 
        start_date, 
        end_date, 
        description, 
        achievements, 
        technologies, 
        company_logo, 
        location,
        employment_type,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
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
    `, [
      experienceData.company.trim(),
      experienceData.position.trim(),
      startDate,
      endDate,
      experienceData.description.trim(),
      JSON.stringify(experienceData.achievements || []),
      JSON.stringify(experienceData.technologies || []),
      experienceData.companyLogo || null,
      experienceData.location.trim(),
      experienceData.employmentType
    ])

    const newExperience = result[0]

    return NextResponse.json<ApiResponse<Experience>>({
      success: true,
      data: newExperience,
      message: 'Experience created successfully'
    }, { 
      status: 201,
      headers 
    })

  } catch (error) {
    console.error('Error creating experience:', error)
    
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
      error: 'Failed to create experience'
    }, { 
      status: 500,
      headers 
    })
  }
}