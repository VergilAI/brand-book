import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid hypothetical ID' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`http://localhost:8000/api/hypotheticals/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.detail || 'Failed to delete hypothetical' },
        { status: response.status }
      );
    }
    
    // Return success response (204 No Content for successful deletion)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting hypothetical:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid hypothetical ID' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Format dates if present
    if (body.expected_date) {
      const expectedDate = new Date(body.expected_date);
      if (isNaN(expectedDate.getTime())) {
        return NextResponse.json(
          { message: 'Invalid expected date format' },
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
    
    const response = await fetch(`http://localhost:8000/api/hypotheticals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.detail || 'Failed to update hypothetical' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating hypothetical:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}