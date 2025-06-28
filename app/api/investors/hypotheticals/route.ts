import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin, logSecurityEvent, getClientIP } from '@/lib/investors/auth';
import { DataService } from '@/lib/investors/dataService';

interface HypotheticalItem {
  id: string;
  name: string;
  amount: number;
  type: "revenue" | "expense";
  transaction_type: "recurring" | "one-time";
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
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
    return await DataService.readJSON('hypotheticals.json');
  } catch (error) {
    return { hypotheticals: [] };
  }
}

async function writeHypotheticals(data: HypotheticalsData): Promise<void> {
  await DataService.writeJSON('hypotheticals.json', data);
}

export const GET = requireAuth(async (request: NextRequest, user) => {
  const clientIP = getClientIP(request);
  
  try {
    const data = await readHypotheticals();
    
    logSecurityEvent({
      userId: user.id,
      action: 'hypotheticals_accessed',
      ip: clientIP,
      success: true
    });
    
    return NextResponse.json(data.hypotheticals);
  } catch (error) {
    logSecurityEvent({
      userId: user.id,
      action: 'hypotheticals_access_error',
      ip: clientIP,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: "Failed to read hypotheticals" }, { status: 500 });
  }
});

export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const data = await readHypotheticals();
    
    const newHypothetical: HypotheticalItem = {
      id: `hyp-${Date.now()}`,
      name: body.name,
      amount: body.amount,
      type: body.type,
      transaction_type: body.transaction_type,
      recurring_type: body.recurring_type,
      subscription_users: body.subscription_users,
      subscription_price_per_user: body.subscription_price_per_user,
      subscription_growth_factor: body.subscription_growth_factor,
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
});

export const PUT = requireAdmin(async (request: NextRequest, user) => {
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
});

export const DELETE = requireAdmin(async (request: NextRequest, user) => {
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
});