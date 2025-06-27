import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1month';
    
    const response = await fetch(`http://localhost:8000/api/analytics/projections?period=${period}`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      console.warn('Invalid projections data structure');
      return NextResponse.json({
        period: period,
        recurring_revenue: 0,
        hypothetical_revenue: 0,
        total_projected: 0
      });
    }
    
    // Ensure numeric values
    const validatedData = {
      period: data.period || period,
      recurring_revenue: typeof data.recurring_revenue === 'number' ? data.recurring_revenue : 0,
      hypothetical_revenue: typeof data.hypothetical_revenue === 'number' ? data.hypothetical_revenue : 0,
      total_projected: typeof data.total_projected === 'number' ? data.total_projected : 0
    };
    
    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('Error fetching projections:', error);
    
    // Return fallback data instead of error to prevent frontend crashes
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1month';
    
    return NextResponse.json({
      period: period,
      recurring_revenue: 0,
      hypothetical_revenue: 0,
      total_projected: 0
    }, {
      status: 200,
      headers: {
        'X-Error': 'Failed to fetch projections data'
      }
    });
  }
}