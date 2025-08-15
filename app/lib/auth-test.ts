import { AdminService } from './admin-service'
import { db } from './db'

/**
 * Authentication testing utilities for verifying Clerk integration
 * This module provides functions to test various authentication scenarios
 */

export interface AuthTestResult {
  success: boolean
  message: string
  details?: any
  error?: string
}

export class AuthTestSuite {
  /**
   * Test database connection for admin operations
   */
  static async testDatabaseConnection(): Promise<AuthTestResult> {
    try {
      const isConnected = await db.testConnection()
      
      if (!isConnected) {
        return {
          success: false,
          message: 'Database connection failed',
          error: 'Unable to connect to NeonDB'
        }
      }
      
      return {
        success: true,
        message: 'Database connection successful'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Database connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Test admin table structure and indexes
   */
  static async testAdminTableStructure(): Promise<AuthTestResult> {
    try {
      // Check if admin table exists and has correct structure
      const tableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'admins'
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      
      const expectedColumns = [
        'id', 'clerk_id', 'email', 'name', 'role', 'created_at', 'updated_at'
      ]
      
      const actualColumns = tableCheck.map((col: any) => col.column_name)
      const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col))
      
      if (missingColumns.length > 0) {
        return {
          success: false,
          message: 'Admin table structure is incomplete',
          error: `Missing columns: ${missingColumns.join(', ')}`,
          details: { actualColumns, expectedColumns }
        }
      }
      
      // Check indexes
      const indexCheck = await db.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'admins'
        AND schemaname = 'public'
      `)
      
      return {
        success: true,
        message: 'Admin table structure is correct',
        details: {
          columns: tableCheck,
          indexes: indexCheck
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Admin table structure test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Test admin service CRUD operations
   */
  static async testAdminServiceOperations(): Promise<AuthTestResult> {
    const testClerkId = `test_clerk_${Date.now()}`
    const testEmail = 'test@example.com'
    const testName = 'Test Admin'
    
    try {
      // Test create admin
      const createdAdmin = await AdminService.upsertAdmin(testClerkId, testEmail, testName)
      
      if (!createdAdmin || createdAdmin.clerkId !== testClerkId) {
        throw new Error('Failed to create test admin')
      }
      
      // Test get admin by Clerk ID
      const fetchedAdmin = await AdminService.getAdminByClerkId(testClerkId)
      
      if (!fetchedAdmin || fetchedAdmin.clerkId !== testClerkId) {
        throw new Error('Failed to fetch test admin')
      }
      
      // Test admin role check
      const isAdmin = await AdminService.isAdmin(testClerkId)
      
      if (!isAdmin) {
        throw new Error('Admin role check failed')
      }
      
      // Test update admin
      const updatedAdmin = await AdminService.upsertAdmin(testClerkId, 'updated@example.com', 'Updated Admin')
      
      if (!updatedAdmin || updatedAdmin.email !== 'updated@example.com') {
        throw new Error('Failed to update test admin')
      }
      
      // Test delete admin
      const deleted = await AdminService.deleteAdmin(testClerkId)
      
      if (!deleted) {
        throw new Error('Failed to delete test admin')
      }
      
      // Verify deletion
      const deletedAdmin = await AdminService.getAdminByClerkId(testClerkId)
      
      if (deletedAdmin) {
        throw new Error('Admin was not properly deleted')
      }
      
      return {
        success: true,
        message: 'All admin service operations completed successfully',
        details: {
          created: createdAdmin,
          fetched: fetchedAdmin,
          updated: updatedAdmin,
          deleted: true
        }
      }
    } catch (error) {
      // Cleanup in case of error
      try {
        await AdminService.deleteAdmin(testClerkId)
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      
      return {
        success: false,
        message: 'Admin service operations test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Test webhook environment configuration
   */
  static async testWebhookConfiguration(): Promise<AuthTestResult> {
    try {
      const requiredEnvVars = [
        'CLERK_WEBHOOK_SECRET',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'DATABASE_URL'
      ]
      
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
      
      if (missingVars.length > 0) {
        return {
          success: false,
          message: 'Missing required environment variables',
          error: `Missing: ${missingVars.join(', ')}`,
          details: { missingVars, requiredEnvVars }
        }
      }
      
      // Test webhook secret format
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
      if (!webhookSecret?.startsWith('whsec_')) {
        return {
          success: false,
          message: 'Invalid webhook secret format',
          error: 'Webhook secret should start with "whsec_"'
        }
      }
      
      return {
        success: true,
        message: 'Webhook configuration is valid',
        details: {
          configuredVars: requiredEnvVars.filter(varName => process.env[varName]),
          webhookSecretFormat: 'Valid'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Webhook configuration test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Test admin statistics functionality
   */
  static async testAdminStatistics(): Promise<AuthTestResult> {
    try {
      const stats = await AdminService.getAdminStats()
      
      if (typeof stats.totalAdmins !== 'number' || 
          typeof stats.recentLogins !== 'number' || 
          typeof stats.activeAdmins !== 'number') {
        throw new Error('Invalid statistics format')
      }
      
      return {
        success: true,
        message: 'Admin statistics test completed successfully',
        details: stats
      }
    } catch (error) {
      return {
        success: false,
        message: 'Admin statistics test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Run comprehensive authentication test suite
   */
  static async runFullTestSuite(): Promise<{
    overall: AuthTestResult
    results: { [testName: string]: AuthTestResult }
  }> {
    const results: { [testName: string]: AuthTestResult } = {}
    
    console.log('🧪 Running Authentication Test Suite...\n')
    
    // Run all tests
    const tests = [
      { name: 'Database Connection', fn: this.testDatabaseConnection },
      { name: 'Admin Table Structure', fn: this.testAdminTableStructure },
      { name: 'Admin Service Operations', fn: this.testAdminServiceOperations },
      { name: 'Webhook Configuration', fn: this.testWebhookConfiguration },
      { name: 'Admin Statistics', fn: this.testAdminStatistics }
    ]
    
    for (const test of tests) {
      console.log(`Running ${test.name} test...`)
      results[test.name] = await test.fn()
      console.log(`${results[test.name].success ? '✅' : '❌'} ${test.name}: ${results[test.name].message}`)
      if (!results[test.name].success && results[test.name].error) {
        console.log(`   Error: ${results[test.name].error}`)
      }
      console.log('')
    }
    
    // Calculate overall result
    const failedTests = Object.entries(results).filter(([_, result]) => !result.success)
    const overall: AuthTestResult = {
      success: failedTests.length === 0,
      message: failedTests.length === 0 
        ? 'All authentication tests passed successfully' 
        : `${failedTests.length} test(s) failed`,
      details: {
        totalTests: tests.length,
        passedTests: tests.length - failedTests.length,
        failedTests: failedTests.length,
        failedTestNames: failedTests.map(([name]) => name)
      }
    }
    
    console.log(`🎯 Overall Result: ${overall.success ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`   ${overall.message}`)
    
    return { overall, results }
  }
}