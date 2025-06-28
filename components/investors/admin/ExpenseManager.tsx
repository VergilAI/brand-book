"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { AdminFormField, AdminFormGrid, AdminListItem } from "./AdminLayout";

interface ExpenseItem {
  id: string;
  name: string;
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

export function ExpenseManager() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recurring" | "one-time">("recurring");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ExpenseItem>>({
    transaction_type: "recurring",
    date_info: {},
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/investors/expenses");
      const data = await response.json();
      setExpenses(data);
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
      
      const response = await fetch("/api/investors/expenses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        fetchExpenses();
        setFormData({ transaction_type: activeTab, date_info: {} });
        setEditingId(null);
      }
    } catch (error) {
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      const response = await fetch(`/api/investors/expenses?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
    }
  };

  const handleEdit = (expense: ExpenseItem) => {
    setEditingId(expense.id);
    setFormData(expense);
    setActiveTab(expense.transaction_type);
  };

  const filteredExpenses = expenses.filter(e => e.transaction_type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-600">Loading expenses...</div>
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
          Recurring Expenses
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
          One-time Expenses
        </button>
      </div>

      {/* Add/Edit Form */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {editingId ? "Edit Expense" : `Add ${activeTab === "recurring" ? "Recurring" : "One-time"} Expense`}
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
                  placeholder="e.g., Engineering Salaries"
                  required
                />
              </div>
              
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
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" variant="default" className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                {editingId ? "Update Expense" : "Add Expense"}
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

      {/* Expenses List */}
      <Card variant="default" className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {activeTab === "recurring" ? "Recurring Expenses" : "One-time Expenses"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No {activeTab} expenses found
              </p>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{expense.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {expense.transaction_type === "recurring" ? (
                        <>
                          {expense.date_info.frequency} • 
                          {expense.date_info.start_date} - {expense.date_info.end_date || "Ongoing"}
                        </>
                      ) : (
                        expense.date_info.date
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600 font-display">
                        {formatCurrency(expense.amount)}
                      </p>
                      {expense.transaction_type === "recurring" && expense.date_info.frequency === "Yearly" && (
                        <p className="text-xs text-gray-600">
                          {formatCurrency(expense.amount / 12)}/mo
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(expense)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(expense.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
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