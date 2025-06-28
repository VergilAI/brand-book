"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface Balance {
  id: string;
  type: "starting" | "current";
  amount: number;
  date: string;
  description: string;
}

export function BalanceManager() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Balance>>({});

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await fetch("/api/investors/balances");
      const data = await response.json();
      setBalances(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;
      
      const response = await fetch("/api/investors/balances", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        fetchBalances();
        setFormData({});
        setEditingId(null);
      }
    } catch (error) {
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this balance?")) return;
    
    try {
      const response = await fetch(`/api/investors/balances?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchBalances();
      }
    } catch (error) {
    }
  };

  const handleEdit = (balance: Balance) => {
    setEditingId(balance.id);
    setFormData(balance);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-600">Loading balances...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {editingId ? "Edit Balance" : "Add Balance"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-medium">Type</label>
                  <select
                    value={formData.type || ""}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "starting" | "current" })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-cosmic-purple focus:ring-1 focus:ring-cosmic-purple/30"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="starting">Starting Balance</option>
                    <option value="current">Current Balance</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-medium">Amount</label>
                  <Input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-medium">Date</label>
                  <Input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-medium">Description</label>
                  <Input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
                    placeholder="Description"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" variant="default" className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                {editingId ? "Update Balance" : "Add Balance"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Balances List */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Current Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {balances.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No balances found</p>
            ) : (
              balances.map((balance) => (
                <div
                  key={balance.id}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          balance.type === "starting" 
                            ? "bg-gray-100 text-gray-700 border border-gray-300"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {balance.type === "starting" ? "Starting" : "Current"}
                        </span>
                        <p className="text-gray-900 font-medium">{balance.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <p className="text-sm text-gray-600">
                          {new Date(balance.date).toLocaleDateString()}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-cosmic-purple font-display">
                          {formatCurrency(balance.amount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(balance)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-initial"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(balance.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 flex-1 sm:flex-initial"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}