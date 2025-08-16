#!/usr/bin/env tsx

/**
 * Add Sample Experience Data
 * This script adds sample experience data to test the timeline component
 */

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

import { db } from '../lib/db'

async function addSampleExperiences() {
  console.log('🧪 Adding sample experience data for testing...\n')

  const sampleExperiences = [
    {
      company: 'TechCorp Solutions',
      position: 'Senior Full Stack Developer',
      startDate: new Date('2022-01-15'),
      endDate: null, // Current position
      description: 'Leading development of modern web applications using React, Node.js, and cloud technologies. Responsible for architecture decisions and mentoring junior developers.',
      achievements: [
        'Increased application performance by 40% through optimization',
        'Led migration to microservices architecture',
        'Mentored 5 junior developers',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ],
      technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'],
      location: 'San Francisco, CA',
      employmentType: 'Full-time'
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2021-12-31'),
      description: 'Developed responsive web applications and mobile-first interfaces. Collaborated with design team to implement pixel-perfect UI components.',
      achievements: [
        'Built component library used across 3 products',
        'Improved mobile performance by 50%',
        'Implemented accessibility standards (WCAG 2.1)',
        'Reduced bundle size by 30% through code splitting'
      ],
      technologies: ['React', 'JavaScript', 'SCSS', 'Webpack', 'Jest', 'Figma'],
      location: 'Austin, TX',
      employmentType: 'Full-time'
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      startDate: new Date('2019-03-01'),
      endDate: new Date('2020-05-31'),
      description: 'Provided web development services to small businesses and startups. Built custom websites and e-commerce solutions.',
      achievements: [
        'Delivered 15+ successful projects',
        'Maintained 98% client satisfaction rate',
        'Built e-commerce platform generating $100K+ revenue',
        'Established long-term partnerships with 5 clients'
      ],
      technologies: ['WordPress', 'PHP', 'JavaScript', 'MySQL', 'WooCommerce'],
      location: 'Remote',
      employmentType: 'Freelance'
    },
    {
      company: 'Digital Agency Inc',
      position: 'Junior Developer',
      startDate: new Date('2018-08-01'),
      endDate: new Date('2019-02-28'),
      description: 'Started career as junior developer working on client websites and learning modern web development practices.',
      achievements: [
        'Completed 20+ client projects',
        'Learned React and modern JavaScript',
        'Contributed to agency\'s internal tools',
        'Received "Rising Star" award'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap', 'Git'],
      location: 'New York, NY',
      employmentType: 'Full-time'
    }
  ]

  try {
    // Check if experiences already exist
    const existingExperiences = await db.query('SELECT COUNT(*) as count FROM experiences')
    const count = existingExperiences[0]?.count || 0

    if (count > 0) {
      console.log(`⚠️  Found ${count} existing experiences. Skipping sample data insertion.`)
      console.log('   To reset and add sample data, delete existing experiences first.')
      return
    }

    console.log('📝 Inserting sample experiences...')

    for (const experience of sampleExperiences) {
      await db.query(`
        INSERT INTO experiences (
          company, 
          position, 
          start_date, 
          end_date, 
          description, 
          achievements, 
          technologies, 
          location,
          employment_type,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      `, [
        experience.company,
        experience.position,
        experience.startDate,
        experience.endDate,
        experience.description,
        JSON.stringify(experience.achievements),
        JSON.stringify(experience.technologies),
        experience.location,
        experience.employmentType
      ])

      console.log(`✅ Added: ${experience.position} at ${experience.company}`)
    }

    console.log('\n🎉 Sample experience data added successfully!')
    console.log('\n📋 Summary:')
    console.log(`   - Added ${sampleExperiences.length} experience entries`)
    console.log('   - 1 current position (no end date)')
    console.log('   - Mix of employment types (Full-time, Freelance)')
    console.log('   - Rich achievement and technology data')
    console.log('\n🌐 Visit http://localhost:3000 to see the experience timeline!')

  } catch (error) {
    console.error('\n❌ Failed to add sample experiences:')
    console.error(error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  addSampleExperiences()
}

export { addSampleExperiences }