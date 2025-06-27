"use client";

import { useState, useEffect } from "react";

interface DashboardData {
  current_balance: number;
  monthly_revenue: number;
  monthly_expenses: number;
  revenue_12month_avg: number;
  expense_12month_avg: number;
  burnrate: number;
  runway_months: number | null;
}

export default function WorkingInvestorsPage() {
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
        {/* Header without logo for now */}
        <header className="border-b border-stone-gray/20 bg-pure-light/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center gap-4">
              {/* Placeholder for logo */}
              <div className="w-16 h-16 bg-cosmic-purple/20 rounded-lg flex items-center justify-center">
                <span className="text-cosmic-purple font-bold text-xl">V</span>
              </div>
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
            {/* Financial Summary - Manual implementation for now */}
            {dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  {
                    label: "Current Balance",
                    value: `$${parseInt(dashboardData.current_balance).toLocaleString()}`,
                    trend: "positive",
                  },
                  {
                    label: "Monthly Revenue", 
                    value: `$${parseInt(dashboardData.monthly_revenue).toLocaleString()}`,
                    subtitle: `12m avg: $${parseInt(dashboardData.revenue_12month_avg).toLocaleString()}`,
                  },
                  {
                    label: "Monthly Expenses",
                    value: `$${parseInt(dashboardData.monthly_expenses).toLocaleString()}`, 
                    subtitle: `12m avg: $${parseInt(dashboardData.expense_12month_avg).toLocaleString()}`,
                  },
                  {
                    label: "Burn Rate",
                    value: `$${parseInt(Math.abs(dashboardData.burnrate)).toLocaleString()}`,
                    trend: dashboardData.burnrate < 0 ? "positive" : "negative",
                  },
                  {
                    label: "Status",
                    value: dashboardData.burnrate < 0 ? "Profitable" : `${dashboardData.runway_months?.toFixed(1)} months`,
                    trend: dashboardData.burnrate < 0 ? "positive" : "warning",
                  },
                ].map((metric, index) => (
                  <div 
                    key={index} 
                    className="bg-pure-light/10 border border-stone-gray/20 animate-breathing backdrop-blur-sm hover:bg-pure-light/15 transition-colors rounded-lg p-6"
                  >
                    <p className="text-sm text-stone-gray mb-2 font-medium">{metric.label}</p>
                    <p className={`text-2xl font-bold font-display ${
                      metric.trend === "positive" 
                        ? "text-phosphor-cyan" 
                        : metric.trend === "negative"
                        ? "text-neural-pink"
                        : metric.trend === "warning"
                        ? "text-electric-violet"
                        : "text-pure-light"
                    }`}>
                      {metric.value}
                    </p>
                    {metric.subtitle && (
                      <p className="text-xs text-mist-gray mt-1">{metric.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Simple status message */}
            <div className="bg-pure-light/10 border border-stone-gray/20 backdrop-blur-sm rounded-lg p-8 text-center">
              <h2 className="text-xl font-display text-phosphor-cyan mb-4">Dashboard Status</h2>
              {dashboardData && (
                <p className="text-pure-light">
                  {dashboardData.burnrate < 0 
                    ? `✓ Company is profitable with ${Math.abs(dashboardData.burnrate).toFixed(0)}K positive cash flow per month`
                    : `⚠ Company has ${dashboardData.burnrate.toFixed(0)}K burn rate with ${dashboardData.runway_months?.toFixed(1)} months runway`
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}