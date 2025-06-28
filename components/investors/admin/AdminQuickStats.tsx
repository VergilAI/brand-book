"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";

interface Stats {
  currentBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netCashFlow: number;
  lastUpdated: string;
}

export function AdminQuickStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [balancesRes, revenuesRes, expensesRes] = await Promise.all([
        fetch("/api/investors/balances"),
        fetch("/api/investors/revenues"),
        fetch("/api/investors/expenses")
      ]);

      const balances = await balancesRes.json();
      const revenues = await revenuesRes.json();
      const expenses = await expensesRes.json();

      // Calculate current balance
      const currentBalance = balances
        .filter((b: any) => b.type === "current")
        .reduce((sum: number, b: any) => sum + b.amount, 0);

      // Calculate monthly revenue (recurring)
      const monthlyRevenue = revenues
        .filter((r: any) => r.transaction_type === "recurring" && !r.is_hypothetical)
        .reduce((sum: number, r: any) => {
          if (r.date_info.frequency === "Yearly") {
            return sum + r.amount / 12;
          }
          return sum + r.amount;
        }, 0);

      // Calculate monthly expenses (recurring)
      const monthlyExpenses = expenses
        .filter((e: any) => e.transaction_type === "recurring" && !e.is_hypothetical)
        .reduce((sum: number, e: any) => {
          if (e.date_info.frequency === "Yearly") {
            return sum + e.amount / 12;
          }
          return sum + e.amount;
        }, 0);

      setStats({
        currentBalance,
        monthlyRevenue,
        monthlyExpenses,
        netCashFlow: monthlyRevenue - monthlyExpenses,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} variant="metric" className="animate-pulse">
            <div className="h-20"></div>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: "Current Balance",
      value: formatCurrency(stats.currentBalance),
      icon: Wallet,
      color: "text-cosmic-purple",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(stats.monthlyExpenses),
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      label: "Net Cash Flow",
      value: formatCurrency(stats.netCashFlow),
      icon: Activity,
      color: stats.netCashFlow >= 0 ? "text-green-600" : "text-red-600",
      bgColor: stats.netCashFlow >= 0 ? "bg-green-50" : "bg-red-50",
      borderColor: stats.netCashFlow >= 0 ? "border-green-200" : "border-red-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          variant="metric" 
          className={`p-3 lg:p-4 border ${metric.borderColor} ${metric.bgColor}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className={`text-lg lg:text-2xl font-bold font-display ${metric.color}`}>
                {metric.value}
              </p>
            </div>
            <metric.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${metric.color} opacity-50`} />
          </div>
        </Card>
      ))}
    </div>
  );
}