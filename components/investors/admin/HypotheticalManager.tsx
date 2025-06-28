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
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
  subscription_churn_rate?: number;
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  enabled: boolean;
  description: string;
}

export function HypotheticalManager() {
  const [hypotheticals, setHypotheticals] = useState<HypotheticalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HypotheticalItem>>({
    type: "revenue",
    transaction_type: "one-time",
    recurring_type: "standard",
    date_info: {},
    enabled: true,
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
      
      // Prepare the payload
      let payload = { ...formData };
      
      // For subscriptions, set frequency to Monthly and calculate amount
      if (formData.recurring_type === "subscription") {
        payload.date_info = {
          ...formData.date_info,
          frequency: "Monthly"
        };
        // Amount is already calculated from users * price_per_user in the form
      }
      
      const body = editingId ? { ...payload, id: editingId } : payload;
      
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
          recurring_type: "standard",
          date_info: {},
          enabled: true,
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
        <div className="animate-pulse text-gray-600">Loading hypotheticals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {editingId ? "Edit Hypothetical" : "Add Hypothetical Scenario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">Name</label>
                <Input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Potential Enterprise Deal - BigCorp"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">Description</label>
                <Input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="Brief description of the scenario"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Type</label>
                <select
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "revenue" | "expense" })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                  required
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Transaction Type</label>
                <select
                  value={formData.transaction_type || ""}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as "recurring" | "one-time", recurring_type: "standard" })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                  required
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
              
              {/* Recurring Type selector */}
              {formData.transaction_type === "recurring" && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Recurring Type</label>
                  <select
                    value={formData.recurring_type || "standard"}
                    onChange={(e) => setFormData({ ...formData, recurring_type: e.target.value as "standard" | "subscription" })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                    required
                  >
                    <option value="standard">Standard</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
              )}
              
              {/* Subscription fields */}
              {formData.transaction_type === "recurring" && formData.recurring_type === "subscription" ? (
                <>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Number of Users</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.subscription_users || ""}
                      onChange={(e) => {
                        const users = parseInt(e.target.value);
                        const pricePerUser = formData.subscription_price_per_user || 0;
                        setFormData({ 
                          ...formData, 
                          subscription_users: users,
                          amount: users * pricePerUser
                        });
                      }}
                      className="bg-white border-gray-300 text-gray-900"
                      placeholder="100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Price per User</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.subscription_price_per_user || ""}
                      onChange={(e) => {
                        const pricePerUser = parseFloat(e.target.value);
                        const users = formData.subscription_users || 0;
                        setFormData({ 
                          ...formData, 
                          subscription_price_per_user: pricePerUser,
                          amount: users * pricePerUser
                        });
                      }}
                      className="bg-white border-gray-300 text-gray-900"
                      placeholder="29.99"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Growth Factor (%/month)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.subscription_growth_factor || ""}
                      onChange={(e) => setFormData({ ...formData, subscription_growth_factor: parseFloat(e.target.value) })}
                      className="bg-white border-gray-300 text-gray-900"
                      placeholder="5.0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Churn Rate (%/month)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.subscription_churn_rate || ""}
                      onChange={(e) => setFormData({ ...formData, subscription_churn_rate: parseFloat(e.target.value) })}
                      className="bg-white border-gray-300 text-gray-900"
                      placeholder="2.5"
                      required
                    />
                  </div>
                  
                  {/* Preview for subscription */}
                  <div className="md:col-span-2">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                      <strong>Preview:</strong> Starting with {formData.subscription_users || 0} users at {formatCurrency(formData.subscription_price_per_user || 0)}/month each = {formatCurrency((formData.subscription_users || 0) * (formData.subscription_price_per_user || 0))}/month
                      <br />
                      Net growth: +{formData.subscription_growth_factor || 0}% acquisition, -{formData.subscription_churn_rate || 0}% churn = {((formData.subscription_growth_factor || 0) - (formData.subscription_churn_rate || 0)).toFixed(1)}% monthly net growth
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Amount</label>
                  <Input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="0.00"
                    required
                  />
                </div>
              )}
              
              
              {formData.transaction_type === "recurring" ? (
                <>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                    <Input
                      type="date"
                      value={formData.date_info?.start_date || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        date_info: { ...formData.date_info, start_date: e.target.value }
                      })}
                      className="bg-white border-gray-300 text-gray-900"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">End Date (optional)</label>
                    <Input
                      type="date"
                      value={formData.date_info?.end_date || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        date_info: { ...formData.date_info, end_date: e.target.value }
                      })}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  
                  {/* Show frequency selector only for standard recurring */}
                  {formData.recurring_type === "standard" && (
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Frequency</label>
                      <select
                        value={formData.date_info?.frequency || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          date_info: { ...formData.date_info, frequency: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                        required
                      >
                        <option value="">Select frequency</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  )}
                  
                  {/* For subscriptions, show that frequency is monthly */}
                  {formData.recurring_type === "subscription" && (
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Frequency</label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600">
                        Monthly (subscriptions are billed monthly)
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Expected Date</label>
                  <Input
                    type="date"
                    value={formData.date_info?.date || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      date_info: { ...formData.date_info, date: e.target.value }
                    })}
                    className="bg-white border-gray-300 text-gray-900"
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
                  className="w-4 h-4 text-gray-700 bg-white border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="text-sm text-gray-600">
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
                      recurring_type: "standard",
                      date_info: {},
                      enabled: true,
                    });
                  }}
                  className="border-gray-300 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Hypotheticals List */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Hypothetical Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hypotheticals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hypothetical scenarios found</p>
            ) : (
              hypotheticals.map((hypothetical) => (
                <div
                  key={hypothetical.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    hypothetical.enabled
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className={`font-medium ${
                            hypothetical.enabled ? "text-gray-900" : "text-gray-500"
                          }`}>
                            {hypothetical.name}
                          </p>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            hypothetical.type === "revenue"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}>
                            {hypothetical.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{hypothetical.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hypothetical.transaction_type === "recurring" ? (
                            <>
                              {hypothetical.recurring_type === "subscription" ? (
                                <>
                                  Subscription: {hypothetical.subscription_users || 0} users × {formatCurrency(hypothetical.subscription_price_per_user || 0)} (+{hypothetical.subscription_growth_factor || 0}%/mo, -{hypothetical.subscription_churn_rate || 0}%/mo churn)
                                  <br />
                                  Starting {hypothetical.date_info.start_date}{hypothetical.date_info.end_date && ` - ${hypothetical.date_info.end_date}`}
                                </>
                              ) : (
                                <>
                                  {hypothetical.date_info.frequency} starting {hypothetical.date_info.start_date}
                                  {hypothetical.date_info.end_date && ` - ${hypothetical.date_info.end_date}`}
                                </>
                              )}
                            </>
                          ) : (
                            <>Expected: {hypothetical.date_info.date || "TBD"}</>
                          )}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg sm:text-xl font-bold font-display ${
                          hypothetical.type === "revenue" ? "text-green-600" : "text-red-600"
                        } ${!hypothetical.enabled && "opacity-50"}`}>
                          {formatCurrency(hypothetical.amount)}
                        </p>
                        {hypothetical.transaction_type === "recurring" && hypothetical.date_info.frequency === "Yearly" && (
                          <p className="text-xs text-gray-600">
                            {formatCurrency(hypothetical.amount / 12)}/mo
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Include in projections</span>
                        <button
                          onClick={() => handleToggle(hypothetical.id, !hypothetical.enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            hypothetical.enabled ? "bg-gray-700" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              hypothetical.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(hypothetical)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(hypothetical.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
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