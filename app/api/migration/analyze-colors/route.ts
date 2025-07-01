import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log('Starting color analysis...');
    
    // Run the comprehensive color analysis script
    const scriptPath = path.join(process.cwd(), 'scripts', 'analyze-colors-comprehensive.ts');
    
    try {
      const { stdout, stderr } = await execAsync(`tsx ${scriptPath}`, {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });
      
      if (stderr && !stderr.includes('ExperimentalWarning')) {
        console.error('Analysis stderr:', stderr);
      }
      
      console.log('Analysis stdout:', stdout);
    } catch (error: any) {
      console.error('Failed to run analysis script:', error);
      return NextResponse.json(
        { error: 'Failed to run color analysis', details: error.message },
        { status: 500 }
      );
    }
    
    // Read the generated report
    const reportPath = path.join(process.cwd(), 'reports', 'color-analysis.json');
    
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json(
        { error: 'Color analysis report not found' },
        { status: 404 }
      );
    }
    
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in color analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze colors', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if report exists
    const reportPath = path.join(process.cwd(), 'reports', 'color-analysis.json');
    
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({
        error: 'No color analysis report found. Please run analysis first.',
        hasReport: false
      });
    }
    
    // Read the report
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const reportAge = Date.now() - new Date(report.timestamp).getTime();
    const isStale = reportAge > 5 * 60 * 1000; // 5 minutes
    
    return NextResponse.json({
      report,
      isStale,
      age: Math.round(reportAge / 1000), // age in seconds
      hasReport: true
    });
  } catch (error: any) {
    console.error('Error reading color report:', error);
    return NextResponse.json(
      { error: 'Failed to read color report', details: error.message },
      { status: 500 }
    );
  }
}