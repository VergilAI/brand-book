"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FinancialSummary } from "@/components/investors/FinancialSummary";
import { RevenueBreakdown } from "@/components/investors/RevenueBreakdown";
import { RecurringExpenses } from "@/components/investors/RecurringExpenses";
import { OneTimePayments } from "@/components/investors/OneTimePayments";
import { HypotheticalDeals } from "@/components/investors/HypotheticalDeals";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const response = await fetch("/api/investors/dashboard");
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dashboard data:", data);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90 flex items-center justify-center">
        <div className="text-center">
          <div className="text-neural-pink text-xl font-display mb-2">Connection Error</div>
          <div className="text-stone-gray mb-4">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardData();
            }}
            className="bg-cosmic-purple text-white px-4 py-2 rounded hover:bg-cosmic-purple/80"
          >
            Retry
          </button>
        </div>
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
            {/* Financial Summary */}
            {dashboardData && (
              <FinancialSummary data={dashboardData} />
            )}

            {/* Revenue and Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RevenueBreakdown />
              <RecurringExpenses />
            </div>

            {/* One-time Payments */}
            <OneTimePayments />

            {/* Hypothetical Deals */}
            <HypotheticalDeals />
          </div>
        </div>
      </div>
    </div>
  );
}