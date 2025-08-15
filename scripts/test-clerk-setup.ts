#!/usr/bin/env tsx

/**
 * Test script to verify Clerk authentication setup
 */

import { config } from 'dotenv'
import { readFileSync } from 'fs'

// Load environment variables
config({ path: '.env.local' })

async function testClerkSetup() {
  console.log('🔍 Testing Clerk Authentication Setup...\n')

  // Test 1: Check environment variables
  console.log('1. Checking environment variables:')
  const requiredEnvVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
    'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
    'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
    'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'
  ]

  let envVarsValid = true
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (value) {
      console.log(`   ✅ ${envVar}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`   ❌ ${envVar}: Missing`)
      envVarsValid = false
    }
  }

  // Test 2: Check webhook configuration
  console.log('\n2. Checking webhook configuration:')
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (webhookSecret) {
    console.log(`   ✅ CLERK_WEBHOOK_SECRET: ${webhookSecret.substring(0, 20)}...`)
  } else {
    console.log('   ❌ CLERK_WEBHOOK_SECRET: Missing')
    envVarsValid = false
  }

  // Test 3: Check database connection for admin table
  console.log('\n3. Checking database setup:')
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    
    // Check if admins table exists
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admins'
      );
    `
    
    if (result[0]?.exists) {
      console.log('   ✅ Admins table exists in database')
    } else {
      console.log('   ❌ Admins table not found in database')
      console.log('   💡 Run: npm run init-db to create database tables')
    }
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error}`)
  }

  // Test 4: Check file structure
  console.log('\n4. Checking file structure:')
  const fs = await import('fs')
  const path = await import('path')
  
  const requiredFiles = [
    'app/lib/clerk.ts',
    'app/(admin)/admin/login/page.tsx',
    'app/(admin)/admin/dashboard/page.tsx',
    'app/api/webhooks/clerk/route.ts',
    'middleware.ts'
  ]

  let filesValid = true
  for (const file of requiredFiles) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`   ✅ ${file}`)
    } else {
      console.log(`   ❌ ${file}: Missing`)
      filesValid = false
    }
  }

  // Summary
  console.log('\n📋 Summary:')
  if (envVarsValid && filesValid) {
    console.log('   ✅ Clerk authentication setup is complete!')
    console.log('   🚀 You can now run: npm run dev')
    console.log('   🔗 Visit: http://localhost:3000/admin/login')
  } else {
    console.log('   ❌ Clerk authentication setup has issues')
    console.log('   🔧 Please fix the missing components above')
  }
}

// Run the test
testClerkSetup().catch(console.error)