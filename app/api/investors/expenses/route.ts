import { NextRequest, NextResponse } from "next/server";
import { DataService } from '@/lib/investors/dataService';
import { requireAuth, requireAdmin } from '@/lib/investors/auth';

interface ExpenseItem {
  id: string;
  name: string;
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

interface ExpensesData {
  expenses: ExpenseItem[];
}

async function readExpenses(): Promise<ExpensesData> {
  try {
    return await DataService.readJSON('expenses.json');
  } catch (error) {
    return { expenses: [] };
  }
}

async function writeExpenses(data: ExpensesData): Promise<void> {
  await DataService.writeJSON('expenses.json', data);
}

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const data = await readExpenses();
    return NextResponse.json(data.expenses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read expenses" }, { status: 500 });
  }
});

export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const data = await readExpenses();
    
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: body.name,
      amount: body.amount,
      type: "expense",
      transaction_type: body.transaction_type,
      date_info: body.date_info,
      is_hypothetical: body.is_hypothetical || false
    };
    
    data.expenses.push(newExpense);
    await writeExpenses(data);
    
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
});

export const PUT = requireAdmin(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const data = await readExpenses();
    
    const index = data.expenses.findIndex(e => e.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    
    data.expenses[index] = { ...data.expenses[index], ...body };
    await writeExpenses(data);
    
    return NextResponse.json(data.expenses[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = await readExpenses();
    const filteredExpenses = data.expenses.filter(e => e.id !== id);
    
    if (filteredExpenses.length === data.expenses.length) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    
    data.expenses = filteredExpenses;
    await writeExpenses(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
});