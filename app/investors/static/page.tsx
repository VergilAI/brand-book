"use client";

import { useState, useEffect } from "react";

export default function StaticPage() {
  const [loading, setLoading] = useState(true);
  const [data] = useState({
    current_balance: 2500000,
    monthly_revenue: 515000,
    monthly_expenses: 483333,
    revenue_12month_avg: 285833,
    expense_12month_avg: 414583,
    burnrate: -31666,
    runway_months: null
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading static data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-2xl mb-4">Static Data Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-gray-300 text-sm">Current Balance</h3>
          <p className="text-2xl font-bold text-green-400">
            ${data.current_balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-gray-300 text-sm">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-blue-400">
            ${data.monthly_revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-gray-300 text-sm">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-red-400">
            ${data.monthly_expenses.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-green-400">
        ✓ Static data rendering works!
      </div>
    </div>
  );
}