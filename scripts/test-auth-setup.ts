#!/usr/bin/env tsx

/**
 * Authentication Setup Test Script
 * 
 * This script tests the complete authentication setup including:
 * - Database connectivity and admin table structure
 * - Admin service CRUD operations
 * - Webhook configuration
 * - Environment variables
 * 
 * Usage:
 *   npm run test-auth
 *   or
 *   npx tsx scripts/test-auth-setup.ts
 */

import { config } from 'dotenv'

// Load environment variables FIRST
config({ path: '.env.local' })
config({ path: '.env' })

// Now import modules that depend on environment variables
import { AuthTestSuite } from '../lib/auth-test'

async function testAuthenticationSetup() {
  console.log('🔐 Testing Admin Authentication Setup...\n')
  
  try {
    // Run the full test suite
    const { overall, results } = await AuthTestSuite.runFullTestSuite()
    
    // Display detailed results
    console.log('\n📊 Detailed Test Results:')
    console.log('=' .repeat(50))
    
    Object.entries(results).forEach(([testName, result]) => {
      console.log(`\n${result.success ? '✅' : '❌'} ${testName}`)
      console.log(`   Status: ${result.message}`)
      
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
      
      if (result.details && typeof result.details === 'object') {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
      }
    })
    
    console.log('\n' + '='.repeat(50))
    console.log(`\n🎯 Final Result: ${overall.success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
    console.log(`   ${overall.message}`)
    
    if (overall.details) {
      console.log(`   Passed: ${overall.details.passedTests}/${overall.details.totalTests}`)
      if (overall.details.failedTestNames?.length > 0) {
        console.log(`   Failed Tests: ${overall.details.failedTestNames.join(', ')}`)
      }
    }
    
    console.log('\n📝 Next Steps:')
    if (overall.success) {
      console.log('  ✅ Authentication setup is complete and working!')
      console.log('  🚀 You can now:')
      console.log('     1. Start the development server: npm run dev')
      console.log('     2. Access the admin login at: http://localhost:3000/admin/login')
      console.log('     3. Create an admin account through Clerk')
      console.log('     4. Access the dashboard at: http://localhost:3000/admin/dashboard')
    } else {
      console.log('  ❌ Please fix the failed tests before proceeding:')
      if (overall.details?.failedTestNames) {
        overall.details.failedTestNames.forEach((testName: string) => {
          const result = results[testName]
          console.log(`     - ${testName}: ${result.error || result.message}`)
        })
      }
    }
    
    // Exit with appropriate code
    process.exit(overall.success ? 0 : 1)
    
  } catch (error) {
    console.error('\n❌ Authentication test suite failed to run:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAuthenticationSetup()
}

export { testAuthenticationSetup }