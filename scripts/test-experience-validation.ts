#!/usr/bin/env tsx

/**
 * Test script for Experience Validation
 * Tests the experience validation logic without database
 */

import { validateExperienceData } from '../lib/security'
import { ExperienceFormData } from '../lib/types'

function testExperienceValidation() {
  console.log('🧪 Testing Experience Validation Logic...\n')

  // Test 1: Valid experience
  console.log('1. Testing valid experience...')
  const validExperience: ExperienceFormData = {
    company: 'Tech Corp Inc.',
    position: 'Senior Software Engineer',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2023-12-31'),
    description: 'Led development of scalable web applications using modern technologies and best practices.',
    achievements: [
      'Improved application performance by 40%',
      'Led a team of 5 developers',
      'Implemented CI/CD pipeline reducing deployment time by 60%'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    location: 'San Francisco, CA',
    employmentType: 'Full-time'
  }

  const validation = validateExperienceData(validExperience)
  if (validation.valid) {
    console.log('✅ Valid experience passed validation')
  } else {
    console.log('❌ Valid experience failed validation:', validation.errors)
  }

  // Test 2: Current position (no end date)
  console.log('\n2. Testing current position (no end date)...')
  const currentPosition: ExperienceFormData = {
    ...validExperience,
    endDate: undefined
  }

  const currentValidation = validateExperienceData(currentPosition)
  if (currentValidation.valid) {
    console.log('✅ Current position passed validation')
  } else {
    console.log('❌ Current position failed validation:', currentValidation.errors)
  }

  // Test 3: Invalid experiences
  console.log('\n3. Testing invalid experiences...')
  
  const invalidCases = [
    {
      name: 'Empty company name',
      data: { ...validExperience, company: '' },
      expectedError: 'Company name must be at least 2 characters long'
    },
    {
      name: 'Short company name',
      data: { ...validExperience, company: 'A' },
      expectedError: 'Company name must be at least 2 characters long'
    },
    {
      name: 'Empty position',
      data: { ...validExperience, position: '' },
      expectedError: 'Position title must be at least 2 characters long'
    },
    {
      name: 'Short position',
      data: { ...validExperience, position: 'X' },
      expectedError: 'Position title must be at least 2 characters long'
    },
    {
      name: 'Missing start date',
      data: { ...validExperience, startDate: undefined as any },
      expectedError: 'Start date is required'
    },
    {
      name: 'End date before start date',
      data: { 
        ...validExperience, 
        startDate: new Date('2023-01-01'),
        endDate: new Date('2022-01-01')
      },
      expectedError: 'End date cannot be before start date'
    },
    {
      name: 'Short description',
      data: { ...validExperience, description: 'Short' },
      expectedError: 'Description must be at least 10 characters long'
    },
    {
      name: 'Empty description',
      data: { ...validExperience, description: '' },
      expectedError: 'Description must be at least 10 characters long'
    },
    {
      name: 'Empty location',
      data: { ...validExperience, location: '' },
      expectedError: 'Location is required'
    },
    {
      name: 'Short location',
      data: { ...validExperience, location: 'X' },
      expectedError: 'Location is required'
    },
    {
      name: 'Missing employment type',
      data: { ...validExperience, employmentType: undefined as any },
      expectedError: 'Employment type is required'
    }
  ]

  let passedTests = 0
  for (const testCase of invalidCases) {
    const result = validateExperienceData(testCase.data)
    if (!result.valid && result.errors.some(error => error.includes(testCase.expectedError.split(' ')[0]))) {
      console.log(`   ✅ ${testCase.name}`)
      passedTests++
    } else {
      console.log(`   ❌ ${testCase.name}`)
      console.log(`      Expected error containing: ${testCase.expectedError}`)
      console.log(`      Got errors: ${result.errors.join(', ')}`)
    }
  }

  // Test 4: Employment type validation
  console.log('\n4. Testing employment types...')
  const validEmploymentTypes: Array<'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship'> = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'
  ]

  let employmentTypeTests = 0
  for (const type of validEmploymentTypes) {
    const testData: ExperienceFormData = {
      ...validExperience,
      employmentType: type
    }
    
    const result = validateExperienceData(testData)
    if (result.valid) {
      employmentTypeTests++
    } else {
      console.log(`   ❌ ${type} failed validation:`, result.errors)
    }
  }

  if (employmentTypeTests === validEmploymentTypes.length) {
    console.log(`   ✅ All ${validEmploymentTypes.length} employment types passed validation`)
  } else {
    console.log(`   ❌ Only ${employmentTypeTests}/${validEmploymentTypes.length} employment types passed`)
  }

  // Test 5: Date edge cases
  console.log('\n5. Testing date edge cases...')
  
  const dateTests = [
    {
      name: 'Same start and end date',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-01'),
      shouldPass: true
    },
    {
      name: 'Start date in future',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      shouldPass: true // Validation doesn't check future dates
    },
    {
      name: 'Very old start date',
      startDate: new Date('1990-01-01'),
      endDate: new Date('1995-12-31'),
      shouldPass: true
    }
  ]

  let dateTestsPassed = 0
  for (const test of dateTests) {
    const testData: ExperienceFormData = {
      ...validExperience,
      startDate: test.startDate,
      endDate: test.endDate
    }
    
    const result = validateExperienceData(testData)
    if (result.valid === test.shouldPass) {
      console.log(`   ✅ ${test.name}`)
      dateTestsPassed++
    } else {
      console.log(`   ❌ ${test.name}`)
      console.log(`      Expected: ${test.shouldPass ? 'valid' : 'invalid'}`)
      console.log(`      Got: ${result.valid ? 'valid' : 'invalid'}`)
      if (!result.valid) {
        console.log(`      Errors: ${result.errors.join(', ')}`)
      }
    }
  }

  // Summary
  console.log('\n🎉 Experience Validation Tests Completed!')
  console.log('\n📋 Summary:')
  console.log(`   ✅ Valid experience: ${validation.valid ? 'PASS' : 'FAIL'}`)
  console.log(`   ✅ Current position: ${currentValidation.valid ? 'PASS' : 'FAIL'}`)
  console.log(`   ✅ Invalid cases: ${passedTests}/${invalidCases.length} PASS`)
  console.log(`   ✅ Employment types: ${employmentTypeTests}/${validEmploymentTypes.length} PASS`)
  console.log(`   ✅ Date edge cases: ${dateTestsPassed}/${dateTests.length} PASS`)

  const totalTests = 2 + invalidCases.length + validEmploymentTypes.length + dateTests.length
  const totalPassed = (validation.valid ? 1 : 0) + 
                     (currentValidation.valid ? 1 : 0) + 
                     passedTests + 
                     employmentTypeTests + 
                     dateTestsPassed

  console.log(`\n🏆 Overall: ${totalPassed}/${totalTests} tests passed`)
  
  if (totalPassed === totalTests) {
    console.log('\n🚀 All validation tests passed! Experience validation is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Please review the validation logic.')
  }
}

// Run tests
testExperienceValidation()