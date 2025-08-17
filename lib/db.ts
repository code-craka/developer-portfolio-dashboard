import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { getDatabaseUrl, logger, isProduction } from '@/lib/env-config';

// Production-optimized database configuration
const getDatabaseConfig = () => {
  const config: any = {
    // Connection pooling for production
    connectionTimeoutMillis: isProduction() ? 30000 : 10000,
    idleTimeoutMillis: isProduction() ? 300000 : 60000,
    max: isProduction() ? 20 : 5, // Connection pool size
  };

  if (isProduction()) {
    // Production-specific optimizations
    config.ssl = { rejectUnauthorized: true };
    config.statement_timeout = 30000; // 30 seconds
    config.query_timeout = 30000;
  }

  return config;
};

// Create NeonDB connection lazily with production optimizations
let sql: NeonQueryFunction<boolean, boolean> | null = null;

const getSql = (): NeonQueryFunction<boolean, boolean> => {
  if (!sql) {
    const databaseUrl = getDatabaseUrl();
    logger.info('Initializing database connection', { 
      environment: process.env.NODE_ENV,
      host: new URL(databaseUrl).host 
    });
    
    sql = neon(databaseUrl, getDatabaseConfig());
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

  // Execute SQL query with error handling and performance monitoring
  async query<T = any>(query: string, params: any[] = []): Promise<T[]> {
    const startTime = Date.now();
    
    try {
      const result = await this.sql(query, params);
      
      const duration = Date.now() - startTime;
      if (duration > 1000) {
        logger.warn('Slow query detected', { 
          query: query.substring(0, 100) + '...', 
          duration,
          params: params.length 
        });
      }
      
      logger.debug('Database query executed', { 
        duration, 
        rowCount: Array.isArray(result) ? result.length : 0 
      });
      
      return result as T[];
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Database query error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        query: query.substring(0, 100) + '...',
        duration,
        params: params.length
      });
      
      throw new Error(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test database connection with detailed health check
  async testConnection(): Promise<boolean> {
    try {
      const sql = getSql();
      const startTime = Date.now();
      
      await sql`SELECT 1 as test`;
      
      const duration = Date.now() - startTime;
      logger.info('Database connection test successful', { duration });
      
      return true;
    } catch (error) {
      logger.error('Database connection test failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
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