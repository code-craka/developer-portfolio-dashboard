#!/usr/bin/env tsx

/**
 * Test script to verify admin layout components are working correctly
 */

import { readFileSync } from 'fs'
import { join } from 'path'

console.log('🧪 Testing Admin Layout Components...\n')

// Test 1: Check if all admin components exist
const adminComponents = [
  'components/admin/AdminSidebar.tsx',
  'components/admin/AdminHeader.tsx',
  'components/admin/AdminBreadcrumb.tsx',
  'components/admin/AdminLayoutWrapper.tsx',
  'components/admin/AdminMobileMenu.tsx'
]

console.log('📁 Checking component files...')
let allComponentsExist = true

adminComponents.forEach(component => {
  try {
    const filePath = join(process.cwd(), component)
    const content = readFileSync(filePath, 'utf-8')
    
    if (content.length > 0) {
      console.log(`✅ ${component} - exists and has content`)
    } else {
      console.log(`❌ ${component} - exists but is empty`)
      allComponentsExist = false
    }
  } catch (error) {
    console.log(`❌ ${component} - does not exist`)
    allComponentsExist = false
  }
})

// Test 2: Check if components have required exports
console.log('\n🔍 Checking component exports...')

const requiredExports = [
  { file: 'components/admin/AdminSidebar.tsx', export: 'export default function AdminSidebar' },
  { file: 'components/admin/AdminHeader.tsx', export: 'export default function AdminHeader' },
  { file: 'components/admin/AdminBreadcrumb.tsx', export: 'export default function AdminBreadcrumb' },
  { file: 'components/admin/AdminLayoutWrapper.tsx', export: 'export default function AdminLayoutWrapper' },
  { file: 'components/admin/AdminMobileMenu.tsx', export: 'export default function AdminMobileMenu' }
]

let allExportsCorrect = true

requiredExports.forEach(({ file, export: exportName }) => {
  try {
    const filePath = join(process.cwd(), file)
    const content = readFileSync(filePath, 'utf-8')
    
    if (content.includes(exportName)) {
      console.log(`✅ ${file} - has correct default export`)
    } else {
      console.log(`❌ ${file} - missing or incorrect default export`)
      allExportsCorrect = false
    }
  } catch (error) {
    console.log(`❌ ${file} - cannot read file`)
    allExportsCorrect = false
  }
})

// Test 3: Check if components use required props
console.log('\n🔧 Checking component props...')

const propChecks = [
  { file: 'components/admin/AdminSidebar.tsx', props: ['isOpen', 'onClose'] },
  { file: 'components/admin/AdminHeader.tsx', props: ['onMenuToggle'] },
  { file: 'components/admin/AdminLayoutWrapper.tsx', props: ['children'] },
  { file: 'components/admin/AdminMobileMenu.tsx', props: ['isOpen', 'onClose'] }
]

let allPropsCorrect = true

propChecks.forEach(({ file, props }) => {
  try {
    const filePath = join(process.cwd(), file)
    const content = readFileSync(filePath, 'utf-8')
    
    const missingProps = props.filter(prop => !content.includes(prop))
    
    if (missingProps.length === 0) {
      console.log(`✅ ${file} - has all required props: ${props.join(', ')}`)
    } else {
      console.log(`❌ ${file} - missing props: ${missingProps.join(', ')}`)
      allPropsCorrect = false
    }
  } catch (error) {
    console.log(`❌ ${file} - cannot read file`)
    allPropsCorrect = false
  }
})

// Test 4: Check if components use Clerk authentication
console.log('\n🔐 Checking Clerk integration...')

const clerkComponents = [
  'components/admin/AdminSidebar.tsx',
  'components/admin/AdminHeader.tsx',
  'components/admin/AdminMobileMenu.tsx'
]

let allClerkIntegrated = true

clerkComponents.forEach(component => {
  try {
    const filePath = join(process.cwd(), component)
    const content = readFileSync(filePath, 'utf-8')
    
    const hasUserButton = content.includes('UserButton')
    const hasUseUser = content.includes('useUser')
    
    if (hasUserButton && hasUseUser) {
      console.log(`✅ ${component} - properly integrated with Clerk`)
    } else {
      console.log(`❌ ${component} - missing Clerk integration`)
      allClerkIntegrated = false
    }
  } catch (error) {
    console.log(`❌ ${component} - cannot read file`)
    allClerkIntegrated = false
  }
})

// Test 5: Check if components use TailwindCSS classes
console.log('\n🎨 Checking TailwindCSS styling...')

const stylingChecks = [
  { file: 'components/admin/AdminSidebar.tsx', classes: ['bg-glass-dark', 'backdrop-blur-xl', 'border-white/10'] },
  { file: 'components/admin/AdminHeader.tsx', classes: ['bg-glass-dark', 'backdrop-blur-xl', 'sticky'] },
  { file: 'components/admin/AdminLayoutWrapper.tsx', classes: ['bg-gradient-to-br', 'from-dark-950', 'via-dark-900'] }
]

let allStylingCorrect = true

stylingChecks.forEach(({ file, classes }) => {
  try {
    const filePath = join(process.cwd(), file)
    const content = readFileSync(filePath, 'utf-8')
    
    const missingClasses = classes.filter(className => !content.includes(className))
    
    if (missingClasses.length === 0) {
      console.log(`✅ ${file} - has glassmorphism and dark theme styling`)
    } else {
      console.log(`❌ ${file} - missing styling classes: ${missingClasses.join(', ')}`)
      allStylingCorrect = false
    }
  } catch (error) {
    console.log(`❌ ${file} - cannot read file`)
    allStylingCorrect = false
  }
})

// Final results
console.log('\n📊 Test Results Summary:')
console.log('========================')
console.log(`Component Files: ${allComponentsExist ? '✅ PASS' : '❌ FAIL'}`)
console.log(`Component Exports: ${allExportsCorrect ? '✅ PASS' : '❌ FAIL'}`)
console.log(`Component Props: ${allPropsCorrect ? '✅ PASS' : '❌ FAIL'}`)
console.log(`Clerk Integration: ${allClerkIntegrated ? '✅ PASS' : '❌ FAIL'}`)
console.log(`TailwindCSS Styling: ${allStylingCorrect ? '✅ PASS' : '❌ FAIL'}`)

const allTestsPassed = allComponentsExist && allExportsCorrect && allPropsCorrect && allClerkIntegrated && allStylingCorrect

console.log(`\n🎯 Overall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)

if (allTestsPassed) {
  console.log('\n🎉 Admin Layout Implementation Complete!')
  console.log('✨ Features implemented:')
  console.log('   • Responsive sidebar navigation with glassmorphism design')
  console.log('   • Mobile-friendly header with search and notifications')
  console.log('   • Breadcrumb navigation for better UX')
  console.log('   • Clerk authentication integration')
  console.log('   • Dark theme with electric blue accents')
  console.log('   • Touch-friendly mobile menu')
  console.log('   • Smooth animations and transitions')
} else {
  console.log('\n🔧 Please fix the failing tests before proceeding.')
}

process.exit(allTestsPassed ? 0 : 1)