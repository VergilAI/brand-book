"use client";

import { useState, useEffect } from "react";
import { FinancialSummary } from "@/components/investors/FinancialSummary";
import { RevenueBreakdown } from "@/components/investors/RevenueBreakdown";
import { RecurringExpenses } from "@/components/investors/RecurringExpenses";
import { HypotheticalDeals } from "@/components/investors/HypotheticalDeals";
import { BurnRateChart, type OneTimeEvent, type RecurringItem } from "@/components/investors/BurnRateChart";
import { VergilLogo } from "@/components/vergil/vergil-logo";

interface DashboardData {
  current_balance: number;
  monthly_revenue: number;
  monthly_expenses: number;
  revenue_12month_avg: number;
  expense_12month_avg: number;
  burnrate: number;
  runway_months: number | null;
  actual_spending_this_month: number;
  zero_date: string | null;
}


export default function InvestorsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [oneTimeEvents, setOneTimeEvents] = useState<OneTimeEvent[]>([]);
  const [recurringRevenues, setRecurringRevenues] = useState<RecurringItem[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch dashboard data
      const dashboardResponse = await fetch("/api/investors/dashboard");
      const dashboardData = await dashboardResponse.json();
      setDashboardData(dashboardData);

      // Fetch revenues, expenses, and hypotheticals in parallel
      const [revenuesResponse, expensesResponse, hypotheticalsResponse] = await Promise.all([
        fetch("/api/investors/revenues"),
        fetch("/api/investors/expenses"),
        fetch("/api/investors/hypotheticals")
      ]);

      const revenues = await revenuesResponse.json();
      const expenses = await expensesResponse.json();
      const hypotheticals = await hypotheticalsResponse.json();

      // Process one-time events and recurring items
      const events: OneTimeEvent[] = [];
      const recRevenues: RecurringItem[] = [];
      const recExpenses: RecurringItem[] = [];

      revenues.forEach((item: any) => {
        if (item.transaction_type === "one-time" && item.date_info?.date) {
          events.push({
            date: item.date_info.date,
            amount: item.amount,
            name: item.source || "One-time revenue",
            type: "revenue"
          });
        } else if (item.transaction_type === "recurring") {
          recRevenues.push({
            name: item.name,
            source: item.source,
            amount: item.amount,
            transaction_type: item.transaction_type,
            date_info: item.date_info || {}
          });
        }
      });

      expenses.forEach((item: any) => {
        if ((item.transaction_type === "one-time" || item.transaction_type === "onetime") && item.date_info?.date) {
          events.push({
            date: item.date_info.date,
            amount: item.amount,
            name: item.source || item.name || "One-time expense",
            type: "expense"
          });
        } else if (item.transaction_type === "recurring") {
          recExpenses.push({
            name: item.name,
            source: item.source,
            amount: item.amount,
            transaction_type: item.transaction_type,
            date_info: item.date_info || {}
          });
        }
      });

      hypotheticals.forEach((item: any) => {
        if (item.enabled) {
          if (item.transaction_type === "one-time" && item.date_info?.date) {
            events.push({
              date: item.date_info.date,
              amount: item.amount * (item.probability || 1), // Apply probability to amount
              name: `${item.name} (${Math.round(item.probability * 100)}% probable)`,
              type: item.type as "revenue" | "expense"
            });
          } else if (item.transaction_type === "recurring") {
            const recurringItem: RecurringItem = {
              name: `${item.name} (${Math.round(item.probability * 100)}% probable)`,
              amount: item.amount * (item.probability || 1), // Apply probability to amount
              transaction_type: item.transaction_type,
              date_info: item.date_info || {}
            };
            
            if (item.type === "revenue") {
              recRevenues.push(recurringItem);
            } else {
              recExpenses.push(recurringItem);
            }
          }
        }
      });

      setOneTimeEvents(events);
      setRecurringRevenues(recRevenues);
      setRecurringExpenses(recExpenses);
    } catch (error) {
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90 flex items-center justify-center">
        <div className="animate-pulse text-cosmic-purple text-xl">Loading...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90 flex items-center justify-center">
        <div className="text-neural-pink text-xl">Failed to load financial data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90">
      <div className="bg-gradient-to-b from-cosmic-purple/5 to-transparent">
        {/* Header with Logo */}
        <header className="border-b border-stone-gray/20 bg-pure-light/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center gap-4">
              <VergilLogo variant="logo" size="lg" animated />
              <div className="h-8 w-px bg-stone-gray/30" />
              <div>
                <h1 className="text-2xl font-display font-bold text-pure-light mb-1">
                  Vergil Financial Status Panel
                </h1>
                <p className="text-stone-gray text-sm">
                  Real-time company financial health monitoring
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            <FinancialSummary data={dashboardData} />

            <BurnRateChart 
              currentBalance={dashboardData.current_balance}
              monthlyBurnRate={dashboardData.monthly_expenses}
              monthlyRevenue={dashboardData.monthly_revenue}
              oneTimeEvents={oneTimeEvents}
              recurringRevenues={recurringRevenues}
              recurringExpenses={recurringExpenses}
            />

            {/* Revenue and Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RevenueBreakdown />
              <RecurringExpenses />
            </div>

            {/* Hypothetical Deals */}
            <HypotheticalDeals onToggle={fetchAllData} />
          </div>
        </div>
      </div>
    </div>
  );
}