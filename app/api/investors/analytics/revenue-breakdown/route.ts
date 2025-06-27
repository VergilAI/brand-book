import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/analytics/revenue-breakdown');
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      console.warn('Revenue breakdown data is not an array, returning empty array');
      return NextResponse.json([]);
    }
    
    // Validate individual items
    const validatedData = data.filter(item => {
      if (!item || typeof item !== 'object') return false;
      if (typeof item.amount !== 'number' || isNaN(item.amount)) return false;
      if (!item.source || typeof item.source !== 'string') return false;
      return true;
    });
    
    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('Error fetching revenue breakdown:', error);
    return NextResponse.json([], {
      status: 200, // Return 200 with empty array to prevent frontend errors
      headers: {
        'X-Error': 'Failed to fetch revenue breakdown data'
      }
    });
  }
}