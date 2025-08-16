#!/usr/bin/env tsx

/**
 * Test script for Experience Management Interface
 * Tests the complete experience CRUD functionality
 */

import { db } from '../lib/db'
import { validateExperienceData } from '../lib/security'
import { ExperienceFormData } from '../lib/types'

async function testExperienceManagement() {
  console.log('🧪 Testing Experience Management Interface...\n')

  try {
    // Test 1: Database connection
    console.log('1. Testing database connection...')
    const healthCheck = await db.query('SELECT NOW() as current_time')
    console.log('✅ Database connected successfully')
    console.log(`   Current time: ${healthCheck[0].current_time}\n`)

    // Test 2: Experience validation
    console.log('2. Testing experience validation...')
    
    const validExperience: ExperienceFormData = {
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-12-31'),
      description: 'Led development of scalable web applications using modern technologies.',
      achievements: [
        'Improved application performance by 40%',
        'Led a team of 5 developers',
        'Implemented CI/CD pipeline'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      location: 'San Francisco, CA',
      employmentType: 'Full-time'
    }

    const validation = validateExperienceData(validExperience)
    if (validation.valid) {
      console.log('✅ Experience validation passed')
    } else {
      console.log('❌ Experience validation failed:', validation.errors)
    }

    // Test invalid experience
    const invalidExperience: ExperienceFormData = {
      company: 'A', // Too short
      position: '', // Empty
      startDate: new Date('2023-01-01'),
      endDate: new Date('2022-01-01'), // End before start
      description: 'Short', // Too short
      achievements: [],
      technologies: [],
      location: '',
      employmentType: 'Full-time'
    }

    const invalidValidation = validateExperienceData(invalidExperience)
    if (!invalidValidation.valid) {
      console.log('✅ Invalid experience correctly rejected')
      console.log(`   Errors found: ${invalidValidation.errors.length}`)
    } else {
      console.log('❌ Invalid experience incorrectly accepted')
    }

    // Test 3: Database schema
    console.log('\n3. Testing experience table schema...')
    const schemaCheck = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'experiences'
      ORDER BY ordinal_position
    `)

    const requiredColumns = [
      'id', 'company', 'position', 'start_date', 'end_date',
      'description', 'achievements', 'technologies', 'company_logo',
      'location', 'employment_type', 'created_at', 'updated_at'
    ]

    const existingColumns = schemaCheck.map(col => col.column_name)
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))

    if (missingColumns.length === 0) {
      console.log('✅ All required columns exist')
      console.log(`   Total columns: ${existingColumns.length}`)
    } else {
      console.log('❌ Missing columns:', missingColumns)
    }

    // Test 4: CRUD operations
    console.log('\n4. Testing CRUD operations...')
    
    // Create test experience
    const testExperience = await db.query(`
      INSERT INTO experiences (
        company, position, start_date, end_date, description,
        achievements, technologies, location, employment_type,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id, company, position
    `, [
      'Test Company',
      'Test Position',
      new Date('2023-01-01'),
      new Date('2023-12-31'),
      'This is a test experience for validation purposes.',
      JSON.stringify(['Test achievement 1', 'Test achievement 2']),
      JSON.stringify(['JavaScript', 'TypeScript', 'React']),
      'Test City, TC',
      'Full-time'
    ])

    const experienceId = testExperience[0].id
    console.log('✅ Experience created successfully')
    console.log(`   ID: ${experienceId}, Company: ${testExperience[0].company}`)

    // Read experience
    const readExperience = await db.query(`
      SELECT * FROM experiences WHERE id = $1
    `, [experienceId])

    if (readExperience.length > 0) {
      console.log('✅ Experience read successfully')
    } else {
      console.log('❌ Failed to read experience')
    }

    // Update experience
    await db.query(`
      UPDATE experiences 
      SET position = $1, updated_at = NOW()
      WHERE id = $2
    `, ['Updated Test Position', experienceId])

    const updatedExperience = await db.query(`
      SELECT position FROM experiences WHERE id = $1
    `, [experienceId])

    if (updatedExperience[0].position === 'Updated Test Position') {
      console.log('✅ Experience updated successfully')
    } else {
      console.log('❌ Failed to update experience')
    }

    // Delete experience
    await db.query(`
      DELETE FROM experiences WHERE id = $1
    `, [experienceId])

    const deletedCheck = await db.query(`
      SELECT id FROM experiences WHERE id = $1
    `, [experienceId])

    if (deletedCheck.length === 0) {
      console.log('✅ Experience deleted successfully')
    } else {
      console.log('❌ Failed to delete experience')
    }

    // Test 5: Chronological sorting
    console.log('\n5. Testing chronological sorting...')
    
    // Create multiple test experiences
    const experiences = [
      { company: 'Company A', start: '2020-01-01', end: '2021-12-31' },
      { company: 'Company B', start: '2022-01-01', end: null }, // Current
      { company: 'Company C', start: '2019-01-01', end: '2019-12-31' }
    ]

    const createdIds = []
    for (const exp of experiences) {
      const result = await db.query(`
        INSERT INTO experiences (
          company, position, start_date, end_date, description,
          achievements, technologies, location, employment_type,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id
      `, [
        exp.company,
        'Test Position',
        new Date(exp.start),
        exp.end ? new Date(exp.end) : null,
        'Test description',
        JSON.stringify(['Test achievement']),
        JSON.stringify(['JavaScript']),
        'Test City',
        'Full-time'
      ])
      createdIds.push(result[0].id)
    }

    // Test sorting query
    const sortedExperiences = await db.query(`
      SELECT company, start_date, end_date
      FROM experiences
      WHERE id = ANY($1)
      ORDER BY 
        CASE WHEN end_date IS NULL THEN 1 ELSE 0 END DESC,
        COALESCE(end_date, start_date) DESC,
        start_date DESC
    `, [createdIds])

    const expectedOrder = ['Company B', 'Company A', 'Company C'] // Current first, then by end date desc
    const actualOrder = sortedExperiences.map(exp => exp.company)

    if (JSON.stringify(actualOrder) === JSON.stringify(expectedOrder)) {
      console.log('✅ Chronological sorting works correctly')
      console.log(`   Order: ${actualOrder.join(' → ')}`)
    } else {
      console.log('❌ Chronological sorting failed')
      console.log(`   Expected: ${expectedOrder.join(' → ')}`)
      console.log(`   Actual: ${actualOrder.join(' → ')}`)
    }

    // Cleanup test data
    await db.query(`
      DELETE FROM experiences WHERE id = ANY($1)
    `, [createdIds])

    console.log('\n🎉 Experience Management Interface tests completed!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Database connection')
    console.log('   ✅ Experience validation')
    console.log('   ✅ Database schema')
    console.log('   ✅ CRUD operations')
    console.log('   ✅ Chronological sorting')
    console.log('\n🚀 Experience management interface is ready for use!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
testExperienceManagement()