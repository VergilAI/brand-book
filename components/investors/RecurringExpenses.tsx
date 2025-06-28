"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ExpenseItem {
  id?: string;
  name?: string;
  source?: string;
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
  const [activeTab, setActiveTab] = useState<"recurring" | "one-time">("recurring");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/investors/expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const recurringExpenses = expenses.filter(e => e.transaction_type === "recurring");
  const oneTimeExpenses = expenses.filter(e => e.transaction_type === "one-time" || e.transaction_type === "onetime");
  
  // Calculate monthly total from recurring expenses
  const monthlyTotal = recurringExpenses.reduce((sum, item) => {
    const freq = item.date_info.frequency?.toLowerCase();
    const multiplier = freq === "yearly" ? 1/12 : 
                      freq === "quarterly" ? 1/3 : 1;
    return sum + (item.amount * multiplier);
  }, 0);
  
  // Calculate one-time total
  const oneTimeTotal = oneTimeExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  const renderExpenseItem = (item: ExpenseItem, index: number) => (
    <div
      key={index}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-3 rounded-lg bg-gray-50 hover:bg-neural-pink/5 transition-colors border border-gray-200 hover:border-neural-pink/20"
    >
      <div className="flex-1 mb-3 sm:mb-0">
        <p className="text-gray-900 font-medium">{item.name || item.source}</p>
        <p className="text-sm text-gray-600 mt-1">
          {item.transaction_type === "recurring" ? (
            <>
              <span className="block sm:inline">{item.date_info.frequency}</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline text-xs sm:text-sm">
                {item.date_info.start_date} - {item.date_info.end_date || "Ongoing"}
              </span>
            </>
          ) : (
            item.date_info.date
          )}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-red-600 font-bold font-display text-lg sm:text-base">
          {formatCurrency(item.amount)}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {item.transaction_type === "recurring" && item.date_info.frequency && 
           (item.date_info.frequency.toLowerCase() === "yearly" || item.date_info.frequency.toLowerCase() === "quarterly")
            ? `${formatCurrency(item.amount / (item.date_info.frequency.toLowerCase() === "yearly" ? 12 : 3))}/mo` 
            : item.date_info.frequency || "One-time"}
        </p>
      </div>
    </div>
  );

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <div>
          <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
            <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
            Expense Breakdown
          </CardTitle>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setActiveTab("recurring")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-0 ${
                activeTab === "recurring"
                  ? "bg-cosmic-purple text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="block sm:inline">Recurring</span>
              <span className="block sm:inline sm:ml-2 text-xs opacity-80">
                {formatCurrency(monthlyTotal)}/mo
              </span>
            </button>
            <button
              onClick={() => setActiveTab("one-time")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-0 ${
                activeTab === "one-time"
                  ? "bg-cosmic-purple text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="block sm:inline">One-time</span>
              <span className="block sm:inline sm:ml-2 text-xs opacity-80">
                {formatCurrency(oneTimeTotal)}
              </span>
            </button>
          </div>
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
              {activeTab === "recurring" ? (
                recurringExpenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recurring expenses</p>
                ) : (
                  recurringExpenses.map((item, index) => renderExpenseItem(item, index))
                )
              ) : (
                oneTimeExpenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No one-time expenses</p>
                ) : (
                  oneTimeExpenses.map((item, index) => renderExpenseItem(item, index))
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}