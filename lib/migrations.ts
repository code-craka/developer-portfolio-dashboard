import { db } from './db';

// Database migration utilities
export class DatabaseMigrations {
  // Create all tables with proper indexes
  static async createTables(): Promise<void> {
    try {
      // Create projects table
      await db.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          tech_stack JSONB NOT NULL,
          github_url VARCHAR(255),
          demo_url VARCHAR(255),
          image_url VARCHAR(255) NOT NULL,
          featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Create admins table for Clerk integration
      await db.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          clerk_id VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Create contacts table
      await db.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Create experiences table
      await db.query(`
        CREATE TABLE IF NOT EXISTS experiences (
          id SERIAL PRIMARY KEY,
          company VARCHAR(100) NOT NULL,
          position VARCHAR(100) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE,
          description TEXT NOT NULL,
          achievements JSONB NOT NULL,
          technologies JSONB NOT NULL,
          company_logo VARCHAR(255),
          location VARCHAR(100) NOT NULL,
          employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      console.log('✅ All database tables created successfully');
    } catch (error) {
      console.error('❌ Error creating database tables:', error);
      throw error;
    }
  }

  // Create database indexes for optimal query performance
  static async createIndexes(): Promise<void> {
    try {
      // Projects table indexes
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_projects_featured_created 
        ON projects (featured DESC, created_at DESC)
      `);
      
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_projects_created 
        ON projects (created_at DESC)
      `);

      // Admins table indexes
      await db.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_clerk_id 
        ON admins (clerk_id)
      `);
      
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_admins_email 
        ON admins (email)
      `);

      // Contacts table indexes
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_contacts_created 
        ON contacts (created_at DESC)
      `);
      
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_contacts_read 
        ON contacts (read)
      `);

      // Experiences table indexes
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_experiences_start_date 
        ON experiences (start_date DESC)
      `);
      
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_experiences_end_date 
        ON experiences (end_date DESC NULLS FIRST)
      `);

      console.log('✅ All database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating database indexes:', error);
      throw error;
    }
  }

  // Run all migrations
  static async runMigrations(): Promise<void> {
    console.log('🚀 Starting database migrations...');
    
    try {
      // Test database connection first
      const isConnected = await db.testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }
      console.log('✅ Database connection successful');

      // Create tables
      await this.createTables();
      
      // Create indexes
      await this.createIndexes();
      
      console.log('🎉 Database migrations completed successfully');
    } catch (error) {
      console.error('❌ Database migration failed:', error);
      throw error;
    }
  }

  // Drop all tables (for development/testing)
  static async dropTables(): Promise<void> {
    try {
      await db.query('DROP TABLE IF EXISTS contacts CASCADE');
      await db.query('DROP TABLE IF EXISTS experiences CASCADE');
      await db.query('DROP TABLE IF EXISTS projects CASCADE');
      await db.query('DROP TABLE IF EXISTS admins CASCADE');
      
      console.log('✅ All tables dropped successfully');
    } catch (error) {
      console.error('❌ Error dropping tables:', error);
      throw error;
    }
  }

  // Reset database (drop and recreate)
  static async resetDatabase(): Promise<void> {
    console.log('🔄 Resetting database...');
    
    try {
      await this.dropTables();
      await this.runMigrations();
      
      console.log('🎉 Database reset completed successfully');
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }

  // Check if tables exist
  static async checkTablesExist(): Promise<{ [key: string]: boolean }> {
    try {
      const tables = ['projects', 'admins', 'contacts', 'experiences'];
      const results: { [key: string]: boolean } = {};

      for (const table of tables) {
        const query = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `;
        const result = await db.query(query, [table]);
        results[table] = result[0]?.exists || false;
      }

      return results;
    } catch (error) {
      console.error('❌ Error checking table existence:', error);
      throw error;
    }
  }

  // Get database statistics
  static async getDatabaseStats(): Promise<any> {
    try {
      const stats = await db.query(`
        SELECT 
          schemaname,
          tablename,
          attname,
          n_distinct,
          correlation
        FROM pg_stats 
        WHERE schemaname = 'public'
        AND tablename IN ('projects', 'admins', 'contacts', 'experiences')
        ORDER BY tablename, attname
      `);

      const tableCounts = await db.query(`
        SELECT 
          'projects' as table_name, COUNT(*) as count FROM projects
        UNION ALL
        SELECT 
          'admins' as table_name, COUNT(*) as count FROM admins
        UNION ALL
        SELECT 
          'contacts' as table_name, COUNT(*) as count FROM contacts
        UNION ALL
        SELECT 
          'experiences' as table_name, COUNT(*) as count FROM experiences
      `);

      return {
        tableStats: stats,
        tableCounts: tableCounts
      };
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      return null;
    }
  }
}