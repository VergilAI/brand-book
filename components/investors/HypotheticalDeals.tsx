"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { HypotheticalModal } from "./HypotheticalModal";

interface Hypothetical {
  id: number;
  name?: string;
  description?: string;
  type: string;
  transaction_type: string;
  amount: number;
  expected_date?: string;
  start_date?: string;
  end_date?: string;
  frequency?: string;
  is_active: boolean;
  created_at: string;
}

interface HypotheticalDealsProps {
  onHypotheticalChange?: (monthlyRevenue: number) => void;
}

export function HypotheticalDeals({ onHypotheticalChange }: HypotheticalDealsProps = {}) {
  const [hypotheticals, setHypotheticals] = useState<Hypothetical[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHypothetical, setEditingHypothetical] = useState<Hypothetical | null>(null);

  useEffect(() => {
    fetchHypotheticals();
  }, []);
  
  // Calculate monthly revenue from active hypotheticals
  const calculateMonthlyHypotheticalRevenue = () => {
    return hypotheticals
      .filter(h => h.is_active && h.type === "revenue")
      .reduce((total, h) => {
        if (h.transaction_type === "recurring") {
          const multiplier = h.frequency === "yearly" ? 1/12 : 
                            h.frequency === "quarterly" ? 1/3 : 1;
          return total + (h.amount * multiplier);
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

  const fetchHypotheticals = async () => {
    try {
      const response = await fetch("/api/investors/hypotheticals");
      const data = await response.json();
      setHypotheticals(data);
    } catch (error) {
      console.error("Error fetching hypotheticals:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHypothetical = async (id: number) => {
    try {
      await fetch(`/api/investors/hypotheticals/${id}/toggle`, {
        method: "PATCH",
      });
      fetchHypotheticals();
    } catch (error) {
      console.error("Error toggling hypothetical:", error);
    }
  };

  const deleteHypothetical = async (id: number) => {
    try {
      await fetch(`/api/investors/hypotheticals/${id}`, {
        method: "DELETE",
      });
      fetchHypotheticals();
    } catch (error) {
      console.error("Error deleting hypothetical:", error);
    }
  };

  return (
    <>
      <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
        <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
                <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
                Hypotheticals
              </CardTitle>
              <p className="text-sm text-gray-600">
                Scenario planning and projections
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-cosmic-purple hover:bg-cosmic-purple/80"
            >
              Create New Hypothetical
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      hypothetical.is_active
                        ? "border-cosmic-purple/30 shadow-sm"
                        : "border-gray-200"
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {hypothetical.name || `${hypothetical.type === "revenue" ? "Revenue" : "Expense"} Scenario`}
                          </h4>
                          {hypothetical.description && (
                            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                              {hypothetical.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => {
                              setEditingHypothetical(hypothetical);
                              setModalOpen(true);
                            }}
                            className="text-gray-400 hover:text-cosmic-purple transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteHypothetical(hypothetical.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          hypothetical.type === "revenue" 
                            ? "bg-consciousness-cyan/10 text-consciousness-cyan" 
                            : "bg-red-100 text-red-600"
                        }`}>
                          {hypothetical.type === "revenue" ? "Revenue" : "Expense"}
                        </span>
                        <p className={`text-lg font-bold ${
                          hypothetical.type === "revenue"
                            ? "text-consciousness-cyan"
                            : "text-red-500"
                        }`}>
                          {hypothetical.type === "expense" && "-"}
                          {formatCurrency(hypothetical.amount)}
                        </p>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-3">
                        {hypothetical.transaction_type === "onetime"
                          ? `Date: ${hypothetical.expected_date || "Not set"}`
                          : `${hypothetical.frequency || "Monthly"} • ${hypothetical.start_date || "Not set"} - ${
                              hypothetical.end_date || "Ongoing"
                            }`}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">
                          Include in projections
                        </label>
                        <Switch
                          checked={hypothetical.is_active}
                          onCheckedChange={() => toggleHypothetical(hypothetical.id)}
                          className="data-[state=checked]:bg-cosmic-purple"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <HypotheticalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHypothetical(null);
        }}
        onSuccess={() => {
          setModalOpen(false);
          setEditingHypothetical(null);
          fetchHypotheticals();
        }}
        hypothetical={editingHypothetical}
      />
    </>
  );
}