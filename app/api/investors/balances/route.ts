import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin } from '@/lib/investors/auth';
import { DataService } from '@/lib/investors/dataService';

interface Balance {
  id: string;
  type: "starting" | "current";
  amount: number;
  date: string;
  description: string;
}

interface BalancesData {
  balances: Balance[];
}

async function readBalances(): Promise<BalancesData> {
  try {
    return await DataService.readJSON('balances.json');
  } catch (error) {
    return { balances: [] };
  }
}

async function writeBalances(data: BalancesData): Promise<void> {
  await DataService.writeJSON('balances.json', data);
}

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const data = await readBalances();
    return NextResponse.json(data.balances);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read balances" }, { status: 500 });
  }
});

export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const data = await readBalances();
    
    const newBalance: Balance = {
      id: Date.now().toString(),
      type: body.type,
      amount: body.amount,
      date: body.date,
      description: body.description
    };
    
    data.balances.push(newBalance);
    await writeBalances(data);
    
    return NextResponse.json(newBalance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create balance" }, { status: 500 });
  }
});

export const PUT = requireAdmin(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const data = await readBalances();
    
    const index = data.balances.findIndex(b => b.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Balance not found" }, { status: 404 });
    }
    
    data.balances[index] = { ...data.balances[index], ...body };
    await writeBalances(data);
    
    return NextResponse.json(data.balances[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = await readBalances();
    const filteredBalances = data.balances.filter(b => b.id !== id);
    
    if (filteredBalances.length === data.balances.length) {
      return NextResponse.json({ error: "Balance not found" }, { status: 404 });
    }
    
    data.balances = filteredBalances;
    await writeBalances(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete balance" }, { status: 500 });
  }
});