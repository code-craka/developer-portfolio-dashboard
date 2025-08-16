import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/clerk'
import { validateContactData, sanitizeInput, SECURITY_HEADERS } from '@/lib/security'
import { db } from '@/lib/db'
import { ContactMessage, ApiResponse, ContactFormData, ErrorResponse } from '@/lib/types'

// POST /api/contact - Submit contact form (public endpoint)
export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Parse request body
    const body = await request.json()
    const contactData: ContactFormData = body

    // Validate contact data
    const validation = validateContactData(contactData)
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

    // Sanitize input data
    const sanitizedData = {
      name: sanitizeInput(contactData.name),
      email: sanitizeInput(contactData.email),
      message: sanitizeInput(contactData.message)
    }

    // Insert contact message into database
    const result = await db.query<ContactMessage>(`
      INSERT INTO contacts (
        name, 
        email, 
        message, 
        read,
        created_at
      )
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
    `, [
      sanitizedData.name,
      sanitizedData.email,
      sanitizedData.message,
      false
    ])

    const newMessage = result[0]

    return NextResponse.json<ApiResponse<ContactMessage>>({
      success: true,
      data: newMessage,
      message: 'Contact message submitted successfully'
    }, { 
      status: 201,
      headers 
    })

  } catch (error) {
    console.error('Error submitting contact message:', error)
    
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to submit contact message'
    }, { 
      status: 500,
      headers 
    })
  }
}

// GET /api/contact - Get all contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth()

    // Add security headers
    const headers = new Headers(SECURITY_HEADERS)
    headers.set('Content-Type', 'application/json')

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread')

    let query = `
      SELECT 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
      FROM contacts
    `

    // Filter by unread messages if requested
    if (unreadOnly === 'true') {
      query += ' WHERE read = false'
    }

    // Order by creation date (newest first)
    query += ' ORDER BY created_at DESC'

    const messages = await db.query<ContactMessage>(query)

    return NextResponse.json<ApiResponse<ContactMessage[]>>({
      success: true,
      data: messages,
      message: `Retrieved ${messages.length} contact messages`
    }, { headers })

  } catch (error) {
    console.error('Error fetching contact messages:', error)
    
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
      error: 'Failed to fetch contact messages'
    }, { 
      status: 500,
      headers 
    })
  }
}