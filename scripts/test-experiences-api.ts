#!/usr/bin/env tsx

/**
 * Test script for Experience CRUD API routes
 * Tests all endpoints: GET, POST, PUT, DELETE
 * 
 * Usage: npm run test-experiences-api
 */

import { db } from '../lib/db'
import { Experience, ExperienceFormData } from '../lib/types'

const API_BASE_URL = 'http://localhost:3000/api'

// Test data for creating experiences
const testExperiences: (ExperienceFormData & { companyLogo?: string })[] = [
  {
    company: 'Tech Innovations Inc',
    position: 'Senior Full Stack Developer',
    startDate: new Date('2022-01-15'),
    endDate: undefined, // Current position
    description: 'Leading development of modern web applications using React, Node.js, and PostgreSQL. Mentoring junior developers and architecting scalable solutions.',
    achievements: [
      'Increased application performance by 40% through optimization',
      'Led migration to microservices architecture',
      'Mentored 5 junior developers'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
    location: 'San Francisco, CA',
    employmentType: 'Full-time' as const,
    companyLogo: '/uploads/companies/tech-innovations-logo.png'
  },
  {
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    startDate: new Date('2020-06-01'),
    endDate: new Date('2021-12-31'),
    description: 'Developed responsive web applications and mobile-first interfaces. Collaborated with design team to implement pixel-perfect UI components.',
    achievements: [
      'Built component library used across 3 products',
      'Improved mobile performance by 60%',
      'Implemented automated testing pipeline'
    ],
    technologies: ['Vue.js', 'JavaScript', 'SCSS', 'Jest', 'Cypress'],
    location: 'Remote',
    employmentType: 'Full-time' as const
  },
  {
    company: 'Freelance',
    position: 'Web Developer',
    startDate: new Date('2019-01-01'),
    endDate: new Date('2020-05-31'),
    description: 'Provided web development services to small businesses and startups. Built custom websites and e-commerce solutions.',
    achievements: [
      'Delivered 15+ successful projects',
      'Maintained 98% client satisfaction rate',
      'Generated $50k+ in revenue'
    ],
    technologies: ['WordPress', 'PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    location: 'Various',
    employmentType: 'Freelance' as const
  }
]

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
  console.log('\n🔍 Testing GET /api/experiences...')
  
  try {
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences`)
    
    console.log(`Status: ${response.status}`)
    console.log(`Success: ${data.success}`)
    console.log(`Message: ${data.message}`)
    
    if (data.success && data.data) {
      console.log(`Found ${data.data.length} experiences`)
      
      // Verify chronological sorting
      if (data.data.length > 1) {
        const experiences = data.data as Experience[]
        let isSorted = true
        
        for (let i = 0; i < experiences.length - 1; i++) {
          const current = experiences[i]
          const next = experiences[i + 1]
          
          // Current positions (no end date) should come first
          if (!current.endDate && next.endDate) continue
          if (current.endDate && !next.endDate) {
            isSorted = false
            break
          }
          
          // Compare dates for sorting
          const currentDate = current.endDate || current.startDate
          const nextDate = next.endDate || next.startDate
          
          if (new Date(currentDate) < new Date(nextDate)) {
            isSorted = false
            break
          }
        }
        
        console.log(`Chronological sorting: ${isSorted ? '✅ Correct' : '❌ Incorrect'}`)
      }
      
      // Display first experience details
      if (data.data.length > 0) {
        const first = data.data[0] as Experience
        console.log(`First experience: ${first.position} at ${first.company}`)
        console.log(`Technologies: ${first.technologies.join(', ')}`)
        console.log(`Current position: ${!first.endDate ? 'Yes' : 'No'}`)
      }
    }
    
    return data.success
  } catch (error) {
    console.error('❌ GET experiences test failed:', error)
    return false
  }
}

async function testCreateExperience() {
  console.log('\n➕ Testing POST /api/experiences...')
  
  try {
    const testExperience = testExperiences[0]
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      body: JSON.stringify(testExperience),
    })
    
    console.log(`Status: ${response.status}`)
    console.log(`Success: ${data.success}`)
    console.log(`Message: ${data.message}`)
    
    if (data.success && data.data) {
      const experience = data.data as Experience
      console.log(`Created experience ID: ${experience.id}`)
      console.log(`Company: ${experience.company}`)
      console.log(`Position: ${experience.position}`)
      console.log(`Technologies: ${experience.technologies.join(', ')}`)
      console.log(`Current position: ${!experience.endDate ? 'Yes' : 'No'}`)
      
      return experience.id
    }
    
    if (!data.success && data.details) {
      console.log('Validation errors:', data.details)
    }
    
    return null
  } catch (error) {
    console.error('❌ POST experience test failed:', error)
    return null
  }
}

async function testUpdateExperience(experienceId: number) {
  console.log(`\n✏️ Testing PUT /api/experiences/${experienceId}...`)
  
  try {
    const updateData = {
      description: 'Updated description: Leading development of cutting-edge web applications with focus on performance and scalability.',
      achievements: [
        'Increased application performance by 50% through optimization',
        'Led migration to microservices architecture',
        'Mentored 8 junior developers',
        'Implemented CI/CD pipeline reducing deployment time by 70%'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Docker', 'Kubernetes']
    }
    
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
    
    console.log(`Status: ${response.status}`)
    console.log(`Success: ${data.success}`)
    console.log(`Message: ${data.message}`)
    
    if (data.success && data.data) {
      const experience = data.data as Experience
      console.log(`Updated experience: ${experience.position} at ${experience.company}`)
      console.log(`New technologies count: ${experience.technologies.length}`)
      console.log(`New achievements count: ${experience.achievements.length}`)
    }
    
    if (!data.success && data.details) {
      console.log('Validation errors:', data.details)
    }
    
    return data.success
  } catch (error) {
    console.error('❌ PUT experience test failed:', error)
    return false
  }
}

async function testDeleteExperience(experienceId: number) {
  console.log(`\n🗑️ Testing DELETE /api/experiences/${experienceId}...`)
  
  try {
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences/${experienceId}`, {
      method: 'DELETE',
    })
    
    console.log(`Status: ${response.status}`)
    console.log(`Success: ${data.success}`)
    console.log(`Message: ${data.message}`)
    
    return data.success
  } catch (error) {
    console.error('❌ DELETE experience test failed:', error)
    return false
  }
}

async function testValidationErrors() {
  console.log('\n🚫 Testing validation errors...')
  
  try {
    const invalidExperience = {
      company: 'A', // Too short
      position: '', // Empty
      startDate: new Date('2023-01-01'),
      endDate: new Date('2022-01-01'), // Before start date
      description: 'Short', // Too short
      achievements: [],
      technologies: [],
      location: '', // Empty
      employmentType: 'Invalid' // Invalid type
    }
    
    const { response, data } = await makeRequest(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      body: JSON.stringify(invalidExperience),
    })
    
    console.log(`Status: ${response.status}`)
    console.log(`Success: ${data.success}`)
    
    if (!data.success && data.details) {
      console.log(`Validation errors (${data.details.length}):`)
      data.details.forEach((error: string, index: number) => {
        console.log(`  ${index + 1}. ${error}`)
      })
      return true
    }
    
    return false
  } catch (error) {
    console.error('❌ Validation test failed:', error)
    return false
  }
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...')
  
  try {
    // Delete test experiences
    await db.query(`
      DELETE FROM experiences 
      WHERE company IN ('Tech Innovations Inc', 'StartupXYZ', 'Freelance')
    `)
    
    console.log('✅ Test data cleaned up')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  }
}

async function runTests() {
  console.log('🚀 Starting Experience API Tests...')
  console.log('=====================================')
  
  let createdExperienceId: number | null = null
  
  try {
    // Test GET (initial state)
    const getSuccess = await testGetExperiences()
    
    // Test POST (create)
    createdExperienceId = await testCreateExperience()
    
    // Test validation errors
    const validationSuccess = await testValidationErrors()
    
    if (createdExperienceId) {
      // Test PUT (update)
      const updateSuccess = await testUpdateExperience(createdExperienceId)
      
      // Test GET (after updates)
      await testGetExperiences()
      
      // Test DELETE
      const deleteSuccess = await testDeleteExperience(createdExperienceId)
      
      console.log('\n📊 Test Results Summary:')
      console.log('========================')
      console.log(`GET experiences: ${getSuccess ? '✅ PASS' : '❌ FAIL'}`)
      console.log(`POST experience: ${createdExperienceId ? '✅ PASS' : '❌ FAIL'}`)
      console.log(`PUT experience: ${updateSuccess ? '✅ PASS' : '❌ FAIL'}`)
      console.log(`DELETE experience: ${deleteSuccess ? '✅ PASS' : '❌ FAIL'}`)
      console.log(`Validation errors: ${validationSuccess ? '✅ PASS' : '❌ FAIL'}`)
      
      const allPassed = getSuccess && createdExperienceId && updateSuccess && deleteSuccess && validationSuccess
      console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
    } else {
      console.log('\n❌ Could not create test experience, skipping update/delete tests')
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
  } finally {
    // Clean up any remaining test data
    await cleanupTestData()
    
    // Close database connection
    process.exit(0)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests()
}

export { runTests }