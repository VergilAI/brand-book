"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface RevenueItem {
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
  is_hypothetical?: boolean;
}

export function RevenueBreakdown() {
  const [revenues, setRevenues] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const response = await fetch("/api/investors/revenue");
      const data = await response.json();
      setRevenues(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
          <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
          Revenue Breakdown
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
              {revenues.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No revenue data available</p>
              ) : (
                revenues.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors border ${
                      item.is_hypothetical
                        ? "bg-cosmic-purple/5 border-cosmic-purple/30 border-dashed"
                        : "bg-gray-50 border-gray-200 hover:bg-cosmic-purple/5 hover:border-cosmic-purple/20"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${item.is_hypothetical ? "text-cosmic-purple" : "text-gray-900"}`}>
                          {item.source}
                        </p>
                        {item.is_hypothetical && (
                          <span className="px-2 py-0.5 text-xs bg-cosmic-purple/10 text-cosmic-purple rounded-full border border-cosmic-purple/20">
                            Potential
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.transaction_type === "recurring" ? (
                          <>
                            {item.date_info.frequency} • 
                            {item.date_info.start_date} - {item.date_info.end_date || "Ongoing"}
                          </>
                        ) : (
                          item.date_info.date || "TBD"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold font-display ${
                        item.is_hypothetical ? "text-cosmic-purple opacity-70" : "text-phosphor-cyan"
                      }`}>
                        {formatCurrency(item.amount)}
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