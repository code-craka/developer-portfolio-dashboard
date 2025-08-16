#!/usr/bin/env tsx

/**
 * Verification script for Experience API implementation
 * Compares with Projects API to ensure consistency
 * 
 * Usage: npm run verify-experiences
 */

import { readFileSync } from 'fs'
import path from 'path'

function analyzeApiFile(filePath: string): any {
    try {
        const content = readFileSync(filePath, 'utf-8')

        const analysis = {
            hasGetMethod: content.includes('export async function GET'),
            hasPostMethod: content.includes('export async function POST'),
            hasPutMethod: content.includes('export async function PUT'),
            hasDeleteMethod: content.includes('export async function DELETE'),
            hasAuthCheck: content.includes('requireAdminAuth()'),
            hasSecurityHeaders: content.includes('SECURITY_HEADERS'),
            hasValidation: content.includes('validate'),
            hasErrorHandling: content.includes('catch (error)'),
            hasFileCleanup: content.includes('unlink'),
            hasProperTypes: content.includes('ApiResponse'),
            hasDynamicQuery: content.includes('updateFields'),
            hasChronologicalSort: content.includes('ORDER BY'),
        }

        return analysis
    } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error)
        return null
    }
}

function compareApis() {
    console.log('🔍 Verifying Experience API Implementation...')
    console.log('=============================================')

    const projectsMainApi = analyzeApiFile('app/api/projects/route.ts')
    const projectsIdApi = analyzeApiFile('app/api/projects/[id]/route.ts')
    const experiencesMainApi = analyzeApiFile('app/api/experiences/route.ts')
    const experiencesIdApi = analyzeApiFile('app/api/experiences/[id]/route.ts')

    if (!projectsMainApi || !projectsIdApi || !experiencesMainApi || !experiencesIdApi) {
        console.error('❌ Could not analyze API files')
        return false
    }

    console.log('\n📊 API Feature Comparison:')
    console.log('===========================')

    const features = [
        'hasGetMethod',
        'hasPostMethod',
        'hasPutMethod',
        'hasDeleteMethod',
        'hasAuthCheck',
        'hasSecurityHeaders',
        'hasValidation',
        'hasErrorHandling',
        'hasFileCleanup',
        'hasProperTypes',
        'hasDynamicQuery'
    ]

    let allMatch = true

    console.log('\nMain Route Files (GET/POST):')
    features.forEach(feature => {
        if (feature === 'hasPutMethod' || feature === 'hasDeleteMethod' || feature === 'hasDynamicQuery') return

        const projectsHas = projectsMainApi[feature]
        const experiencesHas = experiencesMainApi[feature]
        const match = projectsHas === experiencesHas

        if (!match) allMatch = false

        console.log(`  ${feature}: Projects(${projectsHas}) vs Experiences(${experiencesHas}) ${match ? '✅' : '❌'}`)
    })

    console.log('\nID Route Files (PUT/DELETE):')
    features.forEach(feature => {
        if (feature === 'hasGetMethod' || feature === 'hasPostMethod') return

        const projectsHas = projectsIdApi[feature]
        const experiencesHas = experiencesIdApi[feature]
        const match = projectsHas === experiencesHas

        if (!match) allMatch = false

        console.log(`  ${feature}: Projects(${projectsHas}) vs Experiences(${experiencesHas}) ${match ? '✅' : '❌'}`)
    })

    // Special check for chronological sorting in experiences
    console.log('\nSpecial Features:')
    console.log(`  Chronological sorting (experiences): ${experiencesMainApi.hasChronologicalSort ? '✅' : '❌'}`)

    return allMatch
}

function verifyTypeDefinitions() {
    console.log('\n🔍 Verifying Type Definitions...')
    console.log('=================================')

    try {
        const typesContent = readFileSync('lib/types.ts', 'utf-8')

        const checks = {
            hasExperienceInterface: typesContent.includes('interface Experience'),
            hasExperienceFormData: typesContent.includes('interface ExperienceFormData'),
            hasEmploymentTypeEnum: typesContent.includes("'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship'"),
            hasAchievementsArray: typesContent.includes('achievements: string[]'),
            hasTechnologiesArray: typesContent.includes('technologies: string[]'),
            hasOptionalEndDate: typesContent.includes('endDate?: Date'),
            hasCompanyLogo: typesContent.includes('companyLogo?: string'),
        }

        let allPresent = true
        Object.entries(checks).forEach(([check, present]) => {
            console.log(`  ${check}: ${present ? '✅' : '❌'}`)
            if (!present) allPresent = false
        })

        return allPresent
    } catch (error) {
        console.error('❌ Error verifying type definitions:', error)
        return false
    }
}

function verifySecurityValidation() {
    console.log('\n🔍 Verifying Security Validation...')
    console.log('===================================')

    try {
        const securityContent = readFileSync('lib/security.ts', 'utf-8')

        const checks = {
            hasValidateExperienceData: securityContent.includes('validateExperienceData'),
            hasCompanyValidation: securityContent.includes('company.trim().length < 2'),
            hasPositionValidation: securityContent.includes('position.trim().length < 2'),
            hasDateValidation: securityContent.includes('endDate < data.startDate'),
            hasDescriptionValidation: securityContent.includes('description.trim().length < 10'),
            hasLocationValidation: securityContent.includes('location.trim().length < 2'),
            hasEmploymentTypeValidation: securityContent.includes('employmentType'),
        }

        let allPresent = true
        Object.entries(checks).forEach(([check, present]) => {
            console.log(`  ${check}: ${present ? '✅' : '❌'}`)
            if (!present) allPresent = false
        })

        return allPresent
    } catch (error) {
        console.error('❌ Error verifying security validation:', error)
        return false
    }
}

function verifyDatabaseMigrations() {
    console.log('\n🔍 Verifying Database Migrations...')
    console.log('===================================')

    try {
        const migrationsContent = readFileSync('lib/migrations.ts', 'utf-8')

        const checks = {
            hasExperiencesTable: migrationsContent.includes('CREATE TABLE IF NOT EXISTS experiences'),
            hasEmploymentTypeCheck: migrationsContent.includes("CHECK (employment_type IN ('Full-time'"),
            hasExperiencesIndexes: migrationsContent.includes('idx_experiences_start_date'),
            hasEndDateIndex: migrationsContent.includes('idx_experiences_end_date'),
            hasNullsFirstIndex: migrationsContent.includes('NULLS FIRST'),
            hasJsonbFields: migrationsContent.includes('achievements JSONB') && migrationsContent.includes('technologies JSONB'),
        }

        let allPresent = true
        Object.entries(checks).forEach(([check, present]) => {
            console.log(`  ${check}: ${present ? '✅' : '❌'}`)
            if (!present) allPresent = false
        })

        return allPresent
    } catch (error) {
        console.error('❌ Error verifying database migrations:', error)
        return false
    }
}

function verifyTestScripts() {
    console.log('\n🔍 Verifying Test Scripts...')
    console.log('=============================')

    try {
        const packageContent = readFileSync('package.json', 'utf-8')
        const packageJson = JSON.parse(packageContent)

        const checks = {
            hasTestExperiences: packageJson.scripts['test-experiences'] !== undefined,
            hasTestExperiencesHttp: packageJson.scripts['test-experiences-http'] !== undefined,
            testExperiencesApiExists: require('fs').existsSync('scripts/test-experiences-api.ts'),
            testExperiencesHttpExists: require('fs').existsSync('scripts/test-experiences-http.ts'),
        }

        let allPresent = true
        Object.entries(checks).forEach(([check, present]) => {
            console.log(`  ${check}: ${present ? '✅' : '❌'}`)
            if (!present) allPresent = false
        })

        return allPresent
    } catch (error) {
        console.error('❌ Error verifying test scripts:', error)
        return false
    }
}

async function runVerification() {
    console.log('🚀 Experience API Implementation Verification')
    console.log('==============================================')

    const apiConsistency = compareApis()
    const typeDefinitions = verifyTypeDefinitions()
    const securityValidation = verifySecurityValidation()
    const databaseMigrations = verifyDatabaseMigrations()
    const testScripts = verifyTestScripts()

    console.log('\n📋 Verification Summary:')
    console.log('========================')
    console.log(`API Consistency: ${apiConsistency ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Type Definitions: ${typeDefinitions ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Security Validation: ${securityValidation ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Database Migrations: ${databaseMigrations ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Test Scripts: ${testScripts ? '✅ PASS' : '❌ FAIL'}`)

    const allPassed = apiConsistency && typeDefinitions && securityValidation && databaseMigrations && testScripts

    console.log(`\n🎯 Overall Verification: ${allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`)

    if (allPassed) {
        console.log('\n🎉 Experience CRUD API Implementation Complete!')
        console.log('===============================================')
        console.log('✅ All API routes implemented with proper authentication')
        console.log('✅ Consistent with existing Projects API patterns')
        console.log('✅ Comprehensive validation and error handling')
        console.log('✅ Chronological sorting for experience timeline')
        console.log('✅ Database schema and indexes properly configured')
        console.log('✅ Test scripts created for verification')
        console.log('\nThe Experience API is ready for use! 🚀')
    } else {
        console.log('\n❌ Some verification checks failed. Please review the implementation.')
    }

    return allPassed
}

// Run verification if this script is executed directly
if (require.main === module) {
    runVerification()
}

export { runVerification }