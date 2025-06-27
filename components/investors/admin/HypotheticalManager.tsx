"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface HypotheticalItem {
  id: string;
  name: string;
  amount: number;
  type: "revenue" | "expense";
  transaction_type: "recurring" | "one-time";
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  enabled: boolean;
  probability: number;
  description: string;
}

export function HypotheticalManager() {
  const [hypotheticals, setHypotheticals] = useState<HypotheticalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HypotheticalItem>>({
    type: "revenue",
    transaction_type: "one-time",
    date_info: {},
    enabled: true,
    probability: 0.5,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;
      
      const response = await fetch("/api/investors/hypotheticals", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        fetchHypotheticals();
        setFormData({
          type: "revenue",
          transaction_type: "one-time",
          date_info: {},
          enabled: true,
          probability: 0.5,
        });
        setEditingId(null);
      }
    } catch (error) {
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const hypothetical = hypotheticals.find(h => h.id === id);
      if (!hypothetical) return;
      
      const response = await fetch("/api/investors/hypotheticals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hypothetical, enabled }),
      });
      
      if (response.ok) {
        fetchHypotheticals();
      }
    } catch (error) {
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hypothetical?")) return;
    
    try {
      const response = await fetch(`/api/investors/hypotheticals?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchHypotheticals();
      }
    } catch (error) {
    }
  };

  const handleEdit = (hypothetical: HypotheticalItem) => {
    setEditingId(hypothetical.id);
    setFormData(hypothetical);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-cosmic-purple">Loading hypotheticals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card variant="gradient" className="border-cosmic-purple/20">
        <CardHeader>
          <CardTitle className="text-pure-light">
            {editingId ? "Edit Hypothetical" : "Add Hypothetical Scenario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm text-stone-gray mb-1 block">Name</label>
                <Input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                  placeholder="e.g., Potential Enterprise Deal - BigCorp"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm text-stone-gray mb-1 block">Description</label>
                <Input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                  placeholder="Brief description of the scenario"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-stone-gray mb-1 block">Type</label>
                <select
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "revenue" | "expense" })}
                  className="w-full px-3 py-2 bg-pure-light/10 border border-stone-gray/30 rounded-md text-pure-light"
                  required
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-stone-gray mb-1 block">Transaction Type</label>
                <select
                  value={formData.transaction_type || ""}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as "recurring" | "one-time" })}
                  className="w-full px-3 py-2 bg-pure-light/10 border border-stone-gray/30 rounded-md text-pure-light"
                  required
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
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
                <label className="text-sm text-stone-gray mb-1 block">Probability (0-1)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.probability || ""}
                  onChange={(e) => setFormData({ ...formData, probability: parseFloat(e.target.value) })}
                  className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                  placeholder="0.5"
                  required
                />
              </div>
              
              {formData.transaction_type === "recurring" ? (
                <>
                  <div>
                    <label className="text-sm text-stone-gray mb-1 block">Frequency</label>
                    <select
                      value={formData.date_info?.frequency || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        date_info: { ...formData.date_info, frequency: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-pure-light/10 border border-stone-gray/30 rounded-md text-pure-light"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-stone-gray mb-1 block">Start Date</label>
                    <Input
                      type="date"
                      value={formData.date_info?.start_date || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        date_info: { ...formData.date_info, start_date: e.target.value }
                      })}
                      className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-sm text-stone-gray mb-1 block">Expected Date</label>
                  <Input
                    type="date"
                    value={formData.date_info?.date || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      date_info: { ...formData.date_info, date: e.target.value }
                    })}
                    className="bg-pure-light/10 border-stone-gray/30 text-pure-light"
                    required
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled || false}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 text-cosmic-purple bg-pure-light/10 border-stone-gray/30 rounded"
                />
                <label htmlFor="enabled" className="text-sm text-stone-gray">
                  Enable in calculations
                </label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" variant="default" className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                {editingId ? "Update Hypothetical" : "Add Hypothetical"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      type: "revenue",
                      transaction_type: "one-time",
                      date_info: {},
                      enabled: true,
                      probability: 0.5,
                    });
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

      {/* Hypotheticals List */}
      <Card variant="default" className="bg-pure-light/10 border-stone-gray/20">
        <CardHeader>
          <CardTitle className="text-pure-light">Hypothetical Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hypotheticals.length === 0 ? (
              <p className="text-stone-gray text-center py-8">No hypothetical scenarios found</p>
            ) : (
              hypotheticals.map((hypothetical) => (
                <div
                  key={hypothetical.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    hypothetical.enabled
                      ? "bg-cosmic-purple/10 border-cosmic-purple/30"
                      : "bg-pure-light/5 border-stone-gray/20"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className={`font-medium ${
                        hypothetical.enabled ? "text-pure-light" : "text-stone-gray"
                      }`}>
                        {hypothetical.name}
                      </p>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        hypothetical.type === "revenue"
                          ? "bg-phosphor-cyan/20 text-phosphor-cyan border border-phosphor-cyan/30"
                          : "bg-neural-pink/20 text-neural-pink border border-neural-pink/30"
                      }`}>
                        {hypothetical.type}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-electric-violet/20 text-electric-violet rounded-full border border-electric-violet/30">
                        {Math.round(hypothetical.probability * 100)}% likely
                      </span>
                    </div>
                    <p className="text-sm text-stone-gray mt-1">{hypothetical.description}</p>
                    <p className="text-xs text-mist-gray mt-1">
                      {hypothetical.transaction_type === "recurring" ? (
                        <>
                          {hypothetical.date_info.frequency} starting {hypothetical.date_info.start_date}
                        </>
                      ) : (
                        <>Expected: {hypothetical.date_info.date || "TBD"}</>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-xl font-bold font-display ${
                        hypothetical.type === "revenue" ? "text-phosphor-cyan" : "text-neural-pink"
                      } ${!hypothetical.enabled && "opacity-50"}`}>
                        {formatCurrency(hypothetical.amount)}
                      </p>
                      {hypothetical.transaction_type === "recurring" && hypothetical.date_info.frequency === "Yearly" && (
                        <p className="text-xs text-stone-gray">
                          {formatCurrency(hypothetical.amount / 12)}/mo
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(hypothetical.id, !hypothetical.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          hypothetical.enabled ? "bg-cosmic-purple" : "bg-stone-gray/30"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            hypothetical.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(hypothetical)}
                        className="border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/10"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(hypothetical.id)}
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