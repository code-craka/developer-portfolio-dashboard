#!/usr/bin/env tsx

/**
 * Project Structure Validation Script
 * 
 * This script validates that the project follows Next.js 15+ App Router best practices
 * and ensures consistent import patterns using TypeScript path aliases.
 */

import { readdir, stat, readFile } from 'fs/promises'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Get project root directory
const projectRoot = process.cwd()

interface ValidationResult {
  passed: boolean
  message: string
  details?: string[]
}

class ProjectStructureValidator {
  private results: ValidationResult[] = []

  /**
   * Validate that components are properly organized in /components directory
   */
  async validateComponentsOrganization(): Promise<ValidationResult> {
    try {
      const componentsPath = join(projectRoot, 'components')
      const stats = await stat(componentsPath)
      
      if (!stats.isDirectory()) {
        return {
          passed: false,
          message: 'Components directory not found at root level'
        }
      }

      // Check for expected subdirectories
      const expectedDirs = ['admin', 'sections', 'ui', 'seo']
      const actualDirs = await readdir(componentsPath, { withFileTypes: true })
      const actualDirNames = actualDirs
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const missingDirs = expectedDirs.filter(dir => !actualDirNames.includes(dir))
      
      if (missingDirs.length > 0) {
        return {
          passed: false,
          message: 'Missing expected component subdirectories',
          details: [`Missing: ${missingDirs.join(', ')}`]
        }
      }

      return {
        passed: true,
        message: 'Components properly organized in /components directory',
        details: [`Found subdirectories: ${actualDirNames.join(', ')}`]
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Error validating components organization',
        details: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  /**
   * Validate that utilities and services are in /lib directory
   */
  async validateLibOrganization(): Promise<ValidationResult> {
    try {
      const libPath = join(projectRoot, 'lib')
      const stats = await stat(libPath)
      
      if (!stats.isDirectory()) {
        return {
          passed: false,
          message: 'Lib directory not found at root level'
        }
      }

      // Check for expected files
      const expectedFiles = [
        'types.ts',
        'utils.ts',
        'db.ts',
        'clerk.ts',
        'admin-service.ts',
        'validation.ts',
        'security.ts'
      ]

      const files = await readdir(libPath)
      const missingFiles = expectedFiles.filter(file => !files.includes(file))

      if (missingFiles.length > 0) {
        return {
          passed: false,
          message: 'Missing expected utility files in /lib',
          details: [`Missing: ${missingFiles.join(', ')}`]
        }
      }

      return {
        passed: true,
        message: 'Utilities and services properly organized in /lib directory',
        details: [`Found ${files.length} files in /lib`]
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Error validating lib organization',
        details: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  /**
   * Validate TypeScript path aliases configuration
   */
  async validatePathAliases(): Promise<ValidationResult> {
    try {
      const tsconfigPath = join(projectRoot, 'tsconfig.json')
      const tsconfigContent = await readFile(tsconfigPath, 'utf-8')
      const tsconfig = JSON.parse(tsconfigContent)

      const compilerOptions = tsconfig.compilerOptions
      if (!compilerOptions) {
        return {
          passed: false,
          message: 'No compilerOptions found in tsconfig.json'
        }
      }

      // Check baseUrl
      if (compilerOptions.baseUrl !== '.') {
        return {
          passed: false,
          message: 'baseUrl should be set to "." in tsconfig.json',
          details: [`Current baseUrl: ${compilerOptions.baseUrl}`]
        }
      }

      // Check paths configuration
      const paths = compilerOptions.paths
      if (!paths || !paths['@/*']) {
        return {
          passed: false,
          message: 'Path alias @/* not configured in tsconfig.json'
        }
      }

      if (!Array.isArray(paths['@/*']) || paths['@/*'][0] !== './*') {
        return {
          passed: false,
          message: 'Path alias @/* should map to ["./*"]',
          details: [`Current mapping: ${JSON.stringify(paths['@/*'])}`]
        }
      }

      return {
        passed: true,
        message: 'TypeScript path aliases properly configured',
        details: ['baseUrl: "."', 'paths: { "@/*": ["./*"] }']
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Error validating TypeScript configuration',
        details: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  /**
   * Validate admin routes use proper route groups structure
   */
  async validateAdminRoutesStructure(): Promise<ValidationResult> {
    try {
      const adminRoutesPath = join(projectRoot, 'app', '(admin)')
      const stats = await stat(adminRoutesPath)
      
      if (!stats.isDirectory()) {
        return {
          passed: false,
          message: 'Admin route group (admin) not found in /app directory'
        }
      }

      // Check for admin layout
      const layoutPath = join(adminRoutesPath, 'layout.tsx')
      try {
        await stat(layoutPath)
      } catch {
        return {
          passed: false,
          message: 'Admin layout.tsx not found in (admin) route group'
        }
      }

      // Check for expected admin routes
      const expectedRoutes = ['dashboard', 'login', 'profile', 'projects', 'experience', 'messages']
      const actualRoutes = await readdir(adminRoutesPath, { withFileTypes: true })
      const actualRouteNames = actualRoutes
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const missingRoutes = expectedRoutes.filter(route => !actualRouteNames.includes(route))

      if (missingRoutes.length > 0) {
        return {
          passed: false,
          message: 'Missing expected admin routes',
          details: [`Missing: ${missingRoutes.join(', ')}`]
        }
      }

      return {
        passed: true,
        message: 'Admin routes properly structured using route groups',
        details: [`Found routes: ${actualRouteNames.join(', ')}`]
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Error validating admin routes structure',
        details: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  /**
   * Validate consistent import patterns using path aliases
   */
  async validateImportConsistency(): Promise<ValidationResult> {
    try {
      const issues: string[] = []
      
      // Check for relative imports that should use path aliases
      const filesToCheck = await this.getAllTsFiles()
      
      for (const filePath of filesToCheck) {
        const content = await readFile(filePath, 'utf-8')
        const lines = content.split('\n')
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          
          // Check for relative imports that go up directories
          if (line.includes('from \'../') || line.includes('from "../')) {
            const relativePath = relative(projectRoot, filePath)
            issues.push(`${relativePath}:${i + 1} - Uses relative import: ${line}`)
          }
        }
      }

      if (issues.length > 0) {
        return {
          passed: false,
          message: 'Found inconsistent import patterns',
          details: issues.slice(0, 10) // Limit to first 10 issues
        }
      }

      return {
        passed: true,
        message: 'All imports use consistent path aliases',
        details: [`Checked ${filesToCheck.length} TypeScript files`]
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Error validating import consistency',
        details: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  /**
   * Get all TypeScript files in the project
   */
  private async getAllTsFiles(): Promise<string[]> {
    const files: string[] = []
    
    const searchDirs = [
      join(projectRoot, 'app'),
      join(projectRoot, 'components'),
      join(projectRoot, 'lib')
    ]

    for (const dir of searchDirs) {
      try {
        await this.collectTsFiles(dir, files)
      } catch (error) {
        // Directory might not exist, skip
      }
    }

    return files
  }

  /**
   * Recursively collect TypeScript files
   */
  private async collectTsFiles(dir: string, files: string[]): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      
      if (entry.isDirectory()) {
        await this.collectTsFiles(fullPath, files)
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        files.push(fullPath)
      }
    }
  }

  /**
   * Run all validations
   */
  async runAllValidations(): Promise<void> {
    console.log('🔍 Running Project Structure Validation...\n')

    const validations = [
      { name: 'Components Organization', fn: () => this.validateComponentsOrganization() },
      { name: 'Lib Organization', fn: () => this.validateLibOrganization() },
      { name: 'TypeScript Path Aliases', fn: () => this.validatePathAliases() },
      { name: 'Admin Routes Structure', fn: () => this.validateAdminRoutesStructure() },
      { name: 'Import Consistency', fn: () => this.validateImportConsistency() }
    ]

    let passedCount = 0
    let totalCount = validations.length

    for (const validation of validations) {
      console.log(`📋 ${validation.name}...`)
      const result = await validation.fn()
      
      if (result.passed) {
        console.log(`✅ ${result.message}`)
        if (result.details) {
          result.details.forEach(detail => console.log(`   • ${detail}`))
        }
        passedCount++
      } else {
        console.log(`❌ ${result.message}`)
        if (result.details) {
          result.details.forEach(detail => console.log(`   • ${detail}`))
        }
      }
      console.log()
    }

    // Summary
    console.log('📊 Validation Summary:')
    console.log(`✅ Passed: ${passedCount}/${totalCount}`)
    console.log(`❌ Failed: ${totalCount - passedCount}/${totalCount}`)
    
    if (passedCount === totalCount) {
      console.log('\n🎉 All validations passed! Project structure follows Next.js 15+ best practices.')
    } else {
      console.log('\n⚠️  Some validations failed. Please review and fix the issues above.')
      process.exit(1)
    }
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ProjectStructureValidator()
  validator.runAllValidations().catch(error => {
    console.error('❌ Validation failed with error:', error)
    process.exit(1)
  })
}

export default ProjectStructureValidator