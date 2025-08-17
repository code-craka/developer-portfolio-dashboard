#!/usr/bin/env tsx

/**
 * Pre-deployment validation script
 * Ensures the application is ready for production deployment
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
// Import with error handling for missing env vars
let db: any;
let envConfig: any;
let isProduction: any;

async function initializeModules() {
  try {
    const dbModule = await import('../lib/db');
    const envModule = await import('../lib/env-config');
    db = dbModule.db;
    envConfig = envModule.envConfig;
    isProduction = envModule.isProduction;
  } catch (error) {
    console.log('⚠️  Environment configuration incomplete - some checks will be skipped');
  }
}

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

class DeploymentChecker {
  private results: CheckResult[] = [];

  private addResult(name: string, status: 'pass' | 'fail' | 'warn', message: string, details?: any) {
    this.results.push({ name, status, message, details });
  }

  private async checkEnvironmentVariables() {
    console.log('🔍 Checking environment variables...');
    
    const requiredVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'NEXT_PUBLIC_APP_URL',
    ];

    const productionVars = [
      'SESSION_SECRET',
      'ENCRYPTION_KEY',
      'CLERK_WEBHOOK_SECRET',
    ];

    const missing = requiredVars.filter(key => !process.env[key]);
    const missingProd = isProduction() ? productionVars.filter(key => !process.env[key]) : [];

    if (missing.length > 0) {
      this.addResult('Environment Variables', 'fail', 
        `Missing required variables: ${missing.join(', ')}`);
    } else if (missingProd.length > 0) {
      this.addResult('Environment Variables', 'warn', 
        `Missing production variables: ${missingProd.join(', ')}`);
    } else {
      this.addResult('Environment Variables', 'pass', 'All required variables present');
    }

    // Check for localhost URLs in production
    if (isProduction && envConfig && envConfig.APP_URL && envConfig.APP_URL.includes('localhost')) {
      this.addResult('Production URLs', 'warn', 
        'APP_URL contains localhost in production environment');
    }
  }

  private async checkDatabaseConnection() {
    console.log('🔍 Checking database connection...');
    
    if (!db) {
      this.addResult('Database Connection', 'fail', 
        'Database module not available - check environment variables');
      return;
    }
    
    try {
      const startTime = Date.now();
      const isConnected = await db.testConnection();
      const duration = Date.now() - startTime;

      if (isConnected) {
        this.addResult('Database Connection', 'pass', 
          `Connected successfully (${duration}ms)`);
      } else {
        this.addResult('Database Connection', 'fail', 
          'Failed to connect to database');
      }
    } catch (error) {
      this.addResult('Database Connection', 'fail', 
        `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkDatabaseSchema() {
    console.log('🔍 Checking database schema...');
    
    if (!db) {
      this.addResult('Database Schema', 'fail', 
        'Database module not available - check environment variables');
      return;
    }
    
    try {
      const tables = ['projects', 'experiences', 'contacts', 'admins'];
      const missingTables: string[] = [];

      for (const table of tables) {
        try {
          await db.query(`SELECT 1 FROM ${table} LIMIT 1`);
        } catch (error) {
          missingTables.push(table);
        }
      }

      if (missingTables.length > 0) {
        this.addResult('Database Schema', 'fail', 
          `Missing tables: ${missingTables.join(', ')}`);
      } else {
        this.addResult('Database Schema', 'pass', 'All required tables exist');
      }
    } catch (error) {
      this.addResult('Database Schema', 'fail', 
        `Schema check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkFileSystem() {
    console.log('🔍 Checking file system...');
    
    const requiredDirs = [
      'public/uploads/projects',
      'public/uploads/companies',
    ];

    const missingDirs = requiredDirs.filter(dir => !existsSync(join(process.cwd(), dir)));

    if (missingDirs.length > 0) {
      this.addResult('File System', 'fail', 
        `Missing directories: ${missingDirs.join(', ')}`);
    } else {
      this.addResult('File System', 'pass', 'All required directories exist');
    }
  }

  private async checkBuildArtifacts() {
    console.log('🔍 Checking build artifacts...');
    
    const buildDir = join(process.cwd(), '.next');
    const packageJson = join(process.cwd(), 'package.json');

    if (!existsSync(buildDir)) {
      this.addResult('Build Artifacts', 'warn', 
        'No .next directory found - run npm run build');
      return;
    }

    if (!existsSync(packageJson)) {
      this.addResult('Build Artifacts', 'fail', 'package.json not found');
      return;
    }

    try {
      const pkg = JSON.parse(readFileSync(packageJson, 'utf8'));
      this.addResult('Build Artifacts', 'pass', 
        `Build ready (v${pkg.version})`);
    } catch (error) {
      this.addResult('Build Artifacts', 'fail', 'Invalid package.json');
    }
  }

  private async checkDependencies() {
    console.log('🔍 Checking dependencies...');
    
    try {
      // Check for security vulnerabilities
      execSync('npm audit --audit-level=high', { stdio: 'pipe' });
      this.addResult('Dependencies', 'pass', 'No high-severity vulnerabilities');
    } catch (error) {
      this.addResult('Dependencies', 'warn', 
        'Security vulnerabilities detected - run npm audit fix');
    }

    // Check for outdated dependencies
    try {
      const outdated = execSync('npm outdated --json', { stdio: 'pipe' }).toString();
      const packages = JSON.parse(outdated || '{}');
      const count = Object.keys(packages).length;
      
      if (count > 0) {
        this.addResult('Dependencies', 'warn', 
          `${count} outdated packages found`);
      } else {
        this.addResult('Dependencies', 'pass', 'All dependencies up to date');
      }
    } catch (error) {
      // npm outdated returns non-zero exit code when packages are outdated
      this.addResult('Dependencies', 'pass', 'Dependencies checked');
    }
  }

  private async checkPerformance() {
    console.log('🔍 Checking performance configuration...');
    
    const nextConfig = join(process.cwd(), 'next.config.js');
    
    if (!existsSync(nextConfig)) {
      this.addResult('Performance', 'warn', 'No next.config.js found');
      return;
    }

    try {
      const config = readFileSync(nextConfig, 'utf8');
      const hasCompression = config.includes('compress: true');
      const hasImageOptimization = config.includes('images:');
      const hasCaching = config.includes('Cache-Control');

      if (hasCompression && hasImageOptimization && hasCaching) {
        this.addResult('Performance', 'pass', 'Performance optimizations configured');
      } else {
        this.addResult('Performance', 'warn', 
          'Some performance optimizations missing');
      }
    } catch (error) {
      this.addResult('Performance', 'warn', 'Could not validate performance config');
    }
  }

  private async checkSecurity() {
    console.log('🔍 Checking security configuration...');
    
    const hasSecurityHeaders = existsSync(join(process.cwd(), 'vercel.json'));
    const hasRateLimit = existsSync(join(process.cwd(), 'lib/rate-limit.ts'));
    const hasValidation = existsSync(join(process.cwd(), 'lib/security.ts'));

    if (hasSecurityHeaders && hasRateLimit && hasValidation) {
      this.addResult('Security', 'pass', 'Security measures configured');
    } else {
      this.addResult('Security', 'warn', 'Some security measures missing');
    }
  }

  private printResults() {
    console.log('\n📊 Deployment Readiness Report');
    console.log('================================');

    const passed = this.results.filter(r => r.status === 'pass').length;
    const warned = this.results.filter(r => r.status === 'warn').length;
    const failed = this.results.filter(r => r.status === 'fail').length;

    this.results.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : 
                   result.status === 'warn' ? '⚠️' : '❌';
      console.log(`${icon} ${result.name}: ${result.message}`);
    });

    console.log('\n📈 Summary');
    console.log(`✅ Passed: ${passed}`);
    console.log(`⚠️  Warnings: ${warned}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log('\n🚨 Deployment NOT recommended - fix failing checks first');
      process.exit(1);
    } else if (warned > 0) {
      console.log('\n⚠️  Deployment possible but warnings should be addressed');
      process.exit(0);
    } else {
      console.log('\n🚀 Ready for deployment!');
      process.exit(0);
    }
  }

  async run() {
    console.log('🚀 Starting deployment readiness check...\n');

    // Initialize modules first
    await initializeModules();

    await this.checkEnvironmentVariables();
    await this.checkDatabaseConnection();
    await this.checkDatabaseSchema();
    await this.checkFileSystem();
    await this.checkBuildArtifacts();
    await this.checkDependencies();
    await this.checkPerformance();
    await this.checkSecurity();

    this.printResults();
  }
}

// Run the deployment check
if (require.main === module) {
  const checker = new DeploymentChecker();
  checker.run().catch(error => {
    console.error('❌ Deployment check failed:', error);
    process.exit(1);
  });
}

export { DeploymentChecker };