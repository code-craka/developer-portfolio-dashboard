import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const { id } = body?.data
  const eventType = evt?.type

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  // Handle different event types
  switch (eventType) {
    case 'user.created':
      console.log('User created:', body.data)
      // Add your user creation logic here
      break
    case 'user.updated':
      console.log('User updated:', body.data)
      // Add your user update logic here
      break
    case 'user.deleted':
      console.log('User deleted:', body.data)
      // Add your user deletion logic here
      break
    case 'session.created':
      console.log('Session created:', body.data)
      // Add your session creation logic here
      break
    case 'session.ended':
      console.log('Session ended:', body.data)
      // Add your session end logic here
      break
    default:
      console.log(`Unhandled event type: ${eventType}`)
  }

  return NextResponse.json({ received: true })
}