import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { validateAndCleanupImage } from '@/lib/file-cleanup'
import { SECURITY_HEADERS } from '@/lib/security'
import { ApiResponse } from '@/lib/types'

// POST /api/admin/files/delete - Delete specific image file
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Image URL is required'
      }, { 
        status: 400,
        headers: SECURITY_HEADERS
      })
    }

    // Validate and delete the image
    const result = await validateAndCleanupImage(imageUrl)

    if (!result.exists) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Image file not found'
      }, { 
        status: 404,
        headers: SECURITY_HEADERS
      })
    }

    if (!result.deleted) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: result.error || 'Failed to delete image file'
      }, { 
        status: 500,
        headers: SECURITY_HEADERS
      })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        imageUrl,
        deleted: true
      },
      message: 'Image file deleted successfully'
    }, {
      status: 200,
      headers: SECURITY_HEADERS
    })

  } catch (error) {
    console.error('Error deleting image file:', error)

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
      error: 'Failed to delete image file'
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