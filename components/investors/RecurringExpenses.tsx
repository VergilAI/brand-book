"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ExpenseItem {
  source: string;
  amount: number;
  type: string;
  transaction_type: string;
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

export function RecurringExpenses() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [actualSpending, setActualSpending] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/investors/expenses");
      const data: ExpenseItem[] = await response.json();
      
      // Filter for recurring expenses only
      const recurringExpenses = data.filter(item => item.transaction_type === "recurring");
      setExpenses(recurringExpenses);
      
      // Calculate monthly total from recurring expenses
      const total = recurringExpenses.reduce((sum, item) => {
        const multiplier = item.date_info.frequency === "yearly" ? 1/12 : 
                          item.date_info.frequency === "quarterly" ? 1/3 : 1;
        return sum + (item.amount * multiplier);
      }, 0);
      setMonthlyTotal(total);
      
      // Calculate actual spending this month (recurring + one-time from current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const oneTimeThisMonth = data
        .filter(item => item.transaction_type === "onetime" && item.date_info.date)
        .filter(item => {
          const date = new Date(item.date_info.date!);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, item) => sum + item.amount, 0);
      
      setActualSpending(total + oneTimeThisMonth);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <div>
          <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
            <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
            Monthly Expenses
          </CardTitle>
          <p className="text-2xl font-bold text-neural-pink mt-2">
            {formatCurrency(monthlyTotal)}
            <span className="text-sm font-normal text-gray-600 ml-2">per month</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Actual spending this month: <span className="font-semibold text-gray-900">{formatCurrency(actualSpending)}</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <div className="p-4 space-y-2">
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recurring expenses</p>
              ) : (
                expenses.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-neural-pink/5 transition-colors border border-gray-200 hover:border-neural-pink/20"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{item.source}</p>
                      <p className="text-sm text-gray-600">
                        {item.date_info.frequency} • 
                        {item.date_info.start_date} - {item.date_info.end_date || "Ongoing"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-neural-pink font-bold font-display">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {item.date_info.frequency}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}