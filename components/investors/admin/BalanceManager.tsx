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
        <div className="animate-pulse text-cosmic-purple">Loading balances...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card variant="gradient" className="border-cosmic-purple/20">
        <CardHeader>
          <CardTitle className="text-pure-light">
            {editingId ? "Edit Balance" : "Add Balance"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-stone-gray mb-1 block">Type</label>
                <select
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "starting" | "current" })}
                  className="w-full px-3 py-2 bg-pure-light/10 border border-stone-gray/30 rounded-md text-pure-light"
                  required
                >
                  <option value="">Select type</option>
                  <option value="starting">Starting Balance</option>
                  <option value="current">Current Balance</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-stone-gray mb-1 block">Amount</label>
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-stone-gray mb-1 block">Date</label>
                <Input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-stone-gray mb-1 block">Description</label>
                <Input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                  placeholder="Description"
                  required
                />
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
                  className="border-stone-gray/30 text-stone-gray hover:text-pure-light"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Balances List */}
      <Card variant="default" className="bg-pure-light/10 border-stone-gray/20">
        <CardHeader>
          <CardTitle className="text-pure-light">Current Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {balances.length === 0 ? (
              <p className="text-stone-gray text-center py-8">No balances found</p>
            ) : (
              balances.map((balance) => (
                <div
                  key={balance.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-pure-light/5 border border-stone-gray/20 hover:border-cosmic-purple/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        balance.type === "starting" 
                          ? "bg-electric-violet/20 text-electric-violet border border-electric-violet/30"
                          : "bg-phosphor-cyan/20 text-phosphor-cyan border border-phosphor-cyan/30"
                      }`}>
                        {balance.type === "starting" ? "Starting" : "Current"}
                      </span>
                      <p className="text-pure-light font-medium">{balance.description}</p>
                    </div>
                    <p className="text-sm text-stone-gray mt-1">
                      {new Date(balance.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-phosphor-cyan font-display">
                      {formatCurrency(balance.amount)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(balance)}
                        className="border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/10"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(balance.id)}
                        className="border-neural-pink/30 text-neural-pink hover:bg-neural-pink/10"
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