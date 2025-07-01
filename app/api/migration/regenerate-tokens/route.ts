import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  const startTime = Date.now();
  
  try {
    // Execute the build:tokens command
    const { stdout, stderr } = await execAsync('npm run build:tokens', {
      cwd: process.cwd(),
      timeout: 60000, // 60 second timeout
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    const duration = Date.now() - startTime;
    
    // Check if there were any errors in stderr that aren't just warnings
    const hasRealErrors = stderr && !stderr.includes('warning');
    
    return NextResponse.json({
      success: !hasRealErrors,
      output: stdout + (stderr ? `\n\nWarnings/Errors:\n${stderr}` : ''),
      error: hasRealErrors ? stderr : null,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Handle different types of errors
    let errorMessage = 'Unknown error occurred';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if ('code' in error) {
        errorDetails = {
          code: (error as any).code,
          signal: (error as any).signal,
          killed: (error as any).killed
        };
        
        if ((error as any).code === 'ETIMEDOUT') {
          errorMessage = 'Build process timed out after 60 seconds';
        } else if ((error as any).code === 'ENOENT') {
          errorMessage = 'npm command not found. Ensure npm is installed and in PATH';
        }
      }
    }
    
    return NextResponse.json({
      success: false,
      output: '',
      error: errorMessage,
      errorDetails,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to trigger token regeneration',
    endpoint: '/api/migration/regenerate-tokens',
    method: 'POST',
    response: {
      success: 'boolean - whether the build completed successfully',
      output: 'string - console output from the build process',
      error: 'string | null - error message if build failed',
      errorDetails: 'object - additional error information if available',
      duration: 'string - how long the build took (e.g., "1234ms")',
      timestamp: 'string - ISO timestamp of when the build was triggered'
    }
  });
}