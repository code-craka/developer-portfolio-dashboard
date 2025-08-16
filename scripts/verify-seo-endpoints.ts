#!/usr/bin/env tsx

/**
 * SEO Endpoints Verification Script
 * 
 * This script verifies that all SEO-related endpoints are working correctly
 */

import { execSync } from 'child_process'

console.log('🔍 Verifying SEO Endpoints...\n')

// Start the development server in the background
console.log('🚀 Starting development server...')
const serverProcess = execSync('npm run dev &', { stdio: 'pipe' })

// Wait for server to start
setTimeout(async () => {

const baseUrl = 'http://localhost:3000'

async function testEndpoint(path: string, expectedContent: string[]) {
  try {
    console.log(`Testing ${path}...`)
    const response = await fetch(`${baseUrl}${path}`)
    
    if (!response.ok) {
      console.log(`❌ ${path}: HTTP ${response.status}`)
      return false
    }
    
    const content = await response.text()
    
    for (const expected of expectedContent) {
      if (!content.includes(expected)) {
        console.log(`❌ ${path}: Missing "${expected}"`)
        return false
      }
    }
    
    console.log(`✅ ${path}: All checks passed`)
    return true
  } catch (error) {
    console.log(`❌ ${path}: Error - ${error}`)
    return false
  }
}

// Test endpoints
const tests = [
  {
    path: '/sitemap.xml',
    expected: ['<?xml version="1.0"', 'urlset', 'loc']
  },
  {
    path: '/robots.txt',
    expected: ['User-agent:', 'Disallow:', 'Sitemap:']
  },
  {
    path: '/manifest.webmanifest',
    expected: ['name', 'short_name', 'theme_color', 'background_color']
  }
]

let allPassed = true

for (const test of tests) {
  const passed = await testEndpoint(test.path, test.expected)
  if (!passed) {
    allPassed = false
  }
}

// Test home page for meta tags
console.log('Testing home page meta tags...')
try {
  const response = await fetch(baseUrl)
  const html = await response.text()
  
  const metaChecks = [
    'og:title',
    'og:description',
    'og:image',
    'twitter:card',
    'application/ld+json',
    'Person',
    'WebSite'
  ]
  
  for (const check of metaChecks) {
    if (html.includes(check)) {
      console.log(`✅ Home page: Found ${check}`)
    } else {
      console.log(`❌ Home page: Missing ${check}`)
      allPassed = false
    }
  }
} catch (error) {
  console.log(`❌ Home page: Error - ${error}`)
  allPassed = false
}

console.log('\n📋 SEO Endpoints Verification Summary:')
if (allPassed) {
  console.log('🎉 All SEO endpoints are working correctly!')
} else {
  console.log('⚠️  Some SEO endpoints need attention.')
}

// Kill the development server
try {
  execSync('pkill -f "next dev"')
} catch (error) {
  // Server might not be running
}

process.exit(allPassed ? 0 : 1)
}, 5000)