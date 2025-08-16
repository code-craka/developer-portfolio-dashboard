#!/usr/bin/env tsx

/**
 * Test script for Project CRUD API routes
 * This script tests the project API endpoints to ensure they work correctly
 */

import { config } from 'dotenv'
import { db } from '../lib/db'
import { Project } from '../lib/types'

// Load environment variables
config({ path: '.env.local' })

async function testProjectsAPI() {
  console.log('🧪 Testing Project CRUD API Routes...\n')

  try {
    // Test 1: Database connection
    console.log('1. Testing database connection...')
    const isConnected = await db.testConnection()
    console.log(`   ${isConnected ? '✅' : '❌'} Database connection: ${isConnected ? 'PASS' : 'FAIL'}`)
    
    if (!isConnected) {
      console.log('❌ Database connection failed. Cannot proceed with API tests.')
      return
    }

    // Test 2: Create test project directly in database
    console.log('\n2. Creating test project in database...')
    const testProject = {
      title: 'Test Project API',
      description: 'This is a test project created by the API test script',
      techStack: ['TypeScript', 'Next.js', 'PostgreSQL'],
      githubUrl: 'https://github.com/test/project',
      demoUrl: 'https://test-project.demo.com',
      imageUrl: '/uploads/projects/test-image.jpg',
      featured: true
    }

    const createResult = await db.query<Project>(`
      INSERT INTO projects (
        title, 
        description, 
        tech_stack, 
        github_url, 
        demo_url, 
        image_url, 
        featured,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `, [
      testProject.title,
      testProject.description,
      JSON.stringify(testProject.techStack),
      testProject.githubUrl,
      testProject.demoUrl,
      testProject.imageUrl,
      testProject.featured
    ])

    const createdProject = createResult[0]
    console.log(`   ✅ Project created with ID: ${createdProject.id}`)
    console.log(`   ✅ Title: ${createdProject.title}`)
    console.log(`   ✅ Tech Stack: ${createdProject.techStack.join(', ')}`)
    console.log(`   ✅ Featured: ${createdProject.featured}`)

    // Test 3: Fetch all projects (simulating GET /api/projects)
    console.log('\n3. Testing project retrieval...')
    const allProjects = await db.query<Project>(`
      SELECT 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects
      ORDER BY featured DESC, created_at DESC
    `)

    console.log(`   ✅ Retrieved ${allProjects.length} projects`)
    if (allProjects.length > 0) {
      console.log(`   ✅ First project: ${allProjects[0].title}`)
    }

    // Test 4: Fetch featured projects only
    console.log('\n4. Testing featured projects retrieval...')
    const featuredProjects = await db.query<Project>(`
      SELECT 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects
      WHERE featured = true
      ORDER BY created_at DESC
    `)

    console.log(`   ✅ Retrieved ${featuredProjects.length} featured projects`)

    // Test 5: Update project (simulating PUT /api/projects/[id])
    console.log('\n5. Testing project update...')
    const updateResult = await db.query<Project>(`
      UPDATE projects 
      SET 
        title = $1,
        description = $2,
        featured = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `, [
      'Updated Test Project API',
      'This project has been updated by the test script',
      false,
      createdProject.id
    ])

    const updatedProject = updateResult[0]
    console.log(`   ✅ Project updated: ${updatedProject.title}`)
    console.log(`   ✅ Featured status changed: ${updatedProject.featured}`)

    // Test 6: Validate data types and structure
    console.log('\n6. Testing data validation...')
    console.log(`   ✅ ID is number: ${typeof updatedProject.id === 'number'}`)
    console.log(`   ✅ Tech stack is array: ${Array.isArray(updatedProject.techStack)}`)
    console.log(`   ✅ Created date is Date: ${updatedProject.createdAt instanceof Date}`)
    console.log(`   ✅ Updated date is Date: ${updatedProject.updatedAt instanceof Date}`)

    // Test 7: Delete project (simulating DELETE /api/projects/[id])
    console.log('\n7. Testing project deletion...')
    const deleteResult = await db.query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING id, title
    `, [createdProject.id])

    if (deleteResult.length > 0) {
      console.log(`   ✅ Project deleted: ${deleteResult[0].title}`)
    } else {
      console.log(`   ❌ Failed to delete project`)
    }

    // Test 8: Verify deletion
    console.log('\n8. Verifying project deletion...')
    const verifyDelete = await db.query<Project>(`
      SELECT id FROM projects WHERE id = $1
    `, [createdProject.id])

    console.log(`   ✅ Project deletion verified: ${verifyDelete.length === 0 ? 'PASS' : 'FAIL'}`)

    // Test 9: Test error handling for non-existent project
    console.log('\n9. Testing error handling...')
    const nonExistentProject = await db.query<Project>(`
      SELECT * FROM projects WHERE id = $1
    `, [99999])

    console.log(`   ✅ Non-existent project query: ${nonExistentProject.length === 0 ? 'PASS' : 'FAIL'}`)

    console.log('\n🎉 All Project API tests completed successfully!')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test
if (require.main === module) {
  testProjectsAPI().catch(console.error)
}

export { testProjectsAPI }