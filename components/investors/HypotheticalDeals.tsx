"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Hypothetical {
  id: string;
  name: string;
  description: string;
  type: "revenue" | "expense";
  transaction_type: "recurring" | "one-time";
  amount: number;
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  enabled: boolean;
}

interface HypotheticalDealsProps {
  onHypotheticalChange?: (monthlyRevenue: number) => void;
  onToggle?: () => void;
}


export function HypotheticalDeals({ onHypotheticalChange, onToggle }: HypotheticalDealsProps = {}) {
  const [hypotheticals, setHypotheticals] = useState<Hypothetical[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchHypotheticals();
  }, []);

  const fetchHypotheticals = async () => {
    try {
      const response = await fetch("/api/investors/hypotheticals");
      const data = await response.json();
      setHypotheticals(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate monthly revenue from active hypotheticals
  const calculateMonthlyHypotheticalRevenue = () => {
    return hypotheticals
      .filter(h => h.enabled && h.type === "revenue")
      .reduce((total, h) => {
        if (h.transaction_type === "recurring") {
          if ((h as any).recurring_type === "subscription") {
            // For subscriptions, use the base amount (users × price)
            return total + h.amount;
          } else {
            // For standard recurring items
            const freq = h.date_info.frequency?.toLowerCase();
            const multiplier = freq === "yearly" ? 1/12 : 
                              freq === "quarterly" ? 1/3 : 1;
            return total + (h.amount * multiplier);
          }
        }
        // Don't include one-time in monthly calculation
        return total;
      }, 0);
  };
  
  // Update parent when hypotheticals change
  useEffect(() => {
    if (onHypotheticalChange) {
      const monthlyRevenue = calculateMonthlyHypotheticalRevenue();
      onHypotheticalChange(monthlyRevenue);
    }
  }, [hypotheticals]);

  const toggleHypothetical = async (id: string, enabled: boolean) => {
    try {
      const hypothetical = hypotheticals.find(h => h.id === id);
      if (!hypothetical) return;
      
      await fetch("/api/investors/hypotheticals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hypothetical, enabled }),
      });
      
      fetchHypotheticals();
      
      // Trigger parent component to refresh data
      if (onToggle) {
        onToggle();
      }
    } catch (error) {
    }
  };

  const deleteHypothetical = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hypothetical?")) return;
    
    try {
      await fetch(`/api/investors/hypotheticals?id=${id}`, {
        method: "DELETE",
      });
      
      fetchHypotheticals();
    } catch (error) {
    }
  };


  return (
    <>
      <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
        <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
          <div>
            <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
              <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
              Hypotheticals
            </CardTitle>
            <p className="text-sm text-gray-600">
              Scenario planning and projections
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {hypotheticals.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-8">
                  No hypotheticals yet. Create one to start scenario planning!
                </p>
              ) : (
                hypotheticals.map(hypothetical => (
                  <Card
                    key={hypothetical.id}
                    variant="default"
                    className={`bg-white border ${
                      hypothetical.enabled
                        ? "border-cosmic-purple/30 shadow-sm"
                        : "border-gray-200"
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-xs leading-tight">
                              {hypothetical.name || `${hypothetical.type === "revenue" ? "Revenue" : "Expense"} Scenario`}
                            </h4>
                            <span className={`inline-block mt-1 px-1.5 py-0.5 text-xs rounded-full font-medium ${
                              hypothetical.type === "revenue" 
                                ? "bg-green-50 text-green-600 border border-green-200" 
                                : "bg-red-50 text-red-600 border border-red-200"
                            }`}>
                              {hypothetical.type === "revenue" ? "Revenue" : "Expense"}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteHypothetical(hypothetical.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
                            title="Delete"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div>
                          <p className={`text-base font-bold ${
                            hypothetical.type === "revenue"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}>
                            {hypothetical.type === "expense" && "-"}
                            {formatCurrency(hypothetical.amount)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {hypothetical.transaction_type === "one-time"
                              ? `Date: ${hypothetical.date_info.date || "Not set"}`
                              : (hypothetical as any).recurring_type === "subscription"
                              ? `${(hypothetical as any).subscription_users || 0} users × ${formatCurrency((hypothetical as any).subscription_price_per_user || 0)}`
                              : `${hypothetical.date_info.frequency || "Monthly"}`}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <span className="text-xs text-gray-600">Active</span>
                          <button
                            onClick={() => toggleHypothetical(hypothetical.id, !hypothetical.enabled)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              hypothetical.enabled ? "bg-cosmic-purple" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                hypothetical.enabled ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </>
  );
}