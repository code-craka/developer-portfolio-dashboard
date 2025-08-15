#!/usr/bin/env tsx

/**
 * Database Initialization Script
 * 
 * This script initializes the NeonDB PostgreSQL database with all required tables and indexes.
 * Run this script after setting up your DATABASE_URL environment variable.
 * 
 * Usage:
 *   npm run init-db
 *   or
 *   npx tsx scripts/init-db.ts
 */

import { config } from 'dotenv'

// Load environment variables FIRST
config({ path: '.env.local' })
config({ path: '.env' })

// Now import modules that depend on environment variables
import { DatabaseMigrations } from '../lib/migrations';

async function initializeDatabase() {
  console.log('🚀 Initializing Developer Portfolio Database...\n');

  try {
    // Check if tables already exist
    console.log('📋 Checking existing tables...');
    const existingTables = await DatabaseMigrations.checkTablesExist();

    console.log('Table Status:');
    Object.entries(existingTables).forEach(([table, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });
    console.log('');

    // Run migrations
    await DatabaseMigrations.runMigrations();

    // Verify tables were created
    console.log('\n📋 Verifying table creation...');
    const finalTables = await DatabaseMigrations.checkTablesExist();

    console.log('Final Table Status:');
    Object.entries(finalTables).forEach(([table, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });

    // Get database statistics
    console.log('\n📊 Database Statistics:');
    const stats = await DatabaseMigrations.getDatabaseStats();
    if (stats) {
      console.log('Table Counts:');
      stats.tableCounts.forEach((row: any) => {
        console.log(`  ${row.table_name}: ${row.count} records`);
      });
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Set up your Clerk authentication keys in .env.local');
    console.log('  2. Start the development server: npm run dev');
    console.log('  3. Access the admin dashboard at /admin/dashboard');

  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };