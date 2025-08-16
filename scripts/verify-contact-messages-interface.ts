#!/usr/bin/env tsx

/**
 * Verification script for Contact Messages Management Interface
 * Checks that all required files and components are properly created
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const requiredFiles = [
  // Components
  'components/admin/ContactMessagesTable.tsx',
  'components/admin/ContactMessagesManager.tsx',
  
  // Pages
  'app/(admin)/messages/page.tsx',
  
  // API Routes (should already exist)
  'app/api/contact/route.ts',
  'app/api/contact/[id]/route.ts',
  
  // Test scripts
  'scripts/test-contact-messages.ts',
  'scripts/verify-contact-messages-interface.ts'
]

const requiredImports = [
  // ContactMessagesTable should import these
  { file: 'components/admin/ContactMessagesTable.tsx', imports: ['ContactMessage', 'useState'] },
  
  // ContactMessagesManager should import these
  { file: 'components/admin/ContactMessagesManager.tsx', imports: ['ContactMessagesTable', 'DeleteConfirmModal', 'NotificationSystem'] },
  
  // Messages page should import these
  { file: 'app/(admin)/messages/page.tsx', imports: ['requireAdminAuth', 'AdminLayoutWrapper', 'ContactMessagesManager'] }
]

const requiredFeatures = [
  // ContactMessagesTable features
  { file: 'components/admin/ContactMessagesTable.tsx', features: ['sorting', 'filtering', 'search', 'read/unread status', 'responsive design'] },
  
  // ContactMessagesManager features
  { file: 'components/admin/ContactMessagesManager.tsx', features: ['API calls', 'state management', 'notifications', 'delete confirmation'] }
]

function checkFileExists(filePath: string): boolean {
  const fullPath = join(process.cwd(), filePath)
  return existsSync(fullPath)
}

function checkFileContains(filePath: string, searchTerms: string[]): { term: string, found: boolean }[] {
  const fullPath = join(process.cwd(), filePath)
  if (!existsSync(fullPath)) {
    return searchTerms.map(term => ({ term, found: false }))
  }
  
  const content = readFileSync(fullPath, 'utf-8')
  return searchTerms.map(term => ({ term, found: content.includes(term) }))
}

function verifyContactMessagesInterface() {
  console.log('🔍 Verifying Contact Messages Management Interface...\n')

  let allPassed = true

  // Check required files exist
  console.log('📁 Checking required files...')
  for (const file of requiredFiles) {
    const exists = checkFileExists(file)
    console.log(`   ${exists ? '✅' : '❌'} ${file}`)
    if (!exists) allPassed = false
  }

  // Check required imports
  console.log('\n📦 Checking required imports...')
  for (const { file, imports } of requiredImports) {
    console.log(`   ${file}:`)
    const results = checkFileContains(file, imports)
    for (const { term, found } of results) {
      console.log(`     ${found ? '✅' : '❌'} ${term}`)
      if (!found) allPassed = false
    }
  }

  // Check required features
  console.log('\n🎯 Checking required features...')
  for (const { file, features } of requiredFeatures) {
    console.log(`   ${file}:`)
    
    // Map features to code patterns to search for
    const featurePatterns: { [key: string]: string[] } = {
      'sorting': ['sortField', 'sortDirection', 'handleSort'],
      'filtering': ['filter', 'Filter'],
      'search': ['search', 'Search'],
      'read/unread status': ['read', 'unread', 'Mark as'],
      'responsive design': ['lg:hidden', 'sm:', 'md:'],
      'API calls': ['fetch(', 'api/contact'],
      'state management': ['useState', 'useEffect'],
      'notifications': ['notification', 'NotificationSystem'],
      'delete confirmation': ['delete', 'DeleteConfirmModal']
    }
    
    for (const feature of features) {
      const patterns = featurePatterns[feature] || [feature]
      const results = checkFileContains(file, patterns)
      const hasFeature = results.some(r => r.found)
      console.log(`     ${hasFeature ? '✅' : '❌'} ${feature}`)
      if (!hasFeature) allPassed = false
    }
  }

  // Check CSS classes
  console.log('\n🎨 Checking CSS classes...')
  const cssClasses = ['glassmorphism-card', 'btn-secondary', 'input-glass', 'electric-blue']
  const cssResults = checkFileContains('app/globals.css', cssClasses)
  for (const { term, found } of cssResults) {
    console.log(`   ${found ? '✅' : '❌'} ${term}`)
    if (!found) allPassed = false
  }

  // Check navigation integration
  console.log('\n🧭 Checking navigation integration...')
  const navChecks = [
    { file: 'components/admin/AdminSidebar.tsx', term: 'Messages' },
    { file: 'app/(admin)/dashboard/page.tsx', term: '/messages' }
  ]
  
  for (const { file, term } of navChecks) {
    const results = checkFileContains(file, [term])
    const found = results[0].found
    console.log(`   ${found ? '✅' : '❌'} ${file} contains ${term}`)
    if (!found) allPassed = false
  }

  // Summary
  console.log('\n📊 Verification Summary:')
  if (allPassed) {
    console.log('✅ All checks passed! Contact Messages Management Interface is properly implemented.')
    console.log('\n🚀 Next steps:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Test the contact form submission on the public site')
    console.log('   3. Login as admin and navigate to /messages')
    console.log('   4. Test message management functionality')
    console.log('   5. Run the API test: npm run tsx scripts/test-contact-messages.ts')
  } else {
    console.log('❌ Some checks failed. Please review the issues above.')
    console.log('\n🔧 Common fixes:')
    console.log('   - Ensure all files are created in the correct locations')
    console.log('   - Check import statements and component names')
    console.log('   - Verify CSS classes are defined in globals.css')
    console.log('   - Make sure navigation links are properly updated')
  }

  return allPassed
}

// Run verification
const success = verifyContactMessagesInterface()
process.exit(success ? 0 : 1)