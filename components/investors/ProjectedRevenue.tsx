"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ProjectionData {
  period: string;
  recurring_revenue: number;
  hypothetical_revenue: number;
  total_projected: number;
}

interface ProjectedRevenueProps {
  refreshTrigger?: number; // Optional prop to trigger refresh
}

export function ProjectedRevenue({ refreshTrigger }: ProjectedRevenueProps = {}) {
  const [projection, setProjection] = useState<ProjectionData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("1month");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjections();
  }, [selectedPeriod, refreshTrigger]);

  const fetchProjections = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/investors/analytics/projections?period=${selectedPeriod}`
      );
      const data = await response.json();
      
      // Convert string values to numbers if needed
      const projectionData = {
        period: data.period,
        recurring_revenue: typeof data.recurring_revenue === 'number' ? data.recurring_revenue : parseFloat(data.recurring_revenue),
        hypothetical_revenue: typeof data.hypothetical_revenue === 'number' ? data.hypothetical_revenue : parseFloat(data.hypothetical_revenue),
        total_projected: typeof data.total_projected === 'number' ? data.total_projected : parseFloat(data.total_projected)
      };
      
      console.log('Projection data received:', projectionData);
      setProjection(projectionData);
    } catch (error) {
      console.error("Error fetching projections:", error);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: "1month", label: "1 Month" },
    { value: "1quarter", label: "1 Quarter" },
    { value: "1year", label: "1 Year" },
  ];

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
          <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
          Revenue Projections
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on recurring revenue and active hypothetical deals
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {periods.map(period => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-100 rounded" />
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          ) : projection ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Recurring Revenue</p>
                <p className="text-2xl font-bold text-consciousness-cyan">
                  {formatCurrency(projection.recurring_revenue)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Hypothetical Revenue</p>
                <p className="text-2xl font-bold text-electric-violet">
                  {formatCurrency(projection.hypothetical_revenue)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-cosmic-purple/10 to-electric-violet/10 rounded-lg p-4 border border-cosmic-purple/30">
                <p className="text-sm text-gray-600 mb-1">Total Projected</p>
                <p className="text-2xl font-bold text-cosmic-purple">
                  {formatCurrency(projection.total_projected)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}