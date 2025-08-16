#!/usr/bin/env tsx

/**
 * HTTP Test script for Project CRUD API routes
 * This script tests the actual HTTP endpoints
 */

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const BASE_URL = 'http://localhost:3000'

async function makeRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()
    return {
      status: response.status,
      ok: response.ok,
      data
    }
  } catch (error) {
    console.error(`Request failed for ${url}:`, error)
    return {
      status: 0,
      ok: false,
      data: { error: 'Network error' }
    }
  }
}

async function testProjectsHTTPAPI() {
  console.log('🌐 Testing Project CRUD HTTP API Routes...\n')
  console.log(`Base URL: ${BASE_URL}`)
  console.log('Note: This test requires the development server to be running (npm run dev)\n')

  try {
    // Test 1: GET /api/projects (should work without authentication)
    console.log('1. Testing GET /api/projects...')
    const getResponse = await makeRequest(`${BASE_URL}/api/projects`)
    
    console.log(`   Status: ${getResponse.status}`)
    console.log(`   Success: ${getResponse.ok}`)
    
    if (getResponse.ok) {
      console.log(`   ✅ GET projects: PASS`)
      console.log(`   ✅ Response structure: ${getResponse.data.success ? 'Valid' : 'Invalid'}`)
      console.log(`   ✅ Projects count: ${getResponse.data.data?.length || 0}`)
    } else {
      console.log(`   ❌ GET projects: FAIL - ${getResponse.data.error}`)
    }

    // Test 2: GET /api/projects?featured=true
    console.log('\n2. Testing GET /api/projects?featured=true...')
    const getFeaturedResponse = await makeRequest(`${BASE_URL}/api/projects?featured=true`)
    
    console.log(`   Status: ${getFeaturedResponse.status}`)
    console.log(`   Success: ${getFeaturedResponse.ok}`)
    
    if (getFeaturedResponse.ok) {
      console.log(`   ✅ GET featured projects: PASS`)
      console.log(`   ✅ Featured projects count: ${getFeaturedResponse.data.data?.length || 0}`)
    } else {
      console.log(`   ❌ GET featured projects: FAIL - ${getFeaturedResponse.data.error}`)
    }

    // Test 3: POST /api/projects (should require authentication)
    console.log('\n3. Testing POST /api/projects (without auth)...')
    const postData = {
      title: 'Test HTTP Project',
      description: 'This is a test project created via HTTP API',
      techStack: ['React', 'TypeScript', 'Next.js'],
      githubUrl: 'https://github.com/test/http-project',
      demoUrl: 'https://test-http-project.demo.com',
      imageUrl: '/uploads/projects/test-http.jpg',
      featured: false
    }

    const postResponse = await makeRequest(`${BASE_URL}/api/projects`, {
      method: 'POST',
      body: JSON.stringify(postData)
    })

    console.log(`   Status: ${postResponse.status}`)
    console.log(`   Success: ${postResponse.ok}`)
    
    if (postResponse.status === 401 || postResponse.status === 403) {
      console.log(`   ✅ POST without auth: PASS (correctly rejected)`)
      console.log(`   ✅ Auth protection working: ${postResponse.data.error}`)
    } else if (postResponse.ok) {
      console.log(`   ⚠️  POST without auth: UNEXPECTED SUCCESS (auth may not be working)`)
    } else {
      console.log(`   ❌ POST without auth: UNEXPECTED ERROR - ${postResponse.data.error}`)
    }

    // Test 4: PUT /api/projects/1 (should require authentication)
    console.log('\n4. Testing PUT /api/projects/1 (without auth)...')
    const putData = {
      title: 'Updated HTTP Project',
      description: 'This project has been updated via HTTP API'
    }

    const putResponse = await makeRequest(`${BASE_URL}/api/projects/1`, {
      method: 'PUT',
      body: JSON.stringify(putData)
    })

    console.log(`   Status: ${putResponse.status}`)
    console.log(`   Success: ${putResponse.ok}`)
    
    if (putResponse.status === 401 || putResponse.status === 403) {
      console.log(`   ✅ PUT without auth: PASS (correctly rejected)`)
      console.log(`   ✅ Auth protection working: ${putResponse.data.error}`)
    } else if (putResponse.ok) {
      console.log(`   ⚠️  PUT without auth: UNEXPECTED SUCCESS (auth may not be working)`)
    } else {
      console.log(`   ❌ PUT without auth: UNEXPECTED ERROR - ${putResponse.data.error}`)
    }

    // Test 5: DELETE /api/projects/1 (should require authentication)
    console.log('\n5. Testing DELETE /api/projects/1 (without auth)...')
    const deleteResponse = await makeRequest(`${BASE_URL}/api/projects/1`, {
      method: 'DELETE'
    })

    console.log(`   Status: ${deleteResponse.status}`)
    console.log(`   Success: ${deleteResponse.ok}`)
    
    if (deleteResponse.status === 401 || deleteResponse.status === 403) {
      console.log(`   ✅ DELETE without auth: PASS (correctly rejected)`)
      console.log(`   ✅ Auth protection working: ${deleteResponse.data.error}`)
    } else if (deleteResponse.ok) {
      console.log(`   ⚠️  DELETE without auth: UNEXPECTED SUCCESS (auth may not be working)`)
    } else {
      console.log(`   ❌ DELETE without auth: UNEXPECTED ERROR - ${deleteResponse.data.error}`)
    }

    // Test 6: Test invalid project ID
    console.log('\n6. Testing invalid project ID...')
    const invalidIdResponse = await makeRequest(`${BASE_URL}/api/projects/invalid`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Test' })
    })

    console.log(`   Status: ${invalidIdResponse.status}`)
    if (invalidIdResponse.status === 400) {
      console.log(`   ✅ Invalid ID handling: PASS`)
    } else {
      console.log(`   ❌ Invalid ID handling: FAIL`)
    }

    // Test 7: Test API response headers
    console.log('\n7. Testing security headers...')
    const headersResponse = await fetch(`${BASE_URL}/api/projects`)
    const headers = headersResponse.headers

    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ]

    let headersPassed = 0
    securityHeaders.forEach(header => {
      if (headers.get(header)) {
        console.log(`   ✅ ${header}: ${headers.get(header)}`)
        headersPassed++
      } else {
        console.log(`   ❌ ${header}: Missing`)
      }
    })

    console.log(`   Security headers: ${headersPassed}/${securityHeaders.length} present`)

    console.log('\n🎉 HTTP API tests completed!')
    console.log('\n📝 Summary:')
    console.log('   ✅ Public endpoints (GET) should work without authentication')
    console.log('   ✅ Protected endpoints (POST, PUT, DELETE) should require authentication')
    console.log('   ✅ Security headers should be present')
    console.log('   ✅ Error handling should work for invalid inputs')

  } catch (error) {
    console.error('\n❌ HTTP API test failed:', error)
    process.exit(1)
  }
}

// Run the test
if (require.main === module) {
  testProjectsHTTPAPI().catch(console.error)
}

export { testProjectsHTTPAPI }