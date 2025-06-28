import { NextRequest, NextResponse } from "next/server";
import { requireAuth, logSecurityEvent, getClientIP } from '@/lib/investors/auth';
import { DataService } from '@/lib/investors/dataService';

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
    return await DataService.readJSON(filename);
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

export const GET = requireAuth(async (request: NextRequest, user) => {
  const clientIP = getClientIP(request);
  
  try {
    logSecurityEvent({
      userId: user.id,
      action: 'dashboard_accessed',
      ip: clientIP,
      success: true
    });
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
    
    // Calculate burn rate
    const burnrate = totalMonthlyExpenses - totalMonthlyRevenue;
    
    // Calculate runway with month-by-month projection
    let projectedBalance = currentBalance;
    let runway_months: number | null = 0;
    const maxMonths = 120; // Cap at 10 years
    
    // Get all one-time events (revenues, expenses, and hypotheticals)
    const allOneTimeEvents: Array<{date: Date, amount: number, type: 'revenue' | 'expense'}> = [];
    
    // Add one-time revenues
    (revenuesData.revenues || []).forEach(item => {
      if (item.transaction_type === "one-time" && item.date_info?.date) {
        const eventDate = new Date(item.date_info.date);
        if (eventDate > new Date()) {
          allOneTimeEvents.push({
            date: eventDate,
            amount: item.amount,
            type: 'revenue'
          });
        }
      }
    });
    
    // Add one-time expenses
    (expensesData.expenses || []).forEach(item => {
      if (item.transaction_type === "one-time" && item.date_info?.date) {
        const eventDate = new Date(item.date_info.date);
        if (eventDate > new Date()) {
          allOneTimeEvents.push({
            date: eventDate,
            amount: item.amount,
            type: 'expense'
          });
        }
      }
    });
    
    // Add enabled one-time hypotheticals
    enabledHypotheticals.forEach(item => {
      if (item.transaction_type === "one-time" && item.date_info?.date) {
        const eventDate = new Date(item.date_info.date);
        if (eventDate > new Date()) {
          allOneTimeEvents.push({
            date: eventDate,
            amount: item.amount,
            type: item.type as 'revenue' | 'expense'
          });
        }
      }
    });
    
    // Project month by month
    for (let month = 0; month < maxMonths; month++) {
      const projectionDate = new Date();
      projectionDate.setMonth(projectionDate.getMonth() + month);
      
      // Calculate recurring revenue for this month
      let monthRevenue = 0;
      (revenuesData.revenues || []).forEach(item => {
        if (item.transaction_type === "recurring") {
          const startDate = item.date_info.start_date ? new Date(item.date_info.start_date) : null;
          const endDate = item.date_info.end_date ? new Date(item.date_info.end_date) : null;
          
          if ((!startDate || startDate <= projectionDate) && 
              (!endDate || endDate >= projectionDate)) {
            if (item.date_info.frequency === "Yearly") {
              monthRevenue += item.amount / 12;
            } else if (item.date_info.frequency === "Quarterly") {
              monthRevenue += item.amount / 3;
            } else {
              monthRevenue += item.amount;
            }
          }
        }
      });
      
      // Calculate recurring expenses for this month
      let monthExpense = 0;
      (expensesData.expenses || []).forEach(item => {
        if (item.transaction_type === "recurring") {
          const startDate = item.date_info.start_date ? new Date(item.date_info.start_date) : null;
          const endDate = item.date_info.end_date ? new Date(item.date_info.end_date) : null;
          
          if ((!startDate || startDate <= projectionDate) && 
              (!endDate || endDate >= projectionDate)) {
            if (item.date_info.frequency === "Yearly") {
              monthExpense += item.amount / 12;
            } else if (item.date_info.frequency === "Quarterly") {
              monthExpense += item.amount / 3;
            } else {
              monthExpense += item.amount;
            }
          }
        }
      });
      
      // Add recurring hypotheticals
      enabledHypotheticals.forEach(item => {
        if (item.transaction_type === "recurring") {
          const startDate = item.date_info.start_date ? new Date(item.date_info.start_date) : null;
          const endDate = item.date_info.end_date ? new Date(item.date_info.end_date) : null;
          
          if ((!startDate || startDate <= projectionDate) && 
              (!endDate || endDate >= projectionDate)) {
            let monthlyAmount = item.amount;
            if (item.date_info.frequency === "Yearly") {
              monthlyAmount = item.amount / 12;
            } else if (item.date_info.frequency === "Quarterly") {
              monthlyAmount = item.amount / 3;
            }
            if (item.type === "revenue") {
              monthRevenue += monthlyAmount;
            } else {
              monthExpense += monthlyAmount;
            }
          }
        }
      });
      
      // Add one-time events for this month
      allOneTimeEvents.forEach(event => {
        if (event.date.getFullYear() === projectionDate.getFullYear() && 
            event.date.getMonth() === projectionDate.getMonth()) {
          if (event.type === 'revenue') {
            monthRevenue += event.amount;
          } else {
            monthExpense += event.amount;
          }
        }
      });
      
      // Update balance
      projectedBalance = projectedBalance + monthRevenue - monthExpense;
      
      // Check if we've hit zero
      if (projectedBalance <= 0) {
        runway_months = month;
        break;
      }
      
      // If balance is growing, cap at max months
      if (month === maxMonths - 1) {
        runway_months = null; // Infinite runway
        break;
      }
    }
    
    // Calculate zero date based on accurate runway
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
    logSecurityEvent({
      userId: user.id,
      action: 'dashboard_error',
      ip: clientIP,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: "Failed to calculate dashboard data" }, { status: 500 });
  }
});