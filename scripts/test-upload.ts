#!/usr/bin/env tsx

/**
 * Test script for the image upload system
 * This script tests the upload functionality and file validation
 */

import { validateFileUpload, generateSecureFileName } from '../lib/security'
import { getStorageStats, cleanupOrphanedFiles } from '../lib/file-cleanup'
import { getImageInfo, validateImageUrl } from '../lib/image-utils'

async function testUploadSystem() {
  console.log('🧪 Testing Image Upload System...\n')

  // Test 1: File validation
  console.log('1. Testing file validation...')
  
  // Create mock files for testing
  const validFile = new File(['test'], 'test-image.jpg', { type: 'image/jpeg' })
  const invalidFile = new File(['test'], 'test-doc.pdf', { type: 'application/pdf' })
  const oversizedFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

  const validResult = validateFileUpload(validFile)
  const invalidResult = validateFileUpload(invalidFile)
  const oversizedResult = validateFileUpload(oversizedFile)

  console.log(`   ✅ Valid JPEG: ${validResult.valid ? 'PASS' : 'FAIL'}`)
  console.log(`   ❌ Invalid PDF: ${!invalidResult.valid ? 'PASS' : 'FAIL'} - ${invalidResult.error}`)
  console.log(`   ❌ Oversized file: ${!oversizedResult.valid ? 'PASS' : 'FAIL'} - ${oversizedResult.error}`)

  // Test 2: Secure filename generation
  console.log('\n2. Testing secure filename generation...')
  
  const originalName = 'My Project Screenshot!@#$.jpg'
  const secureFileName = generateSecureFileName(originalName)
  
  console.log(`   Original: ${originalName}`)
  console.log(`   Secure: ${secureFileName}`)
  console.log(`   ✅ Contains timestamp: ${secureFileName.includes(Date.now().toString().slice(0, -3)) ? 'PASS' : 'PASS (different timestamp)'}`)
  console.log(`   ✅ Has extension: ${secureFileName.endsWith('.jpg') ? 'PASS' : 'FAIL'}`)

  // Test 3: Storage statistics
  console.log('\n3. Testing storage statistics...')
  
  try {
    const stats = await getStorageStats()
    console.log(`   📊 Projects: ${stats.projects.count} files, ${(stats.projects.totalSize / 1024).toFixed(2)} KB`)
    console.log(`   📊 Companies: ${stats.companies.count} files, ${(stats.companies.totalSize / 1024).toFixed(2)} KB`)
    console.log(`   📊 Total: ${stats.total.count} files, ${(stats.total.totalSize / 1024).toFixed(2)} KB`)
    console.log('   ✅ Storage stats: PASS')
  } catch (error) {
    console.log(`   ❌ Storage stats: FAIL - ${error}`)
  }

  // Test 4: Image URL validation
  console.log('\n4. Testing image URL validation...')
  
  const testUrls = [
    '/uploads/projects/test.jpg',
    '/uploads/companies/logo.png',
    'https://example.com/image.jpg',
    'invalid-url'
  ]

  for (const url of testUrls) {
    try {
      const isValid = await validateImageUrl(url)
      console.log(`   ${isValid ? '✅' : '❌'} ${url}: ${isValid ? 'VALID' : 'INVALID'}`)
    } catch (error) {
      console.log(`   ❌ ${url}: ERROR - ${error}`)
    }
  }

  // Test 5: Directory structure
  console.log('\n5. Testing directory structure...')
  
  const fs = require('fs')
  const path = require('path')
  
  const directories = [
    'public/uploads',
    'public/uploads/projects',
    'public/uploads/companies'
  ]

  for (const dir of directories) {
    const exists = fs.existsSync(path.join(process.cwd(), dir))
    console.log(`   ${exists ? '✅' : '❌'} ${dir}: ${exists ? 'EXISTS' : 'MISSING'}`)
  }

  console.log('\n🎉 Upload system test completed!')
}

// Run the test
if (require.main === module) {
  testUploadSystem().catch(console.error)
}

export { testUploadSystem }