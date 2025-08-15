import { NextRequest, NextResponse } from 'next/server';
import { DatabaseHealth } from '@/lib/db-health';

// GET /api/health/db - Check database health
export async function GET(request: NextRequest) {
  try {
    const health = await DatabaseHealth.checkHealth();
    
    const status = health.connected && 
                  Object.values(health.tablesExist).every(exists => exists) && 
                  health.indexesExist ? 200 : 503;

    return NextResponse.json({
      success: status === 200,
      health,
      timestamp: new Date().toISOString()
    }, { status });
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST /api/health/db - Auto-repair database
export async function POST(request: NextRequest) {
  try {
    const repair = await DatabaseHealth.autoRepair();
    
    return NextResponse.json({
      success: repair.success,
      message: repair.message,
      timestamp: new Date().toISOString()
    }, { status: repair.success ? 200 : 500 });
  } catch (error) {
    console.error('Database auto-repair failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database auto-repair failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}