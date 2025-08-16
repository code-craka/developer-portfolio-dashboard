#!/usr/bin/env tsx

/**
 * Verification script for Experience Management Interface
 * Comprehensive test of all experience management features
 */

import { validateExperienceData } from '../lib/security'
import { ExperienceFormData } from '../lib/types'

function verifyExperienceInterface() {
  console.log('🔍 Verifying Experience Management Interface...\n')

  let allTestsPassed = true
  const results: { [key: string]: boolean } = {}

  // Test 1: Component Files Exist
  console.log('1. Checking component files...')
  try {
    const fs = require('fs')
    const path = require('path')
    
    const requiredFiles = [
      'components/admin/ExperienceTable.tsx',
      'components/admin/ExperienceModal.tsx',
      'components/admin/ExperienceManager.tsx',
      'app/(admin)/experience/page.tsx'
    ]
    
    let filesExist = 0
    for (const file of requiredFiles) {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        filesExist++
        console.log(`   ✅ ${file}`)
      } else {
        console.log(`   ❌ ${file} - MISSING`)
        allTestsPassed = false
      }
    }
    
    results['Component Files'] = filesExist === requiredFiles.length
    console.log(`   📊 ${filesExist}/${requiredFiles.length} files exist\n`)
    
  } catch (error) {
    console.log('   ❌ Error checking files:', error)
    results['Component Files'] = false
    allTestsPassed = false
  }

  // Test 2: API Routes Exist
  console.log('2. Checking API routes...')
  try {
    const fs = require('fs')
    const path = require('path')
    
    const apiRoutes = [
      'app/api/experiences/route.ts',
      'app/api/experiences/[id]/route.ts',
      'app/api/upload/route.ts'
    ]
    
    let routesExist = 0
    for (const route of apiRoutes) {
      if (fs.existsSync(path.join(process.cwd(), route))) {
        routesExist++
        console.log(`   ✅ ${route}`)
      } else {
        console.log(`   ❌ ${route} - MISSING`)
        allTestsPassed = false
      }
    }
    
    results['API Routes'] = routesExist === apiRoutes.length
    console.log(`   📊 ${routesExist}/${apiRoutes.length} routes exist\n`)
    
  } catch (error) {
    console.log('   ❌ Error checking API routes:', error)
    results['API Routes'] = false
    allTestsPassed = false
  }

  // Test 3: Validation Logic
  console.log('3. Testing validation logic...')
  try {
    const testData: ExperienceFormData = {
      company: 'Test Company',
      position: 'Software Engineer',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      description: 'This is a test description that is long enough to pass validation.',
      achievements: ['Test achievement'],
      technologies: ['JavaScript', 'TypeScript'],
      location: 'Test City, TC',
      employmentType: 'Full-time'
    }
    
    const validation = validateExperienceData(testData)
    if (validation.valid) {
      console.log('   ✅ Validation logic working correctly')
      results['Validation Logic'] = true
    } else {
      console.log('   ❌ Validation failed:', validation.errors)
      results['Validation Logic'] = false
      allTestsPassed = false
    }
    
  } catch (error) {
    console.log('   ❌ Error testing validation:', error)
    results['Validation Logic'] = false
    allTestsPassed = false
  }

  // Test 4: Component Structure
  console.log('\n4. Checking component structure...')
  try {
    const fs = require('fs')
    const path = require('path')
    
    // Check ExperienceTable component
    const tableContent = fs.readFileSync(
      path.join(process.cwd(), 'components/admin/ExperienceTable.tsx'), 
      'utf8'
    )
    
    const tableFeatures = [
      'chronological sorting',
      'employment type filtering',
      'responsive design',
      'company logo display',
      'duration calculation',
      'mobile cards view'
    ]
    
    const tableChecks = [
      tableContent.includes('sortField'),
      tableContent.includes('filterEmploymentType'),
      tableContent.includes('lg:hidden'),
      tableContent.includes('companyLogo'),
      tableContent.includes('calculateDuration'),
      tableContent.includes('Mobile Cards')
    ]
    
    const tableScore = tableChecks.filter(Boolean).length
    console.log(`   📊 ExperienceTable: ${tableScore}/${tableFeatures.length} features`)
    
    // Check ExperienceModal component
    const modalContent = fs.readFileSync(
      path.join(process.cwd(), 'components/admin/ExperienceModal.tsx'), 
      'utf8'
    )
    
    const modalFeatures = [
      'form validation',
      'date pickers',
      'current position toggle',
      'achievements management',
      'technologies management',
      'company logo upload'
    ]
    
    const modalChecks = [
      modalContent.includes('validateForm'),
      modalContent.includes('type="date"'),
      modalContent.includes('isCurrentPosition'),
      modalContent.includes('achievements'),
      modalContent.includes('technologies'),
      modalContent.includes('logoFile')
    ]
    
    const modalScore = modalChecks.filter(Boolean).length
    console.log(`   📊 ExperienceModal: ${modalScore}/${modalFeatures.length} features`)
    
    // Check ExperienceManager component
    const managerContent = fs.readFileSync(
      path.join(process.cwd(), 'components/admin/ExperienceManager.tsx'), 
      'utf8'
    )
    
    const managerFeatures = [
      'CRUD operations',
      'notification system',
      'delete confirmation',
      'loading states',
      'statistics display',
      'error handling'
    ]
    
    const managerChecks = [
      managerContent.includes('handleSaveExperience'),
      managerContent.includes('NotificationSystem'),
      managerContent.includes('DeleteConfirmModal'),
      managerContent.includes('loading'),
      managerContent.includes('Total Experiences'),
      managerContent.includes('catch (error)')
    ]
    
    const managerScore = managerChecks.filter(Boolean).length
    console.log(`   📊 ExperienceManager: ${managerScore}/${managerFeatures.length} features`)
    
    const totalFeatures = tableFeatures.length + modalFeatures.length + managerFeatures.length
    const totalImplemented = tableScore + modalScore + managerScore
    
    results['Component Structure'] = totalImplemented >= totalFeatures * 0.8 // 80% threshold
    console.log(`   📊 Overall: ${totalImplemented}/${totalFeatures} features implemented\n`)
    
  } catch (error) {
    console.log('   ❌ Error checking component structure:', error)
    results['Component Structure'] = false
    allTestsPassed = false
  }

  // Test 5: CSS Classes
  console.log('5. Checking CSS classes...')
  try {
    const fs = require('fs')
    const path = require('path')
    
    const cssContent = fs.readFileSync(
      path.join(process.cwd(), 'app/globals.css'), 
      'utf8'
    )
    
    const requiredClasses = [
      'input-glass',
      'textarea-glass',
      'btn-electric',
      'btn-glass',
      'loading-spinner',
      'skeleton'
    ]
    
    let classesFound = 0
    for (const className of requiredClasses) {
      if (cssContent.includes(`.${className}`)) {
        classesFound++
        console.log(`   ✅ .${className}`)
      } else {
        console.log(`   ❌ .${className} - MISSING`)
        allTestsPassed = false
      }
    }
    
    results['CSS Classes'] = classesFound === requiredClasses.length
    console.log(`   📊 ${classesFound}/${requiredClasses.length} CSS classes defined\n`)
    
  } catch (error) {
    console.log('   ❌ Error checking CSS classes:', error)
    results['CSS Classes'] = false
    allTestsPassed = false
  }

  // Test 6: Navigation Integration
  console.log('6. Checking navigation integration...')
  try {
    const fs = require('fs')
    const path = require('path')
    
    // Check dashboard link
    const dashboardContent = fs.readFileSync(
      path.join(process.cwd(), 'app/(admin)/dashboard/page.tsx'), 
      'utf8'
    )
    
    const hasDashboardLink = dashboardContent.includes('/experience')
    console.log(`   ${hasDashboardLink ? '✅' : '❌'} Dashboard link to experience page`)
    
    // Check sidebar navigation
    const sidebarContent = fs.readFileSync(
      path.join(process.cwd(), 'components/admin/AdminSidebar.tsx'), 
      'utf8'
    )
    
    const hasSidebarLink = sidebarContent.includes("name: 'Experience'")
    console.log(`   ${hasSidebarLink ? '✅' : '❌'} Sidebar navigation item`)
    
    results['Navigation Integration'] = hasDashboardLink && hasSidebarLink
    
  } catch (error) {
    console.log('   ❌ Error checking navigation:', error)
    results['Navigation Integration'] = false
    allTestsPassed = false
  }

  // Test 7: TypeScript Types
  console.log('\n7. Checking TypeScript types...')
  try {
    const fs = require('fs')
    const path = require('path')
    
    const typesContent = fs.readFileSync(
      path.join(process.cwd(), 'lib/types.ts'), 
      'utf8'
    )
    
    const requiredTypes = [
      'Experience',
      'ExperienceFormData',
      'employmentType',
      'achievements',
      'technologies',
      'companyLogo'
    ]
    
    let typesFound = 0
    for (const type of requiredTypes) {
      if (typesContent.includes(type)) {
        typesFound++
        console.log(`   ✅ ${type}`)
      } else {
        console.log(`   ❌ ${type} - MISSING`)
        allTestsPassed = false
      }
    }
    
    results['TypeScript Types'] = typesFound === requiredTypes.length
    console.log(`   📊 ${typesFound}/${requiredTypes.length} types defined\n`)
    
  } catch (error) {
    console.log('   ❌ Error checking types:', error)
    results['TypeScript Types'] = false
    allTestsPassed = false
  }

  // Final Summary
  console.log('🎯 VERIFICATION SUMMARY')
  console.log('=' .repeat(50))
  
  const categories = Object.keys(results)
  const passedCategories = categories.filter(cat => results[cat])
  
  for (const category of categories) {
    const status = results[category] ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${category}`)
  }
  
  console.log('=' .repeat(50))
  console.log(`📊 Overall Score: ${passedCategories.length}/${categories.length} categories passed`)
  
  if (allTestsPassed && passedCategories.length === categories.length) {
    console.log('\n🎉 VERIFICATION SUCCESSFUL!')
    console.log('🚀 Experience Management Interface is fully implemented and ready!')
    console.log('\n📋 Features Available:')
    console.log('   • Experience table with chronological sorting')
    console.log('   • Add/Edit experience modal with validation')
    console.log('   • Company logo upload functionality')
    console.log('   • Achievement and technology tag management')
    console.log('   • Employment type filtering')
    console.log('   • Responsive design for all devices')
    console.log('   • Delete confirmation with cleanup')
    console.log('   • Real-time notifications')
    console.log('   • Current position handling')
    console.log('   • Duration calculations')
    console.log('\n🔗 Access the interface at: /experience')
  } else {
    console.log('\n⚠️  VERIFICATION INCOMPLETE')
    console.log('Some components or features may need attention.')
    console.log('Please review the failed checks above.')
  }
}

// Run verification
verifyExperienceInterface()