#!/usr/bin/env tsx

/**
 * Create placeholder images for projects
 * This script creates simple placeholder images for testing the projects showcase
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'

const projectImages = [
  'ecommerce-platform.jpg',
  'task-manager.jpg', 
  'weather-dashboard.jpg',
  'social-analytics.jpg',
  'real-estate-portal.jpg',
  'crypto-tracker.jpg'
]

// Create a simple SVG placeholder
function createPlaceholderSVG(title: string, color: string): string {
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#000000;stop-opacity:0.9" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
          fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
      ${title}
    </text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
          fill="#00D4FF" font-family="Arial, sans-serif" font-size="14">
      Project Screenshot
    </text>
  </svg>`
}

const projectTitles = [
  'E-Commerce Platform',
  'Task Management App',
  'Weather Dashboard', 
  'Social Analytics',
  'Real Estate Portal',
  'Crypto Tracker'
]

const colors = [
  '#00D4FF', // Electric blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4'  // Cyan
]

async function createPlaceholderImages() {
  try {
    console.log('🖼️  Creating placeholder images for projects...')
    
    // Ensure upload directory exists
    const uploadDir = resolve(process.cwd(), 'public/uploads/projects')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
      console.log('✅ Created uploads directory')
    }
    
    // Create placeholder images
    projectImages.forEach((filename, index) => {
      const title = projectTitles[index]
      const color = colors[index]
      const svgContent = createPlaceholderSVG(title, color)
      
      // Convert filename to SVG (we'll use SVG for simplicity)
      const svgFilename = filename.replace('.jpg', '.svg')
      const filepath = resolve(uploadDir, svgFilename)
      
      writeFileSync(filepath, svgContent)
      console.log(`✅ Created placeholder: ${svgFilename}`)
    })
    
    console.log('\n🎉 All placeholder images created successfully!')
    console.log('💡 Note: Update the database to use .svg extensions instead of .jpg')
    
  } catch (error) {
    console.error('❌ Error creating placeholder images:', error)
    process.exit(1)
  }
}

createPlaceholderImages()