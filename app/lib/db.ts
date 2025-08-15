import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create NeonDB connection
const sql = neon(process.env.DATABASE_URL);

// Database connection utility with error handling
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private sql: typeof sql;

  private constructor() {
    this.sql = sql;
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  // Execute SQL query with error handling
  async query<T = any>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await this.sql(query, params);
      return result as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      await this.sql`SELECT 1 as test`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Get database connection for direct use
  getConnection() {
    return this.sql;
  }
}

// Export singleton instance
export const db = DatabaseConnection.getInstance();

// Export direct SQL connection for advanced use cases
export { sql };