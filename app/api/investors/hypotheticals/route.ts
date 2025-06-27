import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "app/investors/data/hypotheticals.json");

interface HypotheticalItem {
  id: string;
  name: string;
  amount: number;
  type: "revenue" | "expense";
  transaction_type: "recurring" | "one-time";
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  enabled: boolean;
  description: string;
}

interface HypotheticalsData {
  hypotheticals: HypotheticalItem[];
}

async function readHypotheticals(): Promise<HypotheticalsData> {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { hypotheticals: [] };
  }
}

async function writeHypotheticals(data: HypotheticalsData): Promise<void> {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readHypotheticals();
    return NextResponse.json(data.hypotheticals);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read hypotheticals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readHypotheticals();
    
    const newHypothetical: HypotheticalItem = {
      id: `hyp-${Date.now()}`,
      name: body.name,
      amount: body.amount,
      type: body.type,
      transaction_type: body.transaction_type,
      date_info: body.date_info,
      enabled: body.enabled ?? true,
      description: body.description
    };
    
    data.hypotheticals.push(newHypothetical);
    await writeHypotheticals(data);
    
    return NextResponse.json(newHypothetical, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hypothetical" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readHypotheticals();
    
    const index = data.hypotheticals.findIndex(h => h.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Hypothetical not found" }, { status: 404 });
    }
    
    data.hypotheticals[index] = { ...data.hypotheticals[index], ...body };
    await writeHypotheticals(data);
    
    return NextResponse.json(data.hypotheticals[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hypothetical" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = await readHypotheticals();
    const filteredHypotheticals = data.hypotheticals.filter(h => h.id !== id);
    
    if (filteredHypotheticals.length === data.hypotheticals.length) {
      return NextResponse.json({ error: "Hypothetical not found" }, { status: 404 });
    }
    
    data.hypotheticals = filteredHypotheticals;
    await writeHypotheticals(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hypothetical" }, { status: 500 });
  }
}