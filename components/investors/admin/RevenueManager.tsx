"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { AdminLayout, AdminForm, AdminFormField, AdminFormGrid, AdminListItem } from "./AdminLayout";

interface RevenueItem {
  id: string;
  source: string;
  amount: number;
  type: string;
  transaction_type: "recurring" | "one-time";
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
  is_hypothetical: boolean;
}

export function RevenueManager() {
  const [revenues, setRevenues] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recurring" | "one-time">("recurring");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<RevenueItem>>({
    transaction_type: "recurring",
    date_info: {},
  });

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const response = await fetch("/api/investors/revenues");
      const data = await response.json();
      setRevenues(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId 
        ? { ...formData, id: editingId } 
        : { ...formData, transaction_type: activeTab };
      
      const response = await fetch("/api/investors/revenues", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        fetchRevenues();
        setFormData({ transaction_type: activeTab, date_info: {} });
        setEditingId(null);
      }
    } catch (error) {
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this revenue?")) return;
    
    try {
      const response = await fetch(`/api/investors/revenues?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchRevenues();
      }
    } catch (error) {
    }
  };

  const handleEdit = (revenue: RevenueItem) => {
    setEditingId(revenue.id);
    setFormData(revenue);
    setActiveTab(revenue.transaction_type);
  };

  const filteredRevenues = revenues.filter(r => r.transaction_type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-600">Loading revenues...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveTab("recurring");
            setFormData({ transaction_type: "recurring", date_info: {} });
            setEditingId(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "recurring"
              ? "bg-cosmic-purple text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Recurring Revenue
        </button>
        <button
          onClick={() => {
            setActiveTab("one-time");
            setFormData({ transaction_type: "one-time", date_info: {} });
            setEditingId(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "one-time"
              ? "bg-cosmic-purple text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          One-time Revenue
        </button>
      </div>

      {/* Add/Edit Form */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {editingId ? "Edit Revenue" : `Add ${activeTab === "recurring" ? "Recurring" : "One-time"} Revenue`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminFormGrid columns={2}>
              <div className="sm:col-span-2">
                <AdminFormField label="Source">
                  <Input
                    type="text"
                    value={formData.source || ""}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900 focus:border-gray-400"
                    placeholder="e.g., Enterprise License - Acme Corp"
                    required
                  />
                </AdminFormField>
              </div>
              
              <AdminFormField label="Amount">
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900 focus:border-gray-400"
                  placeholder="0.00"
                  required
                />
              </AdminFormField>
              
              {activeTab === "recurring" ? (
                <>
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
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  
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
                    <label className="text-sm text-gray-600 mb-1 block">End Date (Optional)</label>
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
                </>
              ) : (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Date</label>
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
            </AdminFormGrid>
            
            <div className="flex gap-2">
              <Button type="submit" variant="default" className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                {editingId ? "Update Revenue" : "Add Revenue"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ transaction_type: activeTab, date_info: {} });
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

      {/* Revenues List */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {activeTab === "recurring" ? "Recurring Revenues" : "One-time Revenues"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredRevenues.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No {activeTab} revenues found
              </p>
            ) : (
              filteredRevenues.map((revenue) => (
                <AdminListItem
                  key={revenue.id}
                  title={revenue.source}
                  subtitle={
                    revenue.transaction_type === "recurring" 
                      ? `${revenue.date_info.frequency} • ${revenue.date_info.start_date} - ${revenue.date_info.end_date || "Ongoing"}`
                      : revenue.date_info.date
                  }
                  value={formatCurrency(revenue.amount)}
                  actions={
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(revenue)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 flex-1 sm:flex-initial"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(revenue.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-initial"
                      >
                        Delete
                      </Button>
                    </>
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <p className="text-gray-900 font-medium">{revenue.source}</p>
                      <p className="text-sm text-gray-600">
                        {revenue.transaction_type === "recurring" ? (
                          <>
                            {revenue.date_info.frequency} • 
                            {revenue.date_info.start_date} - {revenue.date_info.end_date || "Ongoing"}
                          </>
                        ) : (
                          revenue.date_info.date
                        )}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-bold text-green-600 font-display">
                          {formatCurrency(revenue.amount)}
                        </p>
                        {revenue.transaction_type === "recurring" && revenue.date_info.frequency === "Yearly" && (
                          <p className="text-xs text-gray-600">
                            {formatCurrency(revenue.amount / 12)}/mo
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(revenue)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-100 flex-1 sm:flex-initial"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(revenue.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-initial"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </AdminListItem>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}