import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/hypotheticals');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hypotheticals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hypotheticals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (body.transaction_type === 'onetime' && !body.expected_date) {
      return NextResponse.json(
        { message: 'Expected date is required for one-time transactions' },
        { status: 400 }
      );
    }
    
    if (body.transaction_type === 'recurring' && !body.start_date) {
      return NextResponse.json(
        { message: 'Start date is required for recurring transactions' },
        { status: 400 }
      );
    }
    
    // Validate date formats and logic
    if (body.expected_date) {
      const expectedDate = new Date(body.expected_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(expectedDate.getTime())) {
        return NextResponse.json(
          { message: 'Invalid expected date format' },
          { status: 400 }
        );
      }
      
      if (expectedDate < today) {
        return NextResponse.json(
          { message: 'Expected date cannot be in the past' },
          { status: 400 }
        );
      }
    }
    
    if (body.start_date && body.end_date) {
      const startDate = new Date(body.start_date);
      const endDate = new Date(body.end_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { message: 'Invalid date format' },
          { status: 400 }
        );
      }
      
      if (endDate <= startDate) {
        return NextResponse.json(
          { message: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }
    
    const response = await fetch('http://localhost:8000/api/hypotheticals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.detail || 'Failed to create hypothetical' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating hypothetical:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}