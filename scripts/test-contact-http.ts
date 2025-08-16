#!/usr/bin/env tsx

/**
 * Contact API HTTP Test Script
 * 
 * This script provides HTTP test examples for the contact API endpoints.
 * Use these examples with tools like curl, Postman, or Insomnia.
 * 
 * Usage:
 *   npx tsx scripts/test-contact-http.ts
 */

console.log('📡 Contact API HTTP Test Examples\n')

const BASE_URL = 'http://localhost:3000'

console.log('🔗 API Endpoints:\n')

// Public endpoint - Submit contact form
console.log('1️⃣ Submit Contact Form (Public)')
console.log('POST /api/contact')
console.log('Content-Type: application/json\n')
console.log('Request Body:')
console.log(JSON.stringify({
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'Hello! I am interested in discussing a potential project collaboration.'
}, null, 2))
console.log('\nCurl Example:')
console.log(`curl -X POST ${BASE_URL}/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "Hello! I am interested in discussing a potential project collaboration."
  }'`)
console.log('\n' + '='.repeat(80) + '\n')

// Admin endpoint - Get all messages
console.log('2️⃣ Get All Contact Messages (Admin Only)')
console.log('GET /api/contact')
console.log('Authorization: Required (Clerk session)\n')
console.log('Query Parameters:')
console.log('- unread=true (optional) - Filter to unread messages only\n')
console.log('Curl Example:')
console.log(`curl -X GET ${BASE_URL}/api/contact \\
  -H "Content-Type: application/json" \\
  -H "Cookie: __session=YOUR_CLERK_SESSION_TOKEN"`)
console.log('\n' + '='.repeat(80) + '\n')

// Admin endpoint - Get specific message
console.log('3️⃣ Get Specific Contact Message (Admin Only)')
console.log('GET /api/contact/[id]')
console.log('Authorization: Required (Clerk session)\n')
console.log('Curl Example:')
console.log(`curl -X GET ${BASE_URL}/api/contact/1 \\
  -H "Content-Type: application/json" \\
  -H "Cookie: __session=YOUR_CLERK_SESSION_TOKEN"`)
console.log('\n' + '='.repeat(80) + '\n')

// Admin endpoint - Mark message as read
console.log('4️⃣ Mark Message as Read/Unread (Admin Only)')
console.log('PUT /api/contact/[id]')
console.log('Authorization: Required (Clerk session)\n')
console.log('Request Body:')
console.log(JSON.stringify({
  read: true
}, null, 2))
console.log('\nCurl Example:')
console.log(`curl -X PUT ${BASE_URL}/api/contact/1 \\
  -H "Content-Type: application/json" \\
  -H "Cookie: __session=YOUR_CLERK_SESSION_TOKEN" \\
  -d '{
    "read": true
  }'`)
console.log('\n' + '='.repeat(80) + '\n')

// Admin endpoint - Delete message
console.log('5️⃣ Delete Contact Message (Admin Only)')
console.log('DELETE /api/contact/[id]')
console.log('Authorization: Required (Clerk session)\n')
console.log('Curl Example:')
console.log(`curl -X DELETE ${BASE_URL}/api/contact/1 \\
  -H "Content-Type: application/json" \\
  -H "Cookie: __session=YOUR_CLERK_SESSION_TOKEN"`)
console.log('\n' + '='.repeat(80) + '\n')

console.log('📝 Response Format:')
console.log('All endpoints return JSON in this format:')
console.log(JSON.stringify({
  success: true,
  data: '/* Response data */',
  message: 'Operation completed successfully'
}, null, 2))
console.log('\nError Response:')
console.log(JSON.stringify({
  success: false,
  error: 'Error message',
  details: ['Validation error 1', 'Validation error 2']
}, null, 2))

console.log('\n🔐 Authentication Notes:')
console.log('- Public endpoints (POST /api/contact) do not require authentication')
console.log('- Admin endpoints require Clerk authentication')
console.log('- To get session token: Sign in at /admin/login and inspect cookies')
console.log('- Session tokens are HTTP-only cookies managed by Clerk')

console.log('\n✅ Validation Rules:')
console.log('Contact Form:')
console.log('- name: minimum 2 characters')
console.log('- email: valid email format, maximum 254 characters')
console.log('- message: minimum 10 characters')

console.log('\n🚀 Quick Test:')
console.log('1. Start development server: npm run dev')
console.log('2. Run automated tests: npx tsx scripts/test-contact-api.ts')
console.log('3. Test manually using the curl examples above')
console.log('4. Sign in at /admin/login to test admin endpoints')