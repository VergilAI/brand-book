import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Data paths
const balancesPath = path.join(process.cwd(), "app", "investors", "data", "balances.json");
const revenuesPath = path.join(process.cwd(), "app", "investors", "data", "revenues.json");
const expensesPath = path.join(process.cwd(), "app", "investors", "data", "expenses.json");

// Helper functions to read data
async function readBalances() {
  try {
    const data = await fs.readFile(balancesPath, "utf-8");
    return JSON.parse(data).balances || [];
  } catch (error) {
    return [];
  }
}

async function readRevenues() {
  try {
    const data = await fs.readFile(revenuesPath, "utf-8");
    return JSON.parse(data).revenues || [];
  } catch (error) {
    return [];
  }
}

async function readExpenses() {
  try {
    const data = await fs.readFile(expensesPath, "utf-8");
    return JSON.parse(data).expenses || [];
  } catch (error) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {

    // Get date parameters
    const searchParams = request.nextUrl.searchParams;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (!startDateStr || !endDateStr) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date

    // Get all data
    const balances = await readBalances();
    const revenues = await readRevenues();
    const expenses = await readExpenses();

    // Find the starting balance (closest balance before or on start date)
    const sortedBalances = balances
      .filter(b => b.type === "current")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let startBalance = 0;
    for (const balance of sortedBalances) {
      if (new Date(balance.date) <= startDate) {
        startBalance = balance.amount;
      } else {
        break;
      }
    }

    // Filter revenues and expenses within date range
    const periodRevenues: any[] = [];
    const periodExpenses: any[] = [];
    let totalRevenue = 0;
    let totalExpenses = 0;

    // Process one-time revenues
    revenues
      .filter(r => r.transaction_type === "one-time" && !r.is_hypothetical)
      .forEach(revenue => {
        const revenueDate = new Date(revenue.date_info.date);
        if (revenueDate >= startDate && revenueDate <= endDate) {
          periodRevenues.push({
            id: revenue.id,
            name: revenue.name,
            amount: revenue.amount,
            date: revenue.date_info.date,
            type: "one-time"
          });
          totalRevenue += revenue.amount;
        }
      });

    // Process recurring revenues
    revenues
      .filter(r => r.transaction_type === "recurring" && !r.is_hypothetical)
      .forEach(revenue => {
        const recurringStart = new Date(revenue.date_info.start_date);
        const recurringEnd = revenue.date_info.end_date ? new Date(revenue.date_info.end_date) : endDate;
        
        // Calculate overlap period
        const overlapStart = recurringStart > startDate ? recurringStart : startDate;
        const overlapEnd = recurringEnd < endDate ? recurringEnd : endDate;
        
        if (overlapStart <= overlapEnd) {
          // Calculate number of months in overlap period
          const monthsInPeriod = Math.max(0, 
            (overlapEnd.getFullYear() - overlapStart.getFullYear()) * 12 + 
            (overlapEnd.getMonth() - overlapStart.getMonth()) + 1
          );
          
          const monthlyAmount = revenue.date_info.frequency === "Yearly" 
            ? revenue.amount / 12 
            : revenue.amount;
          
          const periodAmount = monthlyAmount * monthsInPeriod;
          
          if (periodAmount > 0) {
            periodRevenues.push({
              id: revenue.id,
              name: revenue.name,
              amount: periodAmount,
              date: overlapStart.toISOString(),
              type: "recurring"
            });
            totalRevenue += periodAmount;
          }
        }
      });

    // Process one-time expenses
    expenses
      .filter(e => e.transaction_type === "one-time" && !e.is_hypothetical)
      .forEach(expense => {
        const expenseDate = new Date(expense.date_info.date);
        if (expenseDate >= startDate && expenseDate <= endDate) {
          periodExpenses.push({
            id: expense.id,
            name: expense.name,
            amount: expense.amount,
            date: expense.date_info.date,
            type: "one-time"
          });
          totalExpenses += expense.amount;
        }
      });

    // Process recurring expenses
    expenses
      .filter(e => e.transaction_type === "recurring" && !e.is_hypothetical)
      .forEach(expense => {
        const recurringStart = new Date(expense.date_info.start_date);
        const recurringEnd = expense.date_info.end_date ? new Date(expense.date_info.end_date) : endDate;
        
        // Calculate overlap period
        const overlapStart = recurringStart > startDate ? recurringStart : startDate;
        const overlapEnd = recurringEnd < endDate ? recurringEnd : endDate;
        
        if (overlapStart <= overlapEnd) {
          // Calculate number of months in overlap period
          const monthsInPeriod = Math.max(0, 
            (overlapEnd.getFullYear() - overlapStart.getFullYear()) * 12 + 
            (overlapEnd.getMonth() - overlapStart.getMonth()) + 1
          );
          
          const monthlyAmount = expense.date_info.frequency === "Yearly" 
            ? expense.amount / 12 
            : expense.amount;
          
          const periodAmount = monthlyAmount * monthsInPeriod;
          
          if (periodAmount > 0) {
            periodExpenses.push({
              id: expense.id,
              name: expense.name,
              amount: periodAmount,
              date: overlapStart.toISOString(),
              type: "recurring"
            });
            totalExpenses += periodAmount;
          }
        }
      });

    // Sort by date
    periodRevenues.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    periodExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate ending balance
    const endBalance = startBalance + totalRevenue - totalExpenses;

    return NextResponse.json({
      startBalance,
      endBalance,
      totalRevenue,
      totalExpenses,
      revenues: periodRevenues,
      expenses: periodExpenses
    });
  } catch (error) {
    console.error("Error fetching historic data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historic data" },
      { status: 500 }
    );
  }
}