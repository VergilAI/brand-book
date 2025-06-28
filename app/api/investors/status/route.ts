import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/investors/auth';
import { DataService } from '@/lib/investors/dataService';
import { S3DataService } from '@/lib/investors/s3DataService';

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    // Get data service status
    const dataServiceStatus = DataService.getStatus();
    
    // Get S3 cache stats if using S3
    const cacheStats = dataServiceStatus.mode === 'S3' 
      ? S3DataService.getCacheStats() 
      : null;
    
    // Test connectivity
    const connectivityTests = {
      users: false,
      balances: false,
      expenses: false,
      revenues: false,
      hypotheticals: false
    };
    
    // Only test if admin
    if (user.role === 'admin') {
      for (const file of Object.keys(connectivityTests)) {
        try {
          await DataService.readJSON(`${file}.json`);
          connectivityTests[file as keyof typeof connectivityTests] = true;
        } catch (error) {
          connectivityTests[file as keyof typeof connectivityTests] = false;
        }
      }
    }
    
    const status = {
      service: 'Vergil Investors Portal API',
      status: 'operational',
      timestamp: new Date().toISOString(),
      dataService: dataServiceStatus,
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        USE_LOCAL_FILES: process.env.USE_LOCAL_FILES || 'false',
        S3_BUCKET: dataServiceStatus.s3Configured ? process.env.S3_BUCKET : 'not-configured',
        AWS_REGION: dataServiceStatus.s3Configured ? process.env.AWS_REGION : 'not-configured'
      },
      user: {
        id: user.id,
        role: user.role,
        name: user.name
      },
      connectivity: user.role === 'admin' ? connectivityTests : 'admin-only',
      cache: cacheStats
    };
    
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get status',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
});