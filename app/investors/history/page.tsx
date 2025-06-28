"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { VergilLogo } from "@/components/vergil/vergil-logo";

interface HistoricData {
  startBalance: number;
  endBalance: number;
  totalRevenue: number;
  totalExpenses: number;
  revenues: Array<{
    id: string;
    name: string;
    amount: number;
    date: string;
    type: string;
  }>;
  expenses: Array<{
    id: string;
    name: string;
    amount: number;
    date: string;
    type: string;
  }>;
}

export default function HistoricDataPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<HistoricData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default dates (last 3 months)
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(threeMonthsAgo.toISOString().split('T')[0]);
  }, []);

  const fetchHistoricData = async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/investors/history?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (response.ok) {
        const historicData = await response.json();
        setData(historicData);
      }
    } catch (error) {
      console.error("Failed to fetch historic data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchHistoricData();
    }
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/investors")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <VergilLogo variant="mark" size="lg" animated className="filter invert" />
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-dark-900">
              Historic Financial Data
            </h1>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card variant="default" className="p-6 mb-6 bg-white border-gray-200 shadow-sm">
          <h2 className="text-lg font-display font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cosmic-purple" />
            Select Date Range
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
              />
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-gray-600">Loading historic data...</div>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card variant="metric" className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Starting Balance</p>
                    <p className="text-2xl font-bold font-display text-cosmic-purple">
                      {formatCurrency(data.startBalance)}
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-cosmic-purple opacity-50" />
                </div>
              </Card>

              <Card variant="metric" className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold font-display text-green-600">
                      {formatCurrency(data.totalRevenue)}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600 opacity-50" />
                </div>
              </Card>

              <Card variant="metric" className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
                    <p className="text-2xl font-bold font-display text-red-600">
                      -{formatCurrency(data.totalExpenses)}
                    </p>
                  </div>
                  <TrendingDown className="w-5 h-5 text-red-600 opacity-50" />
                </div>
              </Card>

              <Card variant="metric" className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Ending Balance</p>
                    <p className="text-2xl font-bold font-display text-cosmic-purple">
                      {formatCurrency(data.endBalance)}
                    </p>
                    <p className={`text-xs mt-1 ${data.endBalance - data.startBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.endBalance - data.startBalance >= 0 ? '+' : ''}{formatCurrency(data.endBalance - data.startBalance)}
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-cosmic-purple opacity-50" />
                </div>
              </Card>
            </div>

            {/* Revenue List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="default" className="bg-white border-gray-200 shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-display font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Revenue Items
                  </h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.revenues.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No revenue in this period</p>
                    ) : (
                      data.revenues.map((item) => (
                        <div key={item.id} className="p-4 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(item.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full font-medium ${
                                item.type === 'recurring' 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                {item.type}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-green-600 font-display">
                              +{formatCurrency(item.amount)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              {/* Expense List */}
              <Card variant="default" className="bg-white border-gray-200 shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-display font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Expense Items
                  </h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.expenses.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No expenses in this period</p>
                    ) : (
                      data.expenses.map((item) => (
                        <div key={item.id} className="p-4 rounded-lg bg-red-50 border border-red-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(item.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full font-medium ${
                                item.type === 'recurring' 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                {item.type}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-red-600 font-display">
                              -{formatCurrency(item.amount)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}