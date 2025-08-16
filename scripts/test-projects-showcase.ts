#!/usr/bin/env tsx

/**
 * Test script for Projects Showcase component
 * Creates sample projects to test the dynamic projects showcase functionality
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

import { db } from '../lib/db'

interface SampleProject {
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl: string
  featured: boolean
}

const sampleProjects: SampleProject[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with user authentication, product management, shopping cart, and payment integration. Features include real-time inventory tracking, order management, and admin dashboard.",
    techStack: ["React", "Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
    githubUrl: "https://github.com/example/ecommerce-platform",
    demoUrl: "https://ecommerce-demo.example.com",
    imageUrl: "/uploads/projects/ecommerce-platform.jpg",
    featured: true
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, team collaboration features, and project tracking. Includes drag-and-drop functionality and deadline notifications.",
    techStack: ["Vue.js", "Node.js", "MongoDB", "Socket.io", "Express", "SCSS"],
    githubUrl: "https://github.com/example/task-manager",
    demoUrl: "https://tasks-demo.example.com",
    imageUrl: "/uploads/projects/task-manager.jpg",
    featured: true
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather dashboard that displays current weather conditions, forecasts, and weather maps. Features location-based weather data and customizable widgets.",
    techStack: ["JavaScript", "HTML", "CSS", "OpenWeather API", "Chart.js"],
    githubUrl: "https://github.com/example/weather-dashboard",
    demoUrl: "https://weather-demo.example.com",
    imageUrl: "/uploads/projects/weather-dashboard.jpg",
    featured: false
  },
  {
    title: "Social Media Analytics",
    description: "A comprehensive analytics platform for social media metrics with data visualization, trend analysis, and automated reporting features.",
    techStack: ["Python", "Django", "PostgreSQL", "D3.js", "Redis", "Celery"],
    githubUrl: "https://github.com/example/social-analytics",
    imageUrl: "/uploads/projects/social-analytics.jpg",
    featured: false
  },
  {
    title: "Real Estate Portal",
    description: "A modern real estate listing platform with advanced search filters, virtual tours, and agent management system. Includes map integration and property comparison tools.",
    techStack: ["Angular", "TypeScript", "C#", ".NET Core", "SQL Server", "Azure"],
    githubUrl: "https://github.com/example/real-estate-portal",
    demoUrl: "https://realestate-demo.example.com",
    imageUrl: "/uploads/projects/real-estate-portal.jpg",
    featured: false
  },
  {
    title: "Cryptocurrency Tracker",
    description: "A real-time cryptocurrency tracking application with portfolio management, price alerts, and market analysis tools. Features live price updates and historical data visualization.",
    techStack: ["React", "TypeScript", "Node.js", "WebSocket", "CoinGecko API", "Chart.js"],
    githubUrl: "https://github.com/example/crypto-tracker",
    demoUrl: "https://crypto-demo.example.com",
    imageUrl: "/uploads/projects/crypto-tracker.jpg",
    featured: true
  }
]

async function createSampleProjects() {
  try {
    console.log('🚀 Creating sample projects for testing...')

    // Clear existing projects
    await db.query('DELETE FROM projects')
    console.log('✅ Cleared existing projects')

    // Insert sample projects
    for (const project of sampleProjects) {
      const result = await db.query(`
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
        RETURNING id, title, featured
      `, [
        project.title,
        project.description,
        JSON.stringify(project.techStack),
        project.githubUrl || null,
        project.demoUrl || null,
        project.imageUrl,
        project.featured
      ])

      const createdProject = result[0]
      console.log(`✅ Created project: ${createdProject.title} (ID: ${createdProject.id}, Featured: ${createdProject.featured})`)
    }

    // Verify projects were created
    const allProjects = await db.query('SELECT COUNT(*) as count FROM projects')
    const featuredProjects = await db.query('SELECT COUNT(*) as count FROM projects WHERE featured = true')
    
    console.log(`\n📊 Summary:`)
    console.log(`   Total projects: ${allProjects[0].count}`)
    console.log(`   Featured projects: ${featuredProjects[0].count}`)
    console.log(`   Regular projects: ${allProjects[0].count - featuredProjects[0].count}`)

    console.log('\n🎉 Sample projects created successfully!')
    console.log('💡 You can now test the Projects Showcase component at http://localhost:3000')
    
  } catch (error) {
    console.error('❌ Error creating sample projects:', error)
    process.exit(1)
  }
}

async function testProjectsAPI() {
  try {
    console.log('\n🧪 Testing Projects API...')
    
    // Test GET /api/projects
    const response = await fetch('http://localhost:3000/api/projects')
    const data = await response.json()
    
    if (data.success) {
      console.log(`✅ API Response: Retrieved ${data.data.length} projects`)
      console.log(`   Featured projects: ${data.data.filter((p: any) => p.featured).length}`)
      console.log(`   Regular projects: ${data.data.filter((p: any) => !p.featured).length}`)
    } else {
      console.log(`❌ API Error: ${data.error}`)
    }
    
  } catch (error) {
    console.log(`❌ API Test failed: ${error}`)
  }
}

// Main execution
async function main() {
  await createSampleProjects()
  
  // Wait a moment for the server to be ready
  setTimeout(async () => {
    await testProjectsAPI()
    process.exit(0)
  }, 1000)
}

main().catch(console.error)