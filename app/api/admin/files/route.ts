import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { cleanupOrphanedFiles, getStorageStats } from '@/lib/file-cleanup'
import { SECURITY_HEADERS } from '@/lib/security'
import { ApiResponse } from '@/lib/types'

// GET /api/admin/files - Get file storage statistics
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    const stats = await getStorageStats()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats,
      message: 'Storage statistics retrieved successfully'
    }, {
      status: 200,
      headers: SECURITY_HEADERS
    })

  } catch (error) {
    console.error('Error getting storage stats:', error)

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
      error: 'Failed to get storage statistics'
    }, { 
      status: 500,
      headers: SECURITY_HEADERS
    })
  }
}

// DELETE /api/admin/files - Clean up orphaned files
export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    const cleanup = await cleanupOrphanedFiles()

    const totalDeleted = cleanup.projects.deletedFiles + cleanup.companies.deletedFiles
    const totalErrors = [...cleanup.projects.errors, ...cleanup.companies.errors]

    return NextResponse.json<ApiResponse>({
      success: totalErrors.length === 0,
      data: {
        cleanup,
        summary: {
          totalDeleted,
          totalErrors: totalErrors.length,
          errors: totalErrors
        }
      },
      message: totalDeleted > 0 
        ? `Successfully cleaned up ${totalDeleted} orphaned files`
        : 'No orphaned files found'
    }, {
      status: 200,
      headers: SECURITY_HEADERS
    })

  } catch (error) {
    console.error('Error cleaning up files:', error)

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
      error: 'Failed to clean up files'
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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}