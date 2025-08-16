import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { ContactMessage, ApiResponse } from '@/lib/types'

// PUT /api/contact/[id] - Mark contact message as read/unread (admin only)
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

    // Await params and validate ID parameter
    const { id } = await params
    const messageId = parseInt(id)
    if (isNaN(messageId) || messageId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid message ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Parse request body
    const body = await request.json()
    const { read } = body

    // Validate read parameter
    if (typeof read !== 'boolean') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Read status must be a boolean value'
      }, { 
        status: 400,
        headers 
      })
    }

    // Check if message exists
    const existingMessage = await db.query<ContactMessage>(`
      SELECT id FROM contacts WHERE id = $1
    `, [messageId])

    if (existingMessage.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Contact message not found'
      }, { 
        status: 404,
        headers 
      })
    }

    // Update message read status
    const result = await db.query<ContactMessage>(`
      UPDATE contacts 
      SET read = $1
      WHERE id = $2
      RETURNING 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
    `, [read, messageId])

    const updatedMessage = result[0]

    return NextResponse.json<ApiResponse<ContactMessage>>({
      success: true,
      data: updatedMessage,
      message: `Message marked as ${read ? 'read' : 'unread'}`
    }, { headers })

  } catch (error) {
    console.error('Error updating contact message:', error)
    
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
      error: 'Failed to update contact message'
    }, { 
      status: 500,
      headers 
    })
  }
}

// GET /api/contact/[id] - Get specific contact message (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Await params and validate ID parameter
    const { id } = await params
    const messageId = parseInt(id)
    if (isNaN(messageId) || messageId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid message ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Fetch specific contact message
    const result = await db.query<ContactMessage>(`
      SELECT 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
      FROM contacts 
      WHERE id = $1
    `, [messageId])

    if (result.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Contact message not found'
      }, { 
        status: 404,
        headers 
      })
    }

    const message = result[0]

    return NextResponse.json<ApiResponse<ContactMessage>>({
      success: true,
      data: message,
      message: 'Contact message retrieved successfully'
    }, { headers })

  } catch (error) {
    console.error('Error fetching contact message:', error)
    
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
      error: 'Failed to fetch contact message'
    }, { 
      status: 500,
      headers 
    })
  }
}

// DELETE /api/contact/[id] - Delete contact message (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Await params and validate ID parameter
    const { id } = await params
    const messageId = parseInt(id)
    if (isNaN(messageId) || messageId <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid message ID'
      }, { 
        status: 400,
        headers 
      })
    }

    // Check if message exists
    const existingMessage = await db.query<ContactMessage>(`
      SELECT id FROM contacts WHERE id = $1
    `, [messageId])

    if (existingMessage.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Contact message not found'
      }, { 
        status: 404,
        headers 
      })
    }

    // Delete the contact message
    await db.query(`
      DELETE FROM contacts WHERE id = $1
    `, [messageId])

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Contact message deleted successfully'
    }, { headers })

  } catch (error) {
    console.error('Error deleting contact message:', error)
    
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
      error: 'Failed to delete contact message'
    }, { 
      status: 500,
      headers 
    })
  }
}