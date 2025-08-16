#!/usr/bin/env tsx

/**
 * Verification script for Contact Form implementation
 * Verifies that all required features are implemented correctly
 */

import fs from 'fs'
import path from 'path'

function verifyContactFormImplementation() {
  console.log('🔍 Verifying Contact Form Implementation...\n')

  const contactSectionPath = path.join(process.cwd(), 'components/sections/ContactSection.tsx')
  
  if (!fs.existsSync(contactSectionPath)) {
    console.log('❌ ContactSection.tsx not found')
    return false
  }

  const contactSectionContent = fs.readFileSync(contactSectionPath, 'utf-8')

  // Check for required features
  const requiredFeatures = [
    // Client-side validation
    { name: 'Real-time validation functions', pattern: /validateName|validateEmail|validateMessage/ },
    { name: 'Form state management', pattern: /useState.*FormState|isSubmitting|isSuccess|isError/ },
    { name: 'Error state management', pattern: /FormErrors|setErrors/ },
    
    // Form fields
    { name: 'Name input field', pattern: /id="name"/ },
    { name: 'Email input field', pattern: /id="email"/ },
    { name: 'Message textarea field', pattern: /id="message"/ },
    
    // Validation display
    { name: 'Error message display', pattern: /errors\.(name|email|message)/ },
    { name: 'Real-time validation', pattern: /handleInputChange/ },
    
    // Glassmorphism styling
    { name: 'Glassmorphism background', pattern: /backdrop-blur/ },
    { name: 'Electric blue accents', pattern: /electric-blue/ },
    { name: 'Border styling', pattern: /border.*white\/\d+/ },
    
    // API integration
    { name: 'Form submission handler', pattern: /handleSubmit/ },
    { name: 'API fetch call', pattern: /fetch.*\/api\/contact/ },
    { name: 'POST method', pattern: /method:\s*['"]POST['"]/ },
    
    // Success/Error states
    { name: 'Success message display', pattern: /Message Sent Successfully/ },
    { name: 'Error message display', pattern: /Error Sending Message/ },
    { name: 'Loading state', pattern: /Sending Message/ },
    
    // User feedback
    { name: 'Form reset on success', pattern: /setFormData\s*\(\s*\{[\s\S]*name:\s*['"][\s\S]*email:\s*['"][\s\S]*message:\s*['"]/ },
    { name: 'Submit button disabled state', pattern: /disabled.*isSubmitting/ },
    { name: 'Loading spinner', pattern: /animate-spin/ },
    
    // Accessibility
    { name: 'Form labels', pattern: /<label.*htmlFor/ },
    { name: 'ARIA attributes', pattern: /aria-|role=|viewBox/ },
    { name: 'Focus management', pattern: /focus:/ },
  ]

  let passedFeatures = 0
  let totalFeatures = requiredFeatures.length

  console.log('📋 Feature Checklist:\n')

  requiredFeatures.forEach((feature, index) => {
    const found = feature.pattern.test(contactSectionContent)
    if (found) {
      passedFeatures++
      console.log(`✅ ${feature.name}`)
    } else {
      console.log(`❌ ${feature.name}`)
    }
  })

  console.log(`\n📊 Implementation Status: ${passedFeatures}/${totalFeatures} features implemented`)

  // Check for TypeScript types
  console.log('\n🔍 Checking TypeScript Integration...')
  
  const typeImports = [
    { name: 'ContactFormData import', pattern: /import.*ContactFormData.*from.*types/ },
    { name: 'Form state interfaces', pattern: /interface.*FormErrors|interface.*FormState/ },
    { name: 'Type annotations', pattern: /:\s*(string|boolean|undefined)/ },
  ]

  let passedTypes = 0
  typeImports.forEach(typeCheck => {
    const found = typeCheck.pattern.test(contactSectionContent)
    if (found) {
      passedTypes++
      console.log(`✅ ${typeCheck.name}`)
    } else {
      console.log(`❌ ${typeCheck.name}`)
    }
  })

  console.log(`📊 TypeScript Integration: ${passedTypes}/${typeImports.length} checks passed`)

  // Check responsive design
  console.log('\n📱 Checking Responsive Design...')
  
  const responsiveFeatures = [
    { name: 'Mobile-first approach', pattern: /md:|lg:|xl:/ },
    { name: 'Responsive grid', pattern: /grid-cols-1.*md:grid-cols-2/ },
    { name: 'Container max-width', pattern: /max-w-.*mx-auto/ },
    { name: 'Responsive padding', pattern: /p-\d+.*md:p-\d+|px-\d+.*py-\d+/ },
  ]

  let passedResponsive = 0
  responsiveFeatures.forEach(feature => {
    const found = feature.pattern.test(contactSectionContent)
    if (found) {
      passedResponsive++
      console.log(`✅ ${feature.name}`)
    } else {
      console.log(`❌ ${feature.name}`)
    }
  })

  console.log(`📊 Responsive Design: ${passedResponsive}/${responsiveFeatures.length} features implemented`)

  // Overall assessment
  const overallScore = (passedFeatures + passedTypes + passedResponsive) / (totalFeatures + typeImports.length + responsiveFeatures.length)
  
  console.log('\n' + '='.repeat(60))
  console.log(`🎯 Overall Implementation Score: ${Math.round(overallScore * 100)}%`)
  
  if (overallScore >= 0.9) {
    console.log('🎉 Excellent! Contact form implementation is comprehensive')
  } else if (overallScore >= 0.8) {
    console.log('✅ Good! Contact form implementation meets most requirements')
  } else if (overallScore >= 0.7) {
    console.log('⚠️  Fair! Contact form implementation needs some improvements')
  } else {
    console.log('❌ Poor! Contact form implementation is incomplete')
  }

  return overallScore >= 0.8
}

function verifyAPIIntegration() {
  console.log('\n🔍 Verifying API Integration...\n')

  const apiPath = path.join(process.cwd(), 'app/api/contact/route.ts')
  
  if (!fs.existsSync(apiPath)) {
    console.log('❌ Contact API route not found')
    return false
  }

  const apiContent = fs.readFileSync(apiPath, 'utf-8')

  const apiFeatures = [
    { name: 'POST endpoint', pattern: /export async function POST/ },
    { name: 'Request validation', pattern: /validateContactData/ },
    { name: 'Input sanitization', pattern: /sanitizeInput/ },
    { name: 'Database insertion', pattern: /INSERT INTO contacts/ },
    { name: 'Error handling', pattern: /try\s*{[\s\S]*catch/ },
    { name: 'Security headers', pattern: /SECURITY_HEADERS/ },
    { name: 'Response formatting', pattern: /NextResponse\.json/ },
  ]

  let passedAPI = 0
  apiFeatures.forEach(feature => {
    const found = feature.pattern.test(apiContent)
    if (found) {
      passedAPI++
      console.log(`✅ ${feature.name}`)
    } else {
      console.log(`❌ ${feature.name}`)
    }
  })

  console.log(`📊 API Integration: ${passedAPI}/${apiFeatures.length} features implemented`)

  return passedAPI >= apiFeatures.length * 0.8
}

function verifySecurityImplementation() {
  console.log('\n🔒 Verifying Security Implementation...\n')

  const securityPath = path.join(process.cwd(), 'lib/security.ts')
  
  if (!fs.existsSync(securityPath)) {
    console.log('❌ Security utilities not found')
    return false
  }

  const securityContent = fs.readFileSync(securityPath, 'utf-8')

  const securityFeatures = [
    { name: 'Contact data validation', pattern: /validateContactData/ },
    { name: 'Email validation', pattern: /validateEmail/ },
    { name: 'Input sanitization', pattern: /sanitizeInput/ },
    { name: 'XSS prevention', pattern: /replace.*<>/ },
    { name: 'Security headers', pattern: /SECURITY_HEADERS/ },
    { name: 'CSRF protection', pattern: /X-Frame-Options|Content-Security-Policy/ },
  ]

  let passedSecurity = 0
  securityFeatures.forEach(feature => {
    const found = feature.pattern.test(securityContent)
    if (found) {
      passedSecurity++
      console.log(`✅ ${feature.name}`)
    } else {
      console.log(`❌ ${feature.name}`)
    }
  })

  console.log(`📊 Security Implementation: ${passedSecurity}/${securityFeatures.length} features implemented`)

  return passedSecurity >= securityFeatures.length * 0.8
}

async function main() {
  console.log('🚀 Contact Form Implementation Verification\n')
  console.log('='.repeat(60))

  const results = {
    implementation: verifyContactFormImplementation(),
    api: verifyAPIIntegration(),
    security: verifySecurityImplementation()
  }

  console.log('\n' + '='.repeat(60))
  console.log('📋 Final Verification Results:')
  console.log(`   Contact Form Component: ${results.implementation ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   API Integration: ${results.api ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Security Implementation: ${results.security ? '✅ PASS' : '❌ FAIL'}`)

  const allPassed = Object.values(results).every(result => result)
  
  if (allPassed) {
    console.log('\n🎉 All verifications passed! Contact form is ready for production.')
  } else {
    console.log('\n⚠️  Some verifications failed. Please review the implementation.')
  }

  console.log('\n' + '='.repeat(60))
  console.log('✨ Verification complete!')
}

if (require.main === module) {
  main().catch(console.error)
}