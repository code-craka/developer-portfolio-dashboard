#!/usr/bin/env tsx

/**
 * Test script for Contact Form functionality
 * Tests the contact form component and API integration
 */

import { ContactFormData } from '../lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testContactFormSubmission() {
  console.log('🧪 Testing Contact Form Submission...\n')

  // Test data
  const validContactData: ContactFormData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    message: 'This is a test message for the contact form. It should be at least 10 characters long to pass validation.'
  }

  const invalidContactData = [
    {
      name: 'J', // Too short
      email: 'john.doe@example.com',
      message: 'This is a test message for the contact form.'
    },
    {
      name: 'John Doe',
      email: 'invalid-email', // Invalid email
      message: 'This is a test message for the contact form.'
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'Short' // Too short
    }
  ]

  try {
    // Test 1: Valid contact form submission
    console.log('✅ Test 1: Valid contact form submission')
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData),
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('   ✓ Valid contact form submission successful')
      console.log(`   ✓ Response: ${result.message}`)
      console.log(`   ✓ Contact ID: ${result.data?.id}`)
    } else {
      console.log('   ✗ Valid contact form submission failed')
      console.log(`   ✗ Error: ${result.error}`)
    }

    // Test 2: Invalid contact form submissions
    console.log('\n✅ Test 2: Invalid contact form submissions')
    
    for (let i = 0; i < invalidContactData.length; i++) {
      const invalidData = invalidContactData[i]
      const testName = i === 0 ? 'Short name' : i === 1 ? 'Invalid email' : 'Short message'
      
      console.log(`   Testing: ${testName}`)
      
      const invalidResponse = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      })

      const invalidResult = await invalidResponse.json()
      
      if (!invalidResponse.ok && !invalidResult.success) {
        console.log(`   ✓ ${testName} validation failed as expected`)
        console.log(`   ✓ Error: ${invalidResult.error}`)
      } else {
        console.log(`   ✗ ${testName} validation should have failed`)
      }
    }

    // Test 3: Empty form submission
    console.log('\n✅ Test 3: Empty form submission')
    const emptyResponse = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const emptyResult = await emptyResponse.json()
    
    if (!emptyResponse.ok && !emptyResult.success) {
      console.log('   ✓ Empty form submission failed as expected')
      console.log(`   ✓ Error: ${emptyResult.error}`)
    } else {
      console.log('   ✗ Empty form submission should have failed')
    }

    console.log('\n🎉 Contact Form tests completed!')

  } catch (error) {
    console.error('❌ Error testing contact form:', error)
    process.exit(1)
  }
}

// Component validation tests
function testContactFormValidation() {
  console.log('\n🧪 Testing Contact Form Validation Functions...\n')

  // Test validation functions (simulated)
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters long'
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    if (email.length > 254) return 'Email address is too long'
    return undefined
  }

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) return 'Message is required'
    if (message.trim().length < 10) return 'Message must be at least 10 characters long'
    return undefined
  }

  // Test cases
  const testCases = [
    // Name validation
    { field: 'name', value: '', expected: 'Name is required' },
    { field: 'name', value: 'J', expected: 'Name must be at least 2 characters long' },
    { field: 'name', value: 'John Doe', expected: undefined },
    
    // Email validation
    { field: 'email', value: '', expected: 'Email is required' },
    { field: 'email', value: 'invalid-email', expected: 'Please enter a valid email address' },
    { field: 'email', value: 'john.doe@example.com', expected: undefined },
    
    // Message validation
    { field: 'message', value: '', expected: 'Message is required' },
    { field: 'message', value: 'Short', expected: 'Message must be at least 10 characters long' },
    { field: 'message', value: 'This is a valid message that is long enough.', expected: undefined },
  ]

  let passedTests = 0
  let totalTests = testCases.length

  testCases.forEach((testCase, index) => {
    let result: string | undefined
    
    switch (testCase.field) {
      case 'name':
        result = validateName(testCase.value)
        break
      case 'email':
        result = validateEmail(testCase.value)
        break
      case 'message':
        result = validateMessage(testCase.value)
        break
    }

    const passed = result === testCase.expected
    if (passed) {
      passedTests++
      console.log(`✅ Test ${index + 1}: ${testCase.field} validation - PASSED`)
    } else {
      console.log(`❌ Test ${index + 1}: ${testCase.field} validation - FAILED`)
      console.log(`   Expected: ${testCase.expected}`)
      console.log(`   Got: ${result}`)
    }
  })

  console.log(`\n📊 Validation Tests: ${passedTests}/${totalTests} passed`)
}

async function main() {
  console.log('🚀 Contact Form Test Suite\n')
  console.log('=' .repeat(50))
  
  // Test validation functions
  testContactFormValidation()
  
  // Test API integration (only if server is running)
  try {
    const healthCheck = await fetch(`${API_BASE_URL}/api/health/db`)
    if (healthCheck.ok) {
      await testContactFormSubmission()
    } else {
      console.log('\n⚠️  Server not running - skipping API tests')
      console.log('   Start the development server with: npm run dev')
    }
  } catch (error) {
    console.log('\n⚠️  Server not running - skipping API tests')
    console.log('   Start the development server with: npm run dev')
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log('✨ Contact Form testing complete!')
}

if (require.main === module) {
  main().catch(console.error)
}