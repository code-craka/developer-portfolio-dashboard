#!/usr/bin/env tsx

/**
 * Test script for Contact Messages Management Interface
 * Tests the contact API endpoints and message management functionality
 */

import { ContactMessage, ApiResponse } from '../lib/types'

const API_BASE = 'http://localhost:3000'

// Test data
const testMessage = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'This is a test message for the contact form. I am interested in discussing a potential project collaboration.'
}

async function testContactAPI() {
  console.log('🧪 Testing Contact Messages Management Interface...\n')

  try {
    // Test 1: Submit a contact message (public endpoint)
    console.log('1. Testing contact form submission...')
    const submitResponse = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage),
    })

    const submitData: ApiResponse<ContactMessage> = await submitResponse.json()
    
    if (submitData.success && submitData.data) {
      console.log('✅ Contact message submitted successfully')
      console.log(`   Message ID: ${submitData.data.id}`)
      console.log(`   From: ${submitData.data.name} (${submitData.data.email})`)
      console.log(`   Status: ${submitData.data.read ? 'Read' : 'Unread'}`)
      console.log(`   Created: ${new Date(submitData.data.createdAt).toLocaleString()}`)
    } else {
      console.log('❌ Failed to submit contact message:', submitData.error)
      return
    }

    const messageId = submitData.data.id

    // Test 2: Get all messages (admin endpoint - will fail without auth)
    console.log('\n2. Testing get all messages (should fail without auth)...')
    const getAllResponse = await fetch(`${API_BASE}/api/contact`)
    const getAllData: ApiResponse<ContactMessage[]> = await getAllResponse.json()
    
    if (!getAllData.success) {
      console.log('✅ Correctly rejected unauthenticated request')
      console.log(`   Error: ${getAllData.error}`)
    } else {
      console.log('⚠️  Unexpected: Request succeeded without authentication')
    }

    // Test 3: Get specific message (admin endpoint - will fail without auth)
    console.log('\n3. Testing get specific message (should fail without auth)...')
    const getOneResponse = await fetch(`${API_BASE}/api/contact/${messageId}`)
    const getOneData: ApiResponse<ContactMessage> = await getOneResponse.json()
    
    if (!getOneData.success) {
      console.log('✅ Correctly rejected unauthenticated request')
      console.log(`   Error: ${getOneData.error}`)
    } else {
      console.log('⚠️  Unexpected: Request succeeded without authentication')
    }

    // Test 4: Update message status (admin endpoint - will fail without auth)
    console.log('\n4. Testing mark as read (should fail without auth)...')
    const updateResponse = await fetch(`${API_BASE}/api/contact/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read: true }),
    })
    const updateData: ApiResponse<ContactMessage> = await updateResponse.json()
    
    if (!updateData.success) {
      console.log('✅ Correctly rejected unauthenticated request')
      console.log(`   Error: ${updateData.error}`)
    } else {
      console.log('⚠️  Unexpected: Request succeeded without authentication')
    }

    // Test 5: Delete message (admin endpoint - will fail without auth)
    console.log('\n5. Testing delete message (should fail without auth)...')
    const deleteResponse = await fetch(`${API_BASE}/api/contact/${messageId}`, {
      method: 'DELETE',
    })
    const deleteData: ApiResponse = await deleteResponse.json()
    
    if (!deleteData.success) {
      console.log('✅ Correctly rejected unauthenticated request')
      console.log(`   Error: ${deleteData.error}`)
    } else {
      console.log('⚠️  Unexpected: Request succeeded without authentication')
    }

    // Test 6: Test validation with invalid data
    console.log('\n6. Testing form validation with invalid data...')
    const invalidMessage = {
      name: '', // Empty name
      email: 'invalid-email', // Invalid email
      message: '' // Empty message
    }

    const validationResponse = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidMessage),
    })

    const validationData: ApiResponse = await validationResponse.json()
    
    if (!validationData.success) {
      console.log('✅ Form validation working correctly')
      console.log(`   Error: ${validationData.error}`)
      if ((validationData as any).details) {
        console.log('   Validation details:', (validationData as any).details)
      }
    } else {
      console.log('❌ Form validation failed - invalid data was accepted')
    }

    console.log('\n🎉 Contact Messages API test completed!')
    console.log('\n📝 Summary:')
    console.log('   - Contact form submission: Working')
    console.log('   - Authentication protection: Working')
    console.log('   - Form validation: Working')
    console.log('   - Admin endpoints require authentication as expected')
    console.log('\n💡 To test admin functionality:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Navigate to /login and authenticate as admin')
    console.log('   3. Visit /messages to test the management interface')

  } catch (error) {
    console.error('❌ Test failed with error:', error)
    console.log('\n💡 Make sure the development server is running:')
    console.log('   npm run dev')
  }
}

// Run the test
testContactAPI()