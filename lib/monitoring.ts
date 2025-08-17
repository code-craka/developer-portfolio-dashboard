/**
 * Production monitoring and observability utilities
 */

import { envConfig, logger, isProduction } from '@/lib/env-config';

interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface ErrorData {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: number;
  level: 'error' | 'warn' | 'info';
}

class ProductionMonitor {
  private metrics: MetricData[] = [];
  private errors: ErrorData[] = [];
  private maxMetrics = 1000;
  private maxErrors = 500;

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    if (!envConfig.ENABLE_PERFORMANCE_MONITORING) return;

    const metric: MetricData = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // Implement circular buffer
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log significant metrics
    if (isProduction()) {
      logger.info(`Metric recorded: ${name}=${value}`, tags);
    }
  }

  /**
   * Record an error with context
   */
  recordError(error: Error | string, context?: Record<string, any>, level: 'error' | 'warn' | 'info' = 'error') {
    const errorData: ErrorData = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: Date.now(),
      level,
    };

    this.errors.push(errorData);

    // Implement circular buffer
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error
    logger.error(`Error recorded: ${errorData.message}`, { context, stack: errorData.stack });
  }

  /**
   * Get performance metrics summary
   */
  getMetricsSummary(timeWindow: number = 300000) { // 5 minutes default
    const cutoff = Date.now() - timeWindow;
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);

    const summary: Record<string, { count: number; avg: number; min: number; max: number }> = {};

    recentMetrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, avg: 0, min: Infinity, max: -Infinity };
      }

      const s = summary[metric.name];
      s.count++;
      s.min = Math.min(s.min, metric.value);
      s.max = Math.max(s.max, metric.value);
      s.avg = (s.avg * (s.count - 1) + metric.value) / s.count;
    });

    return summary;
  }

  /**
   * Get error summary
   */
  getErrorsSummary(timeWindow: number = 300000) { // 5 minutes default
    const cutoff = Date.now() - timeWindow;
    const recentErrors = this.errors.filter(e => e.timestamp > cutoff);

    return {
      total: recentErrors.length,
      byLevel: {
        error: recentErrors.filter(e => e.level === 'error').length,
        warn: recentErrors.filter(e => e.level === 'warn').length,
        info: recentErrors.filter(e => e.level === 'info').length,
      },
      recent: recentErrors.slice(-10), // Last 10 errors
    };
  }

  /**
   * Get system health metrics
   */
  getSystemHealth() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  /**
   * Performance timing decorator
   */
  timeFunction<T extends (...args: any[]) => any>(
    fn: T,
    metricName: string,
    tags?: Record<string, string>
  ): T {
    return ((...args: any[]) => {
      const startTime = Date.now();
      
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result instanceof Promise) {
          return result
            .then(value => {
              this.recordMetric(metricName, Date.now() - startTime, tags);
              return value;
            })
            .catch(error => {
              this.recordMetric(metricName, Date.now() - startTime, { ...tags, status: 'error' });
              this.recordError(error, { function: metricName, args: args.length });
              throw error;
            });
        }
        
        // Handle sync functions
        this.recordMetric(metricName, Date.now() - startTime, tags);
        return result;
      } catch (error) {
        this.recordMetric(metricName, Date.now() - startTime, { ...tags, status: 'error' });
        this.recordError(error instanceof Error ? error : new Error(String(error)), { 
          function: metricName, 
          args: args.length 
        });
        throw error;
      }
    }) as T;
  }

  /**
   * Clear old data to prevent memory leaks
   */
  cleanup(maxAge: number = 3600000) { // 1 hour default
    const cutoff = Date.now() - maxAge;
    
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    this.errors = this.errors.filter(e => e.timestamp > cutoff);
  }
}

// Global monitor instance
const monitor = new ProductionMonitor();

// Cleanup old data every 10 minutes
if (isProduction()) {
  setInterval(() => {
    monitor.cleanup();
  }, 600000);
}

/**
 * Middleware for monitoring API routes
 */
export function withMonitoring<T extends (...args: any[]) => any>(
  handler: T,
  routeName: string
): T {
  return monitor.timeFunction(handler, `api.${routeName}`, { type: 'api' });
}

/**
 * Monitor database queries
 */
export function monitorDatabaseQuery<T extends (...args: any[]) => any>(
  queryFn: T,
  queryType: string = 'query'
): T {
  return monitor.timeFunction(queryFn, `db.${queryType}`, { type: 'database' });
}

/**
 * Record custom application metrics
 */
export const recordMetric = (name: string, value: number, tags?: Record<string, string>) => {
  monitor.recordMetric(name, value, tags);
};

/**
 * Record application errors
 */
export const recordError = (error: Error | string, context?: Record<string, any>, level?: 'error' | 'warn' | 'info') => {
  monitor.recordError(error, context, level);
};

/**
 * Get monitoring data for health checks
 */
export const getMonitoringData = () => ({
  metrics: monitor.getMetricsSummary(),
  errors: monitor.getErrorsSummary(),
  system: monitor.getSystemHealth(),
});

export { monitor, ProductionMonitor };