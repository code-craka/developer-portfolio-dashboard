#!/usr/bin/env tsx

/**
 * Production Setup Verification Script
 * 
 * This script verifies that all production configuration is properly set up
 * for the creavibe.pro deployment.
 */

import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
config({ path: '.env.production' })
config({ path: '.env.local' })

interface VerificationResult {
  category: string
  checks: Array<{
    name: string
    status: 'pass' | 'fail' | 'warning'
    message: string
  }>
}

const results: VerificationResult[] = []

function addResult(category: string, name: string, status: 'pass' | 'fail' | 'warning', message: string) {
  let categoryResult = results.find(r => r.category === category)
  if (!categoryResult) {
    categoryResult = { category, checks: [] }
    results.push(categoryResult)
  }
  categoryResult.checks.push({ name, status, message })
}

function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_APP_URL',
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'CLERK_WEBHOOK_SECRET'
  ]

  const optionalVars = [
    'CLERK_JWT_TEMPLATE_NAME',
    'NEXT_PUBLIC_CLERK_JWT_ISSUER',
    'NEXT_PUBLIC_CLERK_JWKS_URL'
  ]

  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      addResult('Environment Variables', varName, 'fail', 'Missing required environment variable')
    } else if (varName === 'NEXT_PUBLIC_APP_URL' && value !== 'https://creavibe.pro') {
      addResult('Environment Variables', varName, 'warning', `Expected https://creavibe.pro, got ${value}`)
    } else {
      addResult('Environment Variables', varName, 'pass', 'Environment variable is set')
    }
  })

  optionalVars.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      addResult('Environment Variables', varName, 'warning', 'Optional JWT configuration variable not set')
    } else {
      addResult('Environment Variables', varName, 'pass', 'JWT configuration variable is set')
    }
  })
}

function checkClerkConfiguration() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (publishableKey) {
    if (publishableKey.startsWith('pk_live_')) {
      addResult('Clerk Configuration', 'Publishable Key', 'pass', 'Using production Clerk key')
    } else if (publishableKey.startsWith('pk_test_')) {
      addResult('Clerk Configuration', 'Publishable Key', 'warning', 'Using test Clerk key in production config')
    } else {
      addResult('Clerk Configuration', 'Publishable Key', 'fail', 'Invalid Clerk publishable key format')
    }
  }

  if (secretKey) {
    if (secretKey.startsWith('sk_live_')) {
      addResult('Clerk Configuration', 'Secret Key', 'pass', 'Using production Clerk secret key')
    } else if (secretKey.startsWith('sk_test_')) {
      addResult('Clerk Configuration', 'Secret Key', 'warning', 'Using test Clerk secret key in production config')
    } else {
      addResult('Clerk Configuration', 'Secret Key', 'fail', 'Invalid Clerk secret key format')
    }
  }

  if (webhookSecret) {
    if (webhookSecret === 'whsec_VaOtczmzcx5ENueijEw9otC6cMazbnVK') {
      addResult('Clerk Configuration', 'Webhook Secret', 'pass', 'Webhook secret matches expected production value')
    } else {
      addResult('Clerk Configuration', 'Webhook Secret', 'warning', 'Webhook secret differs from expected production value')
    }
  }

  // Check JWT configuration
  const jwtIssuer = process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER
  if (jwtIssuer) {
    if (jwtIssuer === 'https://clerk.creavibe.pro') {
      addResult('Clerk Configuration', 'JWT Issuer', 'pass', 'JWT issuer correctly configured for creavibe.pro')
    } else {
      addResult('Clerk Configuration', 'JWT Issuer', 'warning', `JWT issuer is ${jwtIssuer}, expected https://clerk.creavibe.pro`)
    }
  }
}

function checkDatabaseConfiguration() {
  const dbUrl = process.env.DATABASE_URL
  const dbAuthUrl = process.env.DATABASE_AUTHENTICATED_URL

  if (dbUrl) {
    if (dbUrl.includes('ep-odd-cell-a1a1sohs.ap-southeast-1.aws.neon.tech')) {
      addResult('Database Configuration', 'Database URL', 'pass', 'Using expected NeonDB production instance')
    } else {
      addResult('Database Configuration', 'Database URL', 'warning', 'Database URL does not match expected production instance')
    }

    if (dbUrl.includes('sslmode=require')) {
      addResult('Database Configuration', 'SSL Mode', 'pass', 'SSL mode is properly configured')
    } else {
      addResult('Database Configuration', 'SSL Mode', 'warning', 'SSL mode not explicitly set to require')
    }
  }

  if (dbAuthUrl) {
    if (dbAuthUrl.includes('authenticated@')) {
      addResult('Database Configuration', 'Authenticated URL', 'pass', 'Authenticated database URL is configured')
    } else {
      addResult('Database Configuration', 'Authenticated URL', 'warning', 'Authenticated database URL format may be incorrect')
    }
  }
}

function checkNextJsConfiguration() {
  try {
    const nextConfigPath = join(process.cwd(), 'next.config.js')
    const nextConfigContent = readFileSync(nextConfigPath, 'utf-8')

    if (nextConfigContent.includes('compress: true')) {
      addResult('Next.js Configuration', 'Compression', 'pass', 'Gzip compression is enabled')
    } else {
      addResult('Next.js Configuration', 'Compression', 'warning', 'Gzip compression not found in config')
    }

    if (nextConfigContent.includes('poweredByHeader: false')) {
      addResult('Next.js Configuration', 'Security Headers', 'pass', 'X-Powered-By header is disabled')
    } else {
      addResult('Next.js Configuration', 'Security Headers', 'warning', 'X-Powered-By header not disabled')
    }

    if (nextConfigContent.includes('creavibe.pro')) {
      addResult('Next.js Configuration', 'Domain Configuration', 'pass', 'creavibe.pro domain is configured')
    } else {
      addResult('Next.js Configuration', 'Domain Configuration', 'warning', 'creavibe.pro domain not found in image configuration')
    }

    if (nextConfigContent.includes('splitChunks')) {
      addResult('Next.js Configuration', 'Bundle Optimization', 'pass', 'Bundle splitting is configured')
    } else {
      addResult('Next.js Configuration', 'Bundle Optimization', 'warning', 'Bundle splitting not found in webpack config')
    }
  } catch (error) {
    addResult('Next.js Configuration', 'Config File', 'fail', `Could not read next.config.js: ${error}`)
  }
}

function checkWebhookEndpoint() {
  try {
    const webhookPath = join(process.cwd(), 'app/api/webhooks/clerk/route.ts')
    const webhookContent = readFileSync(webhookPath, 'utf-8')

    if (webhookContent.includes('CLERK_WEBHOOK_SECRET')) {
      addResult('Webhook Configuration', 'Webhook Handler', 'pass', 'Webhook handler is properly configured')
    } else {
      addResult('Webhook Configuration', 'Webhook Handler', 'warning', 'Webhook handler may not be properly configured')
    }

    if (webhookContent.includes('svix')) {
      addResult('Webhook Configuration', 'Webhook Verification', 'pass', 'Webhook signature verification is implemented')
    } else {
      addResult('Webhook Configuration', 'Webhook Verification', 'warning', 'Webhook signature verification not found')
    }
  } catch (error) {
    addResult('Webhook Configuration', 'Webhook File', 'fail', `Webhook handler file not found: ${error}`)
  }
}

function printResults() {
  console.log('\n🔍 Production Setup Verification Results\n')
  console.log('=' .repeat(60))

  let totalChecks = 0
  let passedChecks = 0
  let failedChecks = 0
  let warningChecks = 0

  results.forEach(category => {
    console.log(`\n📋 ${category.category}`)
    console.log('-'.repeat(40))

    category.checks.forEach(check => {
      totalChecks++
      const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️'
      
      if (check.status === 'pass') passedChecks++
      else if (check.status === 'fail') failedChecks++
      else warningChecks++

      console.log(`${icon} ${check.name}: ${check.message}`)
    })
  })

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Summary: ${passedChecks} passed, ${warningChecks} warnings, ${failedChecks} failed (${totalChecks} total)`)

  if (failedChecks > 0) {
    console.log('\n❌ Critical issues found. Please address failed checks before deploying.')
    process.exit(1)
  } else if (warningChecks > 0) {
    console.log('\n⚠️  Some warnings found. Review before deploying to production.')
  } else {
    console.log('\n✅ All checks passed! Your production setup looks good.')
  }

  console.log('\n📚 For detailed setup instructions, see: docs/PRODUCTION_SETUP_GUIDE.md')
}

async function main() {
  console.log('🚀 Verifying production setup for creavibe.pro...')
  
  checkEnvironmentVariables()
  checkClerkConfiguration()
  checkDatabaseConfiguration()
  checkNextJsConfiguration()
  checkWebhookEndpoint()
  
  printResults()
}

if (require.main === module) {
  main().catch(console.error)
}

export { main as verifyProductionSetup }