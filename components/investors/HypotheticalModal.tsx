"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface HypotheticalFormData {
  name: string;
  description: string;
  type: "revenue" | "expense";
  transaction_type: "recurring" | "one-time";
  amount: number;
  enabled: boolean;
  recurring_type?: "standard" | "subscription";
  subscription_users?: number;
  subscription_price_per_user?: number;
  subscription_growth_factor?: number;
  date_info: {
    date?: string;
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

interface HypotheticalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: HypotheticalFormData) => void;
  hypothetical?: {
    id?: string;
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
  } | null;
}

export function HypotheticalModal({ open, onClose, onSuccess, hypothetical }: HypotheticalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "revenue",
    transaction_type: "one-time",
    recurring_type: "standard", // standard or subscription
    amount: "",
    expected_date: "",
    start_date: "",
    end_date: "",
    frequency: "Monthly",
    enabled: true,
    // Subscription fields
    subscription_users: "",
    subscription_price_per_user: "",
    subscription_growth_factor: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Update form when editing
  useEffect(() => {
    if (hypothetical) {
      setFormData({
        name: hypothetical.name || "",
        description: hypothetical.description || "",
        type: hypothetical.type,
        transaction_type: hypothetical.transaction_type,
        recurring_type: (hypothetical as any).recurring_type || "standard",
        amount: hypothetical.amount.toString(),
        expected_date: hypothetical.date_info.date || "",
        start_date: hypothetical.date_info.start_date || "",
        end_date: hypothetical.date_info.end_date || "",
        frequency: hypothetical.date_info.frequency || "Monthly",
        enabled: hypothetical.enabled,
        subscription_users: (hypothetical as any).subscription_users?.toString() || "",
        subscription_price_per_user: (hypothetical as any).subscription_price_per_user?.toString() || "",
        subscription_growth_factor: (hypothetical as any).subscription_growth_factor?.toString() || "",
      });
    } else {
      // Reset form when creating new
      setFormData({
        name: "",
        description: "",
        type: "revenue",
        transaction_type: "one-time",
        recurring_type: "standard",
        amount: "",
        expected_date: "",
        start_date: "",
        end_date: "",
        frequency: "Monthly",
        enabled: true,
        subscription_users: "",
        subscription_price_per_user: "",
        subscription_growth_factor: "",
      });
    }
    setErrors({});
  }, [hypothetical]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Amount validation (only for non-subscription types)
    if (formData.transaction_type !== "recurring" || formData.recurring_type !== "subscription") {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    }

    // Subscription validation
    if (formData.transaction_type === "recurring" && formData.recurring_type === "subscription") {
      if (!formData.subscription_users || parseInt(formData.subscription_users) <= 0) {
        newErrors.subscription_users = "Number of users must be greater than 0";
      }
      if (!formData.subscription_price_per_user || parseFloat(formData.subscription_price_per_user) <= 0) {
        newErrors.subscription_price_per_user = "Price per user must be greater than 0";
      }
      if (!formData.subscription_growth_factor || parseFloat(formData.subscription_growth_factor) < 0) {
        newErrors.subscription_growth_factor = "Growth factor must be 0 or positive";
      }
    }
    
    // Date validation
    if (formData.transaction_type === "one-time") {
      if (!formData.expected_date) {
        newErrors.expected_date = "Expected date is required";
      } else {
        const expectedDate = new Date(formData.expected_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (expectedDate < today) {
          newErrors.expected_date = "Expected date cannot be in the past";
        }
      }
    } else {
      // Recurring validation (applies to both standard and subscription)
      if (!formData.start_date) {
        newErrors.start_date = "Start date is required";
      }
      
      if (formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        if (endDate <= startDate) {
          newErrors.end_date = "End date must be after start date";
        }
      }
      
      if (formData.start_date) {
        const startDate = new Date(formData.start_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
          newErrors.start_date = "Start date cannot be in the past";
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Format dates as ISO strings
    const formatDateForBackend = (dateStr: string) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };
    
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      transaction_type: formData.transaction_type,
      amount: formData.transaction_type === "recurring" && formData.recurring_type === "subscription" 
        ? parseInt(formData.subscription_users) * parseFloat(formData.subscription_price_per_user)
        : parseFloat(formData.amount),
      enabled: formData.enabled,
      recurring_type: formData.transaction_type === "recurring" ? formData.recurring_type : undefined,
      subscription_users: formData.transaction_type === "recurring" && formData.recurring_type === "subscription" 
        ? parseInt(formData.subscription_users) : undefined,
      subscription_price_per_user: formData.transaction_type === "recurring" && formData.recurring_type === "subscription" 
        ? parseFloat(formData.subscription_price_per_user) : undefined,
      subscription_growth_factor: formData.transaction_type === "recurring" && formData.recurring_type === "subscription" 
        ? parseFloat(formData.subscription_growth_factor) : undefined,
      date_info: formData.transaction_type === "one-time"
        ? { date: formatDateForBackend(formData.expected_date) }
        : {
            start_date: formatDateForBackend(formData.start_date),
            end_date: formData.end_date ? formatDateForBackend(formData.end_date) : null,
            frequency: formData.recurring_type === "subscription" ? "Monthly" : formData.frequency,
          },
    };

    onSuccess(payload);
    setFormData({
      name: "",
      description: "",
      type: "revenue",
      transaction_type: "one-time",
      recurring_type: "standard",
      amount: "",
      expected_date: "",
      start_date: "",
      end_date: "",
      frequency: "Monthly",
      enabled: true,
      subscription_users: "",
      subscription_price_per_user: "",
      subscription_growth_factor: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-800 border-dark-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {hypothetical ? "Edit Hypothetical" : "Create Hypothetical"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Enterprise Contract Q2, New Client Acquisition"
              className="bg-dark-700 border-dark-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this scenario..."
              className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white placeholder-gray-400 resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-dark-700 border-dark-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-700 border-dark-600 text-white">
                  <SelectItem value="revenue" className="text-white hover:bg-dark-600">Revenue</SelectItem>
                  <SelectItem value="expense" className="text-white hover:bg-dark-600">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Transaction Type</label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => setFormData({ ...formData, transaction_type: value, recurring_type: "standard" })}
              >
                <SelectTrigger className="bg-dark-700 border-dark-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-700 border-dark-600 text-white">
                  <SelectItem value="one-time" className="text-white hover:bg-dark-600">One-time</SelectItem>
                  <SelectItem value="recurring" className="text-white hover:bg-dark-600">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show Recurring Type selector only for recurring transactions */}
          {formData.transaction_type === "recurring" && (
            <div className="mb-4">
              <label className="text-sm text-gray-400 block mb-2">Recurring Type</label>
              <select
                value={formData.recurring_type}
                onChange={(e) => setFormData({ ...formData, recurring_type: e.target.value })}
                className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white focus:border-cosmic-purple outline-none"
              >
                <option value="">Select recurring type</option>
                <option value="standard">Standard</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          )}
          
          {/* Debug info - remove this later */}
          {formData.transaction_type === "recurring" && (
            <div className="text-xs text-yellow-400 mb-2">
              Debug: Transaction type is "{formData.transaction_type}", Recurring type is "{formData.recurring_type}"
            </div>
          )}

          {/* Subscription-specific fields */}
          {formData.transaction_type === "recurring" && formData.recurring_type === "subscription" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Number of Users</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.subscription_users}
                    onChange={(e) => {
                      setFormData({ ...formData, subscription_users: e.target.value });
                      if (errors.subscription_users) {
                        setErrors({ ...errors, subscription_users: "" });
                      }
                    }}
                    placeholder="100"
                    className={`bg-dark-700 border-dark-600 ${errors.subscription_users ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.subscription_users && (
                    <p className="text-red-400 text-xs mt-1">{errors.subscription_users}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-400">Price per User</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.subscription_price_per_user}
                    onChange={(e) => {
                      setFormData({ ...formData, subscription_price_per_user: e.target.value });
                      if (errors.subscription_price_per_user) {
                        setErrors({ ...errors, subscription_price_per_user: "" });
                      }
                    }}
                    placeholder="29.99"
                    className={`bg-dark-700 border-dark-600 ${errors.subscription_price_per_user ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.subscription_price_per_user && (
                    <p className="text-red-400 text-xs mt-1">{errors.subscription_price_per_user}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-400">Growth Factor (%/month)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.subscription_growth_factor}
                    onChange={(e) => {
                      setFormData({ ...formData, subscription_growth_factor: e.target.value });
                      if (errors.subscription_growth_factor) {
                        setErrors({ ...errors, subscription_growth_factor: "" });
                      }
                    }}
                    placeholder="5.0"
                    className={`bg-dark-700 border-dark-600 ${errors.subscription_growth_factor ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.subscription_growth_factor && (
                    <p className="text-red-400 text-xs mt-1">{errors.subscription_growth_factor}</p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-dark-800 p-3 rounded">
                <p><strong>Preview:</strong> Starting with {formData.subscription_users || "0"} users at {formatCurrency(parseFloat(formData.subscription_price_per_user) || 0)}/month each = {formatCurrency((parseInt(formData.subscription_users) || 0) * (parseFloat(formData.subscription_price_per_user) || 0))}/month</p>
                <p>Users growing at {formData.subscription_growth_factor || "0"}% per month (price stays constant)</p>
              </div>
            </div>
          )}

          {/* Amount field for non-subscription items */}
          {!(formData.transaction_type === "recurring" && formData.recurring_type === "subscription") && (
            <div>
              <label className="text-sm text-gray-400">Amount</label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) {
                    setErrors({ ...errors, amount: "" });
                  }
                }}
                placeholder="0.00"
                className={`bg-dark-700 border-dark-600 ${errors.amount ? 'border-red-500' : ''}`}
                required
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
              )}
            </div>
          )}

          {/* Date fields section */}
          {formData.transaction_type === "one-time" ? (
            <div>
              <label className="text-sm text-gray-400">Expected Date</label>
              <Input
                type="date"
                value={formData.expected_date}
                onChange={(e) => {
                  setFormData({ ...formData, expected_date: e.target.value });
                  if (errors.expected_date) {
                    setErrors({ ...errors, expected_date: "" });
                  }
                }}
                className={`bg-dark-700 border-dark-600 ${errors.expected_date ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.expected_date && (
                <p className="text-red-400 text-xs mt-1">{errors.expected_date}</p>
              )}
            </div>
          ) : formData.transaction_type === "recurring" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => {
                      setFormData({ ...formData, start_date: e.target.value });
                      if (errors.start_date) {
                        setErrors({ ...errors, start_date: "" });
                      }
                    }}
                    className={`bg-dark-700 border-dark-600 ${errors.start_date ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.start_date && (
                    <p className="text-red-400 text-xs mt-1">{errors.start_date}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-400">End Date (optional)</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => {
                      setFormData({ ...formData, end_date: e.target.value });
                      if (errors.end_date) {
                        setErrors({ ...errors, end_date: "" });
                      }
                    }}
                    className={`bg-dark-700 border-dark-600 ${errors.end_date ? 'border-red-500' : ''}`}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                  />
                  {errors.end_date && (
                    <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>
                  )}
                </div>
              </div>
              
              {/* Only show frequency for standard recurring (subscriptions are typically monthly) */}
              {formData.recurring_type === "standard" && (
                <div>
                  <label className="text-sm text-gray-400">Frequency</label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger className="bg-dark-700 border-dark-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600 text-white">
                      <SelectItem value="Monthly" className="text-white hover:bg-dark-600">Monthly</SelectItem>
                      <SelectItem value="Quarterly" className="text-white hover:bg-dark-600">Quarterly</SelectItem>
                      <SelectItem value="Yearly" className="text-white hover:bg-dark-600">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* For subscriptions, frequency is fixed to Monthly */}
              {formData.recurring_type === "subscription" && (
                <div>
                  <label className="text-sm text-gray-400">Frequency</label>
                  <div className="p-3 bg-dark-800 border border-dark-600 rounded text-gray-400 text-sm">
                    Monthly (subscriptions are billed monthly)
                  </div>
                </div>
              )}
            </>
          ) : null}

          {errors.submit && (
            <div className="p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
              {errors.submit}
            </div>
          )}
          
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-cosmic-purple hover:bg-cosmic-purple/80">
              {hypothetical ? "Update" : "Create"} Hypothetical
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}