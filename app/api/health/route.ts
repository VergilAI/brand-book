import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check basic application health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    }

    // Optional: Check database connection
    if (process.env.DATABASE_URL) {
      try {
        // Implement database ping here if using Prisma
        // const result = await prisma.$queryRaw`SELECT 1`
        health.database = 'connected'
      } catch (error) {
        health.database = 'disconnected'
        health.status = 'degraded'
      }
    }

    // Optional: Check Redis connection
    if (process.env.REDIS_URL) {
      try {
        // Implement Redis ping here if using Redis
        // await redis.ping()
        health.cache = 'connected'
      } catch (error) {
        health.cache = 'disconnected'
        health.status = 'degraded'
      }
    }

    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}