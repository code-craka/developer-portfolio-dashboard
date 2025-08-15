import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = req.headers
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

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
    return new NextResponse('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        // Create admin user in database
        await sql`
          INSERT INTO admins (clerk_id, email, name, role, created_at, updated_at)
          VALUES (
            ${evt.data.id},
            ${evt.data.email_addresses[0]?.email_address || ''},
            ${`${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim()},
            'admin',
            NOW(),
            NOW()
          )
          ON CONFLICT (clerk_id) DO NOTHING
        `
        console.log(`Admin user created: ${evt.data.id}`)
        break

      case 'user.updated':
        // Update admin user in database
        await sql`
          UPDATE admins 
          SET 
            email = ${evt.data.email_addresses[0]?.email_address || ''},
            name = ${`${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim()},
            updated_at = NOW()
          WHERE clerk_id = ${evt.data.id}
        `
        console.log(`Admin user updated: ${evt.data.id}`)
        break

      case 'user.deleted':
        // Delete admin user from database
        await sql`
          DELETE FROM admins WHERE clerk_id = ${evt.data.id}
        `
        console.log(`Admin user deleted: ${evt.data.id}`)
        break

      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Webhook ${eventType} processed successfully` 
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}