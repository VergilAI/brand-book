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
      trend: data.current_balance > 0 ? "positive" : "negative",
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(data.monthly_revenue),
      subtitle: `12m avg: ${formatCurrency(data.revenue_12month_avg)}`,
    },
    {
      label: "Monthly Expenses", 
      value: formatCurrency(data.monthly_expenses),
      subtitle: `Next 30 days: ${formatCurrency(data.actual_spending_this_month)}`,
    },
    {
      label: "Burn Rate",
      value: formatCurrency(Math.abs(data.burnrate)),
      trend: data.burnrate < 0 ? "positive" : "negative",
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
          className="bg-pure-light/10 border-stone-gray/20 animate-breathing backdrop-blur-sm hover:bg-pure-light/15 transition-colors"
        >
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <p className="text-xs sm:text-sm text-stone-gray mb-1 sm:mb-2 font-medium">{metric.label}</p>
            <p className={`text-xl sm:text-2xl font-bold font-display ${
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
              <p className="text-[10px] sm:text-xs text-mist-gray mt-1">{metric.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}