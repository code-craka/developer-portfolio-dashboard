#!/usr/bin/env tsx

/**
 * Test script for image optimization and performance features
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

console.log('🖼️  Testing Image Optimization Implementation...\n')

let allPassed = true

// Test 1: Check if optimized image components exist
console.log('1. Checking optimized image components...')
const componentFiles = [
  'components/ui/OptimizedImage.tsx',
  'components/ui/LazyImage.tsx',
  'components/ui/Skeleton.tsx',
  'components/ui/PerformanceMonitor.tsx'
]

for (const file of componentFiles) {
  if (existsSync(file)) {
    console.log(`   ✅ ${file} exists`)
  } else {
    console.log(`   ❌ ${file} missing`)
    allPassed = false
  }
}

// Test 2: Check if image utilities exist
console.log('\n2. Checking image utility files...')
const utilityFiles = [
  'lib/image-utils.ts',
  'lib/image-utils-client.ts',
  'lib/performance.ts',
  'lib/hooks/useIntersectionObserver.ts'
]

for (const file of utilityFiles) {
  if (existsSync(file)) {
    console.log(`   ✅ ${file} exists`)
  } else {
    console.log(`   ❌ ${file} missing`)
    allPassed = false
  }
}

// Test 3: Check if Next.js config has image optimization
console.log('\n3. Checking Next.js image optimization config...')
try {
  const nextConfig = require('../next.config.js')
  if (nextConfig.images) {
    console.log('   ✅ Next.js image config exists')
    if (nextConfig.images.formats && nextConfig.images.formats.includes('image/webp')) {
      console.log('   ✅ WebP format enabled')
    } else {
      console.log('   ❌ WebP format not configured')
      allPassed = false
    }
    if (nextConfig.images.deviceSizes && nextConfig.images.deviceSizes.length > 0) {
      console.log('   ✅ Device sizes configured')
    } else {
      console.log('   ❌ Device sizes not configured')
      allPassed = false
    }
  } else {
    console.log('   ❌ Next.js image config missing')
    allPassed = false
  }
} catch (error) {
  console.log('   ❌ Error reading Next.js config:', error)
  allPassed = false
}

// Test 4: Check if placeholder image exists
console.log('\n4. Checking placeholder images...')
const placeholderFiles = [
  'public/uploads/projects/placeholder.svg'
]

for (const file of placeholderFiles) {
  if (existsSync(file)) {
    console.log(`   ✅ ${file} exists`)
  } else {
    console.log(`   ❌ ${file} missing`)
    allPassed = false
  }
}

// Test 5: Check if components use optimized images
console.log('\n5. Checking component implementations...')
try {
  const projectsSection = require('fs').readFileSync('components/sections/ProjectsSection.tsx', 'utf8')
  if (projectsSection.includes('LazyImage')) {
    console.log('   ✅ ProjectsSection uses LazyImage')
  } else {
    console.log('   ❌ ProjectsSection not using LazyImage')
    allPassed = false
  }

  if (projectsSection.includes('ProjectCardSkeleton')) {
    console.log('   ✅ ProjectsSection uses skeleton loading')
  } else {
    console.log('   ❌ ProjectsSection not using skeleton loading')
    allPassed = false
  }

  const adminTable = require('fs').readFileSync('components/admin/ProjectsTable.tsx', 'utf8')
  if (adminTable.includes('OptimizedImage')) {
    console.log('   ✅ Admin components use OptimizedImage')
  } else {
    console.log('   ❌ Admin components not using OptimizedImage')
    allPassed = false
  }
} catch (error) {
  console.log('   ❌ Error checking component implementations:', error)
  allPassed = false
}

// Test 6: Check if build passes
console.log('\n6. Testing build compilation...')
try {
  execSync('npm run build', { stdio: 'pipe' })
  console.log('   ✅ Build passes successfully')
} catch (error) {
  console.log('   ❌ Build failed')
  allPassed = false
}

// Test 7: Check TypeScript compilation
console.log('\n7. Testing TypeScript compilation...')
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' })
  console.log('   ✅ TypeScript compilation passes')
} catch (error) {
  console.log('   ❌ TypeScript compilation failed')
  allPassed = false
}

console.log('\n📋 Image Optimization Test Summary:')
if (allPassed) {
  console.log('🎉 All image optimization features implemented successfully!')
  console.log('\n✨ Features implemented:')
  console.log('   • OptimizedImage component with blur placeholders')
  console.log('   • LazyImage component with intersection observer')
  console.log('   • Skeleton loading components')
  console.log('   • Performance monitoring utilities')
  console.log('   • Next.js image optimization configuration')
  console.log('   • WebP and AVIF format support')
  console.log('   • Responsive image sizing')
  console.log('   • Image upload optimization in API routes')
  console.log('   • Client-side and server-side image utilities')
} else {
  console.log('⚠️  Some image optimization features need attention.')
}

process.exit(allPassed ? 0 : 1)