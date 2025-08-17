import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { envConfig, isProduction } from '@/lib/env-config';
import { getMonitoringData } from '@/lib/monitoring';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
    filesystem: {
      status: 'healthy' | 'unhealthy';
      error?: string;
    };
    memory: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      usage: {
        used: number;
        total: number;
        percentage: number;
      };
    };
    environment: {
      status: 'healthy' | 'unhealthy';
      missingVars?: string[];
    };
  };
  monitoring?: {
    metrics: any;
    errors: any;
    system: any;
  };
}

// GET /api/health - Comprehensive health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const healthCheck: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: envConfig.NODE_ENV,
      uptime: process.uptime(),
      checks: {
        database: { status: 'healthy' },
        filesystem: { status: 'healthy' },
        memory: { status: 'healthy', usage: { used: 0, total: 0, percentage: 0 } },
        environment: { status: 'healthy' },
      },
    };

    // Database health check
    try {
      const dbStartTime = Date.now();
      const isDbHealthy = await db.testConnection();
      const dbResponseTime = Date.now() - dbStartTime;
      
      if (isDbHealthy) {
        healthCheck.checks.database = {
          status: 'healthy',
          responseTime: dbResponseTime,
        };
      } else {
        healthCheck.checks.database = {
          status: 'unhealthy',
          error: 'Database connection failed',
        };
        healthCheck.status = 'unhealthy';
      }
    } catch (error) {
      healthCheck.checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown database error',
      };
      healthCheck.status = 'unhealthy';
    }

    // Filesystem health check
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.access(uploadDir);
      
      healthCheck.checks.filesystem = { status: 'healthy' };
    } catch (error) {
      healthCheck.checks.filesystem = {
        status: 'unhealthy',
        error: 'Upload directory not accessible',
      };
      if (healthCheck.status === 'healthy') {
        healthCheck.status = 'degraded';
      }
    }

    // Memory health check
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    healthCheck.checks.memory = {
      status: memoryPercentage > 90 ? 'unhealthy' : memoryPercentage > 70 ? 'degraded' : 'healthy',
      usage: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage),
      },
    };

    if (healthCheck.checks.memory.status === 'unhealthy') {
      healthCheck.status = 'unhealthy';
    } else if (healthCheck.checks.memory.status === 'degraded' && healthCheck.status === 'healthy') {
      healthCheck.status = 'degraded';
    }

    // Environment variables check
    const requiredVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      healthCheck.checks.environment = {
        status: 'unhealthy',
        missingVars,
      };
      healthCheck.status = 'unhealthy';
    }

    // Add monitoring data if enabled
    if (envConfig.ENABLE_PERFORMANCE_MONITORING) {
      healthCheck.monitoring = getMonitoringData();
    }

    // Determine HTTP status code
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    // Add response headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check-Duration': `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(healthCheck, { 
      status: httpStatus,
      headers 
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: envConfig.NODE_ENV,
      uptime: process.uptime(),
      checks: {
        database: { status: 'unhealthy', error: 'Health check failed' },
        filesystem: { status: 'unhealthy', error: 'Health check failed' },
        memory: { status: 'unhealthy', usage: { used: 0, total: 0, percentage: 0 } },
        environment: { status: 'unhealthy' },
      },
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check-Duration': `${Date.now() - startTime}ms`,
      }
    });
  }
}

// HEAD /api/health - Lightweight health check for load balancers
export async function HEAD(request: NextRequest) {
  try {
    const isHealthy = await db.testConnection();
    
    return new NextResponse(null, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': isHealthy ? 'healthy' : 'unhealthy',
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': 'unhealthy',
      },
    });
  }
}