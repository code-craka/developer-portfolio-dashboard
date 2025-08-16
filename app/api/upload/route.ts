import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { requireAdminAuth } from '@/lib/clerk'
import { validateFileUpload, generateSecureFileName, SECURITY_HEADERS } from '@/lib/security'
import { ApiResponse } from '@/lib/types'

// POST /api/upload - Handle file uploads for projects and company logos
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'project' or 'logo'

    if (!file) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'No file provided'
      }, { 
        status: 400,
        headers: SECURITY_HEADERS
      })
    }

    // Determine if this is a logo upload
    const isLogo = type === 'logo'

    // Validate file upload
    const validation = validateFileUpload(file, isLogo)
    if (!validation.valid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: validation.error
      }, { 
        status: 400,
        headers: SECURITY_HEADERS
      })
    }

    // Generate secure filename
    const secureFileName = generateSecureFileName(file.name)
    
    // Determine upload directory
    const uploadDir = isLogo ? 'public/uploads/companies' : 'public/uploads/projects'
    const filePath = path.join(process.cwd(), uploadDir, secureFileName)

    // Ensure upload directory exists
    const dirPath = path.dirname(filePath)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    // Return the relative URL for the uploaded file
    const imageUrl = isLogo 
      ? `/uploads/companies/${secureFileName}`
      : `/uploads/projects/${secureFileName}`

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        imageUrl,
        fileName: secureFileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      message: 'File uploaded successfully'
    }, {
      status: 200,
      headers: SECURITY_HEADERS
    })

  } catch (error) {
    console.error('File upload error:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { 
        status: 401,
        headers: SECURITY_HEADERS
      })
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'File upload failed'
    }, { 
      status: 500,
      headers: SECURITY_HEADERS
    })
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...SECURITY_HEADERS,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}