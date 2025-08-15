import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { AdminService } from '@/lib/admin-service'

// Type guards for webhook data
interface UserWebhookData {
  id: string
  email_addresses?: Array<{ email_address: string }>
  first_name?: string
  last_name?: string
}

interface SessionWebhookData {
  id: string
  user_id: string
}

function isUserWebhookData(data: any): data is UserWebhookData {
  return data && typeof data.id === 'string' && (
    data.email_addresses || data.first_name || data.last_name
  )
}

function isSessionWebhookData(data: any): data is SessionWebhookData {
  return data && typeof data.id === 'string' && typeof data.user_id === 'string'
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = req.headers
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers')
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new NextResponse('Error occurred -- webhook verification failed', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  const userData = evt.data

  console.log(`Processing Clerk webhook: ${eventType} for user: ${userData.id}`)

  try {
    switch (eventType) {
      case 'user.created':
      case 'user.updated':
        {
          if (!isUserWebhookData(userData)) {
            throw new Error(`Invalid user data for ${eventType}`)
          }
          
          const email = userData.email_addresses?.[0]?.email_address || ''
          const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || email
          
          const admin = await AdminService.upsertAdmin(userData.id, email, name)
          console.log(`Admin user ${eventType === 'user.created' ? 'created' : 'updated'}:`, {
            clerkId: admin.clerkId,
            email: admin.email,
            name: admin.name,
            role: admin.role
          })
        }
        break

      case 'user.deleted':
        {
          if (!userData.id) {
            throw new Error('Invalid user data for user.deleted')
          }
          
          const deleted = await AdminService.deleteAdmin(userData.id as string)
          if (deleted) {
            console.log(`Admin user deleted: ${userData.id}`)
          } else {
            console.log(`Admin user not found for deletion: ${userData.id}`)
          }
        }
        break

      case 'session.created':
      case 'session.ended':
        {
          if (!isSessionWebhookData(userData)) {
            console.log(`Invalid session data for ${eventType}`)
            break
          }
          
          console.log(`User session ${eventType === 'session.created' ? 'created' : 'ended'}: ${userData.user_id}`)
          // Update last login time could be added here if needed
        }
        break

      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Webhook ${eventType} processed successfully`,
      eventType,
      userId: userData.id || 'unknown'
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook',
        eventType,
        userId: userData.id || 'unknown',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}