"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface FinancialSummaryProps {
  data: {
    current_balance: number;
    monthly_revenue: number;
    monthly_expenses: number;
    revenue_12month_avg: number;
    expense_12month_avg: number;
    burnrate: number;
    runway_months: number | null;
    actual_spending_this_month: number;
    zero_date: string | null;
  };
}

export function FinancialSummary({ data }: FinancialSummaryProps) {
  const metrics = [
    {
      label: "Current Balance",
      value: formatCurrency(data.current_balance),
      trend: "neutral",
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(data.monthly_revenue),
      subtitle: `12m avg: ${formatCurrency(data.revenue_12month_avg)}`,
      trend: "positive",
    },
    {
      label: "Monthly Expenses", 
      value: `-${formatCurrency(data.monthly_expenses)}`,
      subtitle: `Next 30 days: ${formatCurrency(data.actual_spending_this_month)}`,
      trend: "negative",
    },
    {
      label: "Net Burn Rate",
      value: data.burnrate > 0 ? `-${formatCurrency(Math.abs(data.burnrate))}` : formatCurrency(Math.abs(data.burnrate)),
      trend: data.burnrate > 0 ? "negative" : "positive",
      subtitle: data.burnrate > 0 ? "Spending more than earning" : "Earning more than spending",
    },
    {
      label: "Runway",
      value: data.runway_months 
        ? `${formatNumber(data.runway_months)} months`
        : "∞",
      subtitle: data.zero_date 
        ? `Zero: ${new Date(data.zero_date).toLocaleDateString('hu-HU', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}`
        : undefined,
      trend: data.runway_months && data.runway_months > 12 ? "positive" : "warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          variant="metric" 
          className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">{metric.label}</p>
            <p className={`text-xl sm:text-2xl font-bold font-display ${
              metric.trend === "positive" 
                ? "text-green-600" 
                : metric.trend === "negative"
                ? "text-red-600"
                : "text-cosmic-purple"
            }`}>
              {metric.value}
            </p>
            {metric.subtitle && (
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{metric.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}