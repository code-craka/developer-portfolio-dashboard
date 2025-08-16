#!/usr/bin/env tsx

/**
 * HTTP Test script for Experience API routes
 * Tests API structure and responses without authentication
 * 
 * Usage: npm run test-experiences-http
 */

const API_BASE_URL = 'http://localhost:3000/api'

async function makeRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    return { response, data }
  } catch (error) {
    console.error(`Request failed for ${url}:`, error)
    throw error
  }
}

async function testGetExperiences() {
  console.log('🔍 Testing GET /api/experiences (public endpoint)...')
  
  try {
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences`)
    
    console.log(`  Status: ${response.status}`)
    console.log(`  Success: ${data.success}`)
    console.log(`  Message: ${data.message}`)
    console.log(`  Data type: ${Array.isArray(data.data) ? 'Array' : typeof data.data}`)
    console.log(`  Count: ${data.data?.length || 0}`)
    
    return response.status === 200 && data.success
  } catch (error) {
    console.error('  ❌ GET experiences test failed:', error)
    return false
  }
}

async function testPostExperience() {
  console.log('\n➕ Testing POST /api/experiences (admin only)...')
  
  try {
    const testExperience = {
      company: 'Test Company',
      position: 'Test Position',
      startDate: '2023-01-01',
      description: 'Test description for the experience',
      achievements: ['Test achievement'],
      technologies: ['JavaScript', 'TypeScript'],
      location: 'Test Location',
      employmentType: 'Full-time'
    }
    
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      body: JSON.stringify(testExperience),
    })
    
    console.log(`  Status: ${response.status}`)
    console.log(`  Success: ${data.success}`)
    console.log(`  Error: ${data.error}`)
    
    // Should return 401 (authentication required)
    return response.status === 401 && !data.success && data.error.includes('Authentication')
  } catch (error) {
    console.error('  ❌ POST experience test failed:', error)
    return false
  }
}

async function testPutExperience() {
  console.log('\n✏️ Testing PUT /api/experiences/1 (admin only)...')
  
  try {
    const updateData = {
      company: 'Updated Company',
      description: 'Updated description'
    }
    
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences/1`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
    
    console.log(`  Status: ${response.status}`)
    console.log(`  Success: ${data.success}`)
    console.log(`  Error: ${data.error}`)
    
    // Should return 401 (authentication required)
    return response.status === 401 && !data.success && data.error.includes('Authentication')
  } catch (error) {
    console.error('  ❌ PUT experience test failed:', error)
    return false
  }
}

async function testDeleteExperience() {
  console.log('\n🗑️ Testing DELETE /api/experiences/1 (admin only)...')
  
  try {
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences/1`, {
      method: 'DELETE',
    })
    
    console.log(`  Status: ${response.status}`)
    console.log(`  Success: ${data.success}`)
    console.log(`  Error: ${data.error}`)
    
    // Should return 401 (authentication required)
    return response.status === 401 && !data.success && data.error.includes('Authentication')
  } catch (error) {
    console.error('  ❌ DELETE experience test failed:', error)
    return false
  }
}

async function testInvalidId() {
  console.log('\n🚫 Testing invalid ID handling...')
  
  try {
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences/invalid`, {
      method: 'PUT',
      body: JSON.stringify({ company: 'Test' }),
    })
    
    console.log(`  Status: ${response.status}`)
    console.log(`  Success: ${data.success}`)
    console.log(`  Error: ${data.error}`)
    
    // Should return 401 (authentication required) - auth check happens first
    return response.status === 401 && !data.success
  } catch (error) {
    console.error('  ❌ Invalid ID test failed:', error)
    return false
  }
}

async function runHttpTests() {
  console.log('🚀 Starting Experience API HTTP Tests...')
  console.log('==========================================')
  
  try {
    const getSuccess = await testGetExperiences()
    const postSuccess = await testPostExperience()
    const putSuccess = await testPutExperience()
    const deleteSuccess = await testDeleteExperience()
    const invalidIdSuccess = await testInvalidId()
    
    console.log('\n📊 HTTP Test Results Summary:')
    console.log('==============================')
    console.log(`GET /api/experiences: ${getSuccess ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`POST /api/experiences: ${postSuccess ? '✅ PASS (Auth Required)' : '❌ FAIL'}`)
    console.log(`PUT /api/experiences/[id]: ${putSuccess ? '✅ PASS (Auth Required)' : '❌ FAIL'}`)
    console.log(`DELETE /api/experiences/[id]: ${deleteSuccess ? '✅ PASS (Auth Required)' : '❌ FAIL'}`)
    console.log(`Invalid ID handling: ${invalidIdSuccess ? '✅ PASS' : '❌ FAIL'}`)
    
    const allPassed = getSuccess && postSuccess && putSuccess && deleteSuccess && invalidIdSuccess
    console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL HTTP TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
    
    if (allPassed) {
      console.log('\n✨ Experience API is working correctly!')
      console.log('   - Public GET endpoint returns proper data structure')
      console.log('   - Admin endpoints properly require authentication')
      console.log('   - Error handling is working as expected')
    }
    
  } catch (error) {
    console.error('❌ HTTP test suite failed:', error)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runHttpTests()
}

export { runHttpTests }