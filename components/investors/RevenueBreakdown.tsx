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
  const [activeTab, setActiveTab] = useState<"recurring" | "one-time">("recurring");

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const response = await fetch("/api/investors/revenues");
      const data = await response.json();
      setRevenues(data);
    } catch (error) {
      setRevenues([]);
    } finally {
      setLoading(false);
    }
  };

  const recurringRevenues = revenues.filter(r => r.transaction_type === "recurring");
  const oneTimeRevenues = revenues.filter(r => r.transaction_type === "one-time");
  
  const recurringTotal = recurringRevenues.reduce((sum, item) => {
    const multiplier = item.date_info.frequency === "Yearly" ? 1/12 : 1;
    return sum + (item.amount * multiplier);
  }, 0);
  
  const oneTimeTotal = oneTimeRevenues.reduce((sum, item) => sum + item.amount, 0);

  const renderRevenueItem = (item: RevenueItem, index: number) => (
    <div
      key={index}
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-3 rounded-lg transition-colors border ${
        item.is_hypothetical
          ? "bg-cosmic-purple/5 border-cosmic-purple/30 border-dashed"
          : "bg-gray-50 border-gray-200 hover:bg-cosmic-purple/5 hover:border-cosmic-purple/20"
      }`}
    >
      <div className="flex-1 mb-3 sm:mb-0">
        <div className="flex items-start sm:items-center gap-2 flex-wrap">
          <p className={`font-medium ${item.is_hypothetical ? "text-cosmic-purple" : "text-gray-900"}`}>
            {item.source}
          </p>
          {item.is_hypothetical && (
            <span className="px-2 py-0.5 text-xs bg-cosmic-purple/10 text-cosmic-purple rounded-full border border-cosmic-purple/20 whitespace-nowrap">
              Potential
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {item.transaction_type === "recurring" ? (
            <>
              <span className="block sm:inline">{item.date_info.frequency}</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline text-xs sm:text-sm">
                {item.date_info.start_date} - {item.date_info.end_date || "Ongoing"}
              </span>
            </>
          ) : (
            item.date_info.date || "TBD"
          )}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className={`font-bold font-display text-lg sm:text-base ${
          item.is_hypothetical ? "text-cosmic-purple opacity-70" : "text-phosphor-cyan"
        }`}>
          {formatCurrency(item.amount)}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {item.transaction_type === "recurring" && item.date_info.frequency === "Yearly" 
            ? `${formatCurrency(item.amount / 12)}/mo` 
            : item.date_info.frequency || "One-time"}
        </p>
      </div>
    </div>
  );

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
          <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
          Revenue Breakdown
        </CardTitle>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setActiveTab("recurring")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-0 ${
              activeTab === "recurring"
                ? "bg-cosmic-purple text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="block sm:inline">Recurring</span>
            <span className="block sm:inline sm:ml-2 text-xs opacity-80">
              {formatCurrency(recurringTotal)}/mo
            </span>
          </button>
          <button
            onClick={() => setActiveTab("one-time")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-0 ${
              activeTab === "one-time"
                ? "bg-cosmic-purple text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="block sm:inline">One-time</span>
            <span className="block sm:inline sm:ml-2 text-xs opacity-80">
              {formatCurrency(oneTimeTotal)}
            </span>
          </button>
        </div>
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
              {activeTab === "recurring" ? (
                recurringRevenues.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recurring revenue</p>
                ) : (
                  recurringRevenues.map((item, index) => renderRevenueItem(item, index))
                )
              ) : (
                oneTimeRevenues.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No one-time revenue</p>
                ) : (
                  oneTimeRevenues.map((item, index) => renderRevenueItem(item, index))
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}