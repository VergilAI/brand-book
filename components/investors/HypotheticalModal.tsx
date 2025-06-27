"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HypotheticalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
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
    probability: number;
  } | null;
}

export function HypotheticalModal({ open, onClose, onSuccess, hypothetical }: HypotheticalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "revenue",
    transaction_type: "one-time",
    amount: "",
    expected_date: "",
    start_date: "",
    end_date: "",
    frequency: "Monthly",
    probability: "0.5",
    enabled: true,
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
        amount: hypothetical.amount.toString(),
        expected_date: hypothetical.date_info.date || "",
        start_date: hypothetical.date_info.start_date || "",
        end_date: hypothetical.date_info.end_date || "",
        frequency: hypothetical.date_info.frequency || "Monthly",
        probability: hypothetical.probability.toString(),
        enabled: hypothetical.enabled,
      });
    } else {
      // Reset form when creating new
      setFormData({
        name: "",
        description: "",
        type: "revenue",
        transaction_type: "one-time",
        amount: "",
        expected_date: "",
        start_date: "",
        end_date: "",
        frequency: "Monthly",
        probability: "0.5",
        enabled: true,
      });
    }
    setErrors({});
  }, [hypothetical]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Amount validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    // Probability validation
    if (!formData.probability || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 1) {
      newErrors.probability = "Probability must be between 0 and 1";
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
      amount: parseFloat(formData.amount),
      probability: parseFloat(formData.probability),
      enabled: formData.enabled,
      date_info: formData.transaction_type === "one-time"
        ? { date: formatDateForBackend(formData.expected_date) }
        : {
            start_date: formatDateForBackend(formData.start_date),
            end_date: formData.end_date ? formatDateForBackend(formData.end_date) : null,
            frequency: formData.frequency,
          },
    };

    onSuccess(payload);
    setFormData({
      name: "",
      description: "",
      type: "revenue",
      transaction_type: "one-time",
      amount: "",
      expected_date: "",
      start_date: "",
      end_date: "",
      frequency: "Monthly",
      probability: "0.5",
      enabled: true,
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
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Transaction Type</label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
              >
                <SelectTrigger className="bg-dark-700 border-dark-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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

          <div>
            <label className="text-sm text-gray-400">Probability (0-1)</label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={formData.probability}
              onChange={(e) => {
                setFormData({ ...formData, probability: e.target.value });
                if (errors.probability) {
                  setErrors({ ...errors, probability: "" });
                }
              }}
              placeholder="0.5"
              className={`bg-dark-700 border-dark-600 ${errors.probability ? 'border-red-500' : ''}`}
              required
            />
            {errors.probability && (
              <p className="text-red-400 text-xs mt-1">{errors.probability}</p>
            )}
          </div>

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
          ) : (
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
              <div>
                <label className="text-sm text-gray-400">Frequency</label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger className="bg-dark-700 border-dark-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

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