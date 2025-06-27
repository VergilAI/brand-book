import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "app/investors/data/revenues.json");

interface RevenueItem {
  id: string;
  source: string;
  amount: number;
  type: string;
  transaction_type: "recurring" | "one-time";
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  is_hypothetical: boolean;
}

interface RevenuesData {
  revenues: RevenueItem[];
}

async function readRevenues(): Promise<RevenuesData> {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { revenues: [] };
  }
}

async function writeRevenues(data: RevenuesData): Promise<void> {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readRevenues();
    return NextResponse.json(data.revenues);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read revenues" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readRevenues();
    
    const newRevenue: RevenueItem = {
      id: `rev-${Date.now()}`,
      source: body.source,
      amount: body.amount,
      type: "revenue",
      transaction_type: body.transaction_type,
      date_info: body.date_info,
      is_hypothetical: body.is_hypothetical || false
    };
    
    data.revenues.push(newRevenue);
    await writeRevenues(data);
    
    return NextResponse.json(newRevenue, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create revenue" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readRevenues();
    
    const index = data.revenues.findIndex(r => r.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Revenue not found" }, { status: 404 });
    }
    
    data.revenues[index] = { ...data.revenues[index], ...body };
    await writeRevenues(data);
    
    return NextResponse.json(data.revenues[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update revenue" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = await readRevenues();
    const filteredRevenues = data.revenues.filter(r => r.id !== id);
    
    if (filteredRevenues.length === data.revenues.length) {
      return NextResponse.json({ error: "Revenue not found" }, { status: 404 });
    }
    
    data.revenues = filteredRevenues;
    await writeRevenues(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete revenue" }, { status: 500 });
  }
}