import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Get database URL from environment variables
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || process.env.DATABASE_AUTHENTICATED_URL;
  if (!url) {
    throw new Error('DATABASE_URL or DATABASE_AUTHENTICATED_URL environment variable is not set');
  }
  return url;
};

// Create NeonDB connection lazily
let sql: NeonQueryFunction<boolean, boolean> | null = null;

const getSql = (): NeonQueryFunction<boolean, boolean> => {
  if (!sql) {
    sql = neon(getDatabaseUrl());
  }
  return sql;
};

// Database connection utility with error handling
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private sql: NeonQueryFunction<boolean, boolean>;

  private constructor() {
    this.sql = getSql();
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
      const sql = getSql();
      await sql`SELECT 1 as test`;
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

// Export singleton instance getter
export const db = {
  get instance() {
    return DatabaseConnection.getInstance();
  },
  query: async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
    return DatabaseConnection.getInstance().query<T>(query, params);
  },
  testConnection: async (): Promise<boolean> => {
    return DatabaseConnection.getInstance().testConnection();
  },
  getConnection: () => {
    return DatabaseConnection.getInstance().getConnection();
  }
};

// Export direct SQL connection for advanced use cases
export { getSql as sql };