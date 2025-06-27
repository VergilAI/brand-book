import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/analytics/expense-breakdown');
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching expense data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expense data' },
      { status: 500 }
    );
  }
}