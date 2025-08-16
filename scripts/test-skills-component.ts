#!/usr/bin/env tsx

/**
 * Test script for Skills Grid Component
 * Verifies the implementation meets all task requirements
 */

import { readFileSync } from 'fs'
import { join } from 'path'

interface TestResult {
  name: string
  passed: boolean
  details?: string
}

function runTests(): TestResult[] {
  const results: TestResult[] = []
  
  try {
    // Read the SkillsSection component
    const skillsPath = join(process.cwd(), 'components/sections/SkillsSection.tsx')
    const skillsContent = readFileSync(skillsPath, 'utf-8')
    
    // Test 1: Component exists and is properly structured
    results.push({
      name: 'Component exists and exports default',
      passed: skillsContent.includes('export default function SkillsSection')
    })
    
    // Test 2: Uses Framer Motion for animations
    results.push({
      name: 'Uses Framer Motion for animations',
      passed: skillsContent.includes("import { motion } from 'framer-motion'") &&
              skillsContent.includes('motion.div')
    })
    
    // Test 3: Has categorized skill display
    results.push({
      name: 'Has categorized skill display (Frontend, Backend, Tools, Other)',
      passed: skillsContent.includes('Frontend') &&
              skillsContent.includes('Backend') &&
              skillsContent.includes('Tools') &&
              skillsContent.includes('Other')
    })
    
    // Test 4: Implements icon-based skill representation
    results.push({
      name: 'Implements icon-based skill representation',
      passed: skillsContent.includes('icon:') &&
              skillsContent.includes('skill.icon')
    })
    
    // Test 5: Has hover effects
    results.push({
      name: 'Has hover effects',
      passed: skillsContent.includes('whileHover') &&
              skillsContent.includes('hover:') &&
              skillsContent.includes('group-hover:')
    })
    
    // Test 6: Uses glassmorphism styling
    results.push({
      name: 'Uses glassmorphism styling',
      passed: skillsContent.includes('backdrop-blur') &&
              skillsContent.includes('bg-black/') &&
              skillsContent.includes('border-white/')
    })
    
    // Test 7: Has responsive grid layout
    results.push({
      name: 'Has responsive grid layout',
      passed: skillsContent.includes('grid-cols-2') &&
              skillsContent.includes('sm:grid-cols-') &&
              skillsContent.includes('md:grid-cols-') &&
              skillsContent.includes('lg:grid-cols-')
    })
    
    // Test 8: Uses electric blue accents
    results.push({
      name: 'Uses electric blue accents',
      passed: skillsContent.includes('electric-blue') &&
              skillsContent.includes('shadow-electric')
    })
    
    // Test 9: Has skill level progress bars
    results.push({
      name: 'Has skill level progress bars',
      passed: skillsContent.includes('level:') &&
              skillsContent.includes('whileInView={{ width: `${skill.level}%` }}')
    })
    
    // Test 10: Uses ScrollAnimation and StaggerAnimation
    results.push({
      name: 'Uses ScrollAnimation and StaggerAnimation',
      passed: skillsContent.includes('ScrollAnimation') &&
              skillsContent.includes('StaggerAnimation')
    })
    
    // Test 11: Has proper section structure with id
    results.push({
      name: 'Has proper section structure with id="skills"',
      passed: skillsContent.includes('id="skills"') &&
              skillsContent.includes('<section')
    })
    
    // Test 12: Has comprehensive skill data
    results.push({
      name: 'Has comprehensive skill data with multiple categories',
      passed: skillsContent.includes('skillCategories') &&
              skillsContent.includes('React') &&
              skillsContent.includes('Node.js') &&
              skillsContent.includes('Git')
    })
    
  } catch (error) {
    results.push({
      name: 'Component file accessibility',
      passed: false,
      details: `Error reading component: ${error}`
    })
  }
  
  return results
}

function main() {
  console.log('🧪 Testing Skills Grid Component Implementation\n')
  
  const results = runTests()
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌'
    console.log(`${status} ${result.name}`)
    if (result.details) {
      console.log(`   ${result.details}`)
    }
  })
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! Skills Grid Component implementation is complete.')
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.')
    process.exit(1)
  }
}

main()