import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface Balance {
  id: string;
  type: "starting" | "current";
  amount: number;
  date: string;
  description: string;
}

interface FinancialItem {
  id: string;
  source?: string;
  name?: string;
  amount: number;
  type: string;
  transaction_type: "recurring" | "one-time";
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  is_hypothetical?: boolean;
}

interface HypotheticalItem extends FinancialItem {
  enabled: boolean;
  description: string;
}

async function readData<T>(filename: string): Promise<T> {
  try {
    const dataPath = path.join(process.cwd(), "app/investors/data", filename);
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {} as T;
  }
}

function calculateMonthlyAmount(item: FinancialItem): number {
  // For one-time transactions - don't include in monthly burn rate
  if (item.transaction_type === "one-time") {
    return 0;
  }
  
  // For recurring transactions
  const now = new Date();
  const startDate = item.date_info.start_date ? new Date(item.date_info.start_date) : null;
  const endDate = item.date_info.end_date ? new Date(item.date_info.end_date) : null;
  
  // Include expenses/revenues that start within the next 30 days for better projections
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  // Skip if starts more than 30 days in the future
  if (startDate && startDate > thirtyDaysFromNow) return 0;
  // Skip if already ended
  if (endDate && endDate < now) return 0;
  
  // Adjust for frequency
  if (item.date_info.frequency === "Yearly") {
    return item.amount / 12;
  } else if (item.date_info.frequency === "Quarterly") {
    return item.amount / 3;
  }
  
  return item.amount; // Monthly frequency
}

function calculateHistoricTotal(items: FinancialItem[]): number {
  let total = 0;
  const now = new Date();
  
  for (const item of items) {
    if (item.transaction_type === "one-time") {
      // Add all one-time transactions that have occurred
      if (item.date_info.date) {
        const itemDate = new Date(item.date_info.date);
        if (itemDate <= now) {
          total += item.amount;
        }
      }
    } else {
      // For recurring transactions, calculate total from start to now
      const startDate = item.date_info.start_date ? new Date(item.date_info.start_date) : new Date("2024-01-01");
      const endDate = item.date_info.end_date ? new Date(item.date_info.end_date) : now;
      const effectiveEnd = endDate > now ? now : endDate;
      
      if (startDate <= now) {
        const monthsDiff = (effectiveEnd.getFullYear() - startDate.getFullYear()) * 12 + 
                          (effectiveEnd.getMonth() - startDate.getMonth()) + 1;
        
        if (item.date_info.frequency === "Yearly") {
          const yearsDiff = Math.floor(monthsDiff / 12);
          total += item.amount * yearsDiff;
        } else {
          total += item.amount * monthsDiff;
        }
      }
    }
  }
  
  return total;
}

export async function GET() {
  try {
    // Read all data
    const balancesData = await readData<{ balances: Balance[] }>("balances.json");
    const revenuesData = await readData<{ revenues: FinancialItem[] }>("revenues.json");
    const expensesData = await readData<{ expenses: FinancialItem[] }>("expenses.json");
    const hypotheticalsData = await readData<{ hypotheticals: HypotheticalItem[] }>("hypotheticals.json");
    
    // Get starting and current balance
    const startingBalance = balancesData.balances?.find(b => b.type === "starting")?.amount || 0;
    const currentBalanceEntry = balancesData.balances?.find(b => b.type === "current");
    
    // Calculate historic totals
    const historicRevenue = calculateHistoricTotal(revenuesData.revenues || []);
    const historicExpense = calculateHistoricTotal(expensesData.expenses || []);
    
    // Calculate current balance (if not manually set)
    const currentBalance = currentBalanceEntry?.amount || (startingBalance + historicRevenue - historicExpense);
    
    // Calculate monthly revenue and expenses
    const monthlyRevenue = (revenuesData.revenues || []).reduce((sum, item) => 
      sum + calculateMonthlyAmount(item), 0
    );
    
    const monthlyExpenses = (expensesData.expenses || []).reduce((sum, item) => 
      sum + calculateMonthlyAmount(item), 0
    );
    
    // Add enabled hypotheticals
    const enabledHypotheticals = (hypotheticalsData.hypotheticals || []).filter(h => h.enabled);
    
    const hypotheticalRevenue = enabledHypotheticals
      .filter(h => h.type === "revenue")
      .reduce((sum, item) => sum + calculateMonthlyAmount(item), 0);
    
    const hypotheticalExpense = enabledHypotheticals
      .filter(h => h.type === "expense")
      .reduce((sum, item) => sum + calculateMonthlyAmount(item), 0);
    
    const totalMonthlyRevenue = monthlyRevenue + hypotheticalRevenue;
    const totalMonthlyExpenses = monthlyExpenses + hypotheticalExpense;
    
    // Calculate burn rate and runway
    const burnrate = totalMonthlyExpenses - totalMonthlyRevenue;
    const runway_months = burnrate > 0 ? Math.floor(currentBalance / burnrate) : null;
    
    // Calculate zero date
    const zero_date = runway_months !== null 
      ? new Date(Date.now() + runway_months * 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;
    
    // Calculate 12-month averages (simplified for now)
    const revenue_12month_avg = totalMonthlyRevenue * 0.85; // Assume 85% historical average
    const expense_12month_avg = totalMonthlyExpenses * 0.95; // Assume 95% historical average
    
    // Calculate actual spending this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const actual_spending_this_month = (expensesData.expenses || [])
      .filter(expense => {
        if (expense.transaction_type === "recurring") {
          const startDate = expense.date_info.start_date ? new Date(expense.date_info.start_date) : null;
          const endDate = expense.date_info.end_date ? new Date(expense.date_info.end_date) : null;
          const now = new Date();
          
          if (startDate && startDate > now) return false;
          if (endDate && endDate < now) return false;
          return true;
        } else {
          if (!expense.date_info.date) return false;
          const expenseDate = new Date(expense.date_info.date);
          return expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear;
        }
      })
      .reduce((sum, expense) => {
        if (expense.transaction_type === "recurring") {
          return sum + (expense.date_info.frequency === "Yearly" ? expense.amount / 12 : expense.amount);
        }
        return sum + expense.amount;
      }, 0);
    
    const dashboardData = {
      current_balance: currentBalance,
      monthly_revenue: totalMonthlyRevenue,
      monthly_expenses: totalMonthlyExpenses,
      revenue_12month_avg,
      expense_12month_avg,
      burnrate,
      runway_months,
      actual_spending_this_month,
      zero_date,
      // Additional data for transparency
      hypothetical_revenue: hypotheticalRevenue,
      hypothetical_expense: hypotheticalExpense,
      base_monthly_revenue: monthlyRevenue,
      base_monthly_expenses: monthlyExpenses
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate dashboard data" }, { status: 500 });
  }
}