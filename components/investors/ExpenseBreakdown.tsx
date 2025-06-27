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

export function ExpenseBreakdown() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/investors/expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
          <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
          Expense Breakdown
        </CardTitle>
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
                <p className="text-gray-500 text-center py-8">No expense data available</p>
              ) : (
                expenses.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-cosmic-purple/5 transition-colors border border-gray-200 hover:border-cosmic-purple/20"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{item.source}</p>
                      <p className="text-sm text-gray-600">
                        {item.transaction_type === "recurring" ? (
                          <>
                            {item.date_info.frequency} • 
                            {item.date_info.start_date} - {item.date_info.end_date || "Ongoing"}
                          </>
                        ) : (
                          item.date_info.date
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-neural-pink font-bold font-display">
                        -{formatCurrency(item.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {item.transaction_type}
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