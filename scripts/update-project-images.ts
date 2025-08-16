#!/usr/bin/env tsx

/**
 * Update project image URLs to use the correct SVG placeholders
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

import { db } from '../lib/db'

const imageUpdates = [
  { oldPath: '/uploads/projects/ecommerce-platform.jpg', newPath: '/uploads/projects/ecommerce-platform.svg' },
  { oldPath: '/uploads/projects/task-manager.jpg', newPath: '/uploads/projects/task-manager.svg' },
  { oldPath: '/uploads/projects/weather-dashboard.jpg', newPath: '/uploads/projects/weather-dashboard.svg' },
  { oldPath: '/uploads/projects/social-analytics.jpg', newPath: '/uploads/projects/social-analytics.svg' },
  { oldPath: '/uploads/projects/real-estate-portal.jpg', newPath: '/uploads/projects/real-estate-portal.svg' },
  { oldPath: '/uploads/projects/crypto-tracker.jpg', newPath: '/uploads/projects/crypto-tracker.svg' }
]

async function updateProjectImages() {
  try {
    console.log('🔄 Updating project image URLs...')
    
    for (const { oldPath, newPath } of imageUpdates) {
      const result = await db.query(`
        UPDATE projects 
        SET image_url = $1, updated_at = NOW()
        WHERE image_url = $2
        RETURNING id, title, image_url
      `, [newPath, oldPath])
      
      if (result.length > 0) {
        const project = result[0]
        console.log(`✅ Updated ${project.title}: ${project.image_url}`)
      }
    }
    
    // Verify all projects have correct image URLs
    const allProjects = await db.query(`
      SELECT id, title, image_url 
      FROM projects 
      ORDER BY featured DESC, created_at DESC
    `)
    
    console.log('\n📊 Current project images:')
    allProjects.forEach(project => {
      console.log(`   ${project.title}: ${project.image_url}`)
    })
    
    console.log('\n🎉 Project image URLs updated successfully!')
    
  } catch (error) {
    console.error('❌ Error updating project images:', error)
    process.exit(1)
  }
}

updateProjectImages()