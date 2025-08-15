import { db } from './db';
import { DatabaseMigrations } from './migrations';

export interface DatabaseHealthCheck {
  connected: boolean;
  tablesExist: { [key: string]: boolean };
  indexesExist: boolean;
  lastChecked: Date;
  error?: string;
}

export class DatabaseHealth {
  // Perform comprehensive database health check
  static async checkHealth(): Promise<DatabaseHealthCheck> {
    const healthCheck: DatabaseHealthCheck = {
      connected: false,
      tablesExist: {},
      indexesExist: false,
      lastChecked: new Date()
    };

    try {
      // Test basic connection
      healthCheck.connected = await db.testConnection();
      
      if (!healthCheck.connected) {
        healthCheck.error = 'Database connection failed';
        return healthCheck;
      }

      // Check if all required tables exist
      healthCheck.tablesExist = await DatabaseMigrations.checkTablesExist();
      
      // Check if all tables exist
      const allTablesExist = Object.values(healthCheck.tablesExist).every(exists => exists);
      
      if (!allTablesExist) {
        healthCheck.error = 'Some required tables are missing';
        return healthCheck;
      }

      // Check if indexes exist (simplified check)
      healthCheck.indexesExist = await this.checkIndexesExist();

      return healthCheck;
    } catch (error) {
      healthCheck.error = error instanceof Error ? error.message : 'Unknown error';
      return healthCheck;
    }
  }

  // Check if critical indexes exist
  private static async checkIndexesExist(): Promise<boolean> {
    try {
      const indexQuery = `
        SELECT COUNT(*) as index_count
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename IN ('projects', 'admins', 'contacts', 'experiences')
      `;
      
      const result = await db.query(indexQuery);
      const indexCount = parseInt(result[0]?.index_count || '0');
      
      // We expect at least 8 indexes (2 per table minimum)
      return indexCount >= 8;
    } catch (error) {
      console.error('Error checking indexes:', error);
      return false;
    }
  }

  // Auto-repair database if issues are found
  static async autoRepair(): Promise<{ success: boolean; message: string }> {
    try {
      const health = await this.checkHealth();
      
      if (health.connected && Object.values(health.tablesExist).every(exists => exists) && health.indexesExist) {
        return { success: true, message: 'Database is healthy, no repair needed' };
      }

      console.log('🔧 Database issues detected, attempting auto-repair...');
      
      // Run migrations to fix missing tables/indexes
      await DatabaseMigrations.runMigrations();
      
      // Verify repair was successful
      const postRepairHealth = await this.checkHealth();
      
      if (postRepairHealth.connected && 
          Object.values(postRepairHealth.tablesExist).every(exists => exists) && 
          postRepairHealth.indexesExist) {
        return { success: true, message: 'Database successfully repaired' };
      } else {
        return { success: false, message: 'Database repair failed, manual intervention required' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Database repair failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Get detailed database information
  static async getDatabaseInfo(): Promise<any> {
    try {
      const health = await this.checkHealth();
      const stats = await DatabaseMigrations.getDatabaseStats();
      
      // Get database version and configuration
      const versionResult = await db.query('SELECT version()');
      const version = versionResult[0]?.version || 'Unknown';
      
      // Get connection info
      const connectionInfo = await db.query(`
        SELECT 
          current_database() as database_name,
          current_user as current_user,
          inet_server_addr() as server_address,
          inet_server_port() as server_port
      `);

      return {
        health,
        stats,
        version,
        connection: connectionInfo[0] || {}
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export a simple function for API routes
export async function checkDatabaseHealth(): Promise<DatabaseHealthCheck> {
  return await DatabaseHealth.checkHealth();
}