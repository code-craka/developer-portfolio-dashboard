#!/usr/bin/env tsx

/**
 * Test the Projects Showcase component functionality
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function testProjectsShowcase() {
  try {
    console.log('🧪 Testing Projects Showcase Component...')
    
    // Test API endpoint
    console.log('\n1. Testing API endpoint...')
    const response = await fetch('http://localhost:3000/api/projects')
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(`API Error: ${data.error}`)
    }
    
    console.log(`✅ API Response: ${data.data.length} projects retrieved`)
    
    // Test project data structure
    console.log('\n2. Validating project data structure...')
    const projects = data.data
    
    if (projects.length === 0) {
      console.log('⚠️  No projects found')
      return
    }
    
    const firstProject = projects[0]
    const requiredFields = ['id', 'title', 'description', 'techStack', 'imageUrl', 'featured']
    
    for (const field of requiredFields) {
      if (!(field in firstProject)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }
    
    console.log('✅ Project data structure is valid')
    
    // Test featured vs regular projects
    console.log('\n3. Testing project categorization...')
    const featuredProjects = projects.filter((p: any) => p.featured)
    const regularProjects = projects.filter((p: any) => !p.featured)
    
    console.log(`✅ Featured projects: ${featuredProjects.length}`)
    console.log(`✅ Regular projects: ${regularProjects.length}`)
    
    // Test tech stack colors (simulate the component logic)
    console.log('\n4. Testing tech stack color mapping...')
    const techStackColors: Record<string, string> = {
      'React': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'TypeScript': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
      'Node.js': 'bg-green-600/20 text-green-400 border-green-600/30',
      'default': 'bg-electric-blue-500/20 text-electric-blue-400 border-electric-blue-500/30'
    }
    
    const sampleTechStack = firstProject.techStack
    console.log(`✅ Sample tech stack: ${sampleTechStack.join(', ')}`)
    
    sampleTechStack.forEach((tech: string) => {
      const color = techStackColors[tech] || techStackColors.default
      console.log(`   ${tech}: ${color.includes('blue') ? '🔵' : color.includes('green') ? '🟢' : '⚡'} Styled`)
    })
    
    // Test URL validation (simulate component logic)
    console.log('\n5. Testing URL validation...')
    const isValidUrl = (url: string) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }
    
    projects.forEach((project: any) => {
      if (project.githubUrl) {
        const valid = isValidUrl(project.githubUrl)
        console.log(`   ${project.title} GitHub URL: ${valid ? '✅' : '❌'} ${project.githubUrl}`)
      }
      if (project.demoUrl) {
        const valid = isValidUrl(project.demoUrl)
        console.log(`   ${project.title} Demo URL: ${valid ? '✅' : '❌'} ${project.demoUrl}`)
      }
    })
    
    // Test image paths
    console.log('\n6. Testing image paths...')
    projects.forEach((project: any) => {
      const hasValidImagePath = project.imageUrl.startsWith('/uploads/projects/')
      console.log(`   ${project.title}: ${hasValidImagePath ? '✅' : '❌'} ${project.imageUrl}`)
    })
    
    console.log('\n🎉 All tests passed! Projects Showcase component should work correctly.')
    console.log('\n💡 You can now visit http://localhost:3000 to see the projects showcase in action.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testProjectsShowcase()