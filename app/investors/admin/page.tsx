"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VergilLogo } from "@/components/vergil/vergil-logo";
import { BalanceManager } from "@/components/investors/admin/BalanceManager";
import { RevenueManager } from "@/components/investors/admin/RevenueManager";
import { ExpenseManager } from "@/components/investors/admin/ExpenseManager";
import { HypotheticalManager } from "@/components/investors/admin/HypotheticalManager";

type TabType = "balances" | "revenues" | "expenses" | "hypotheticals";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("balances");

  const tabs = [
    { id: "balances" as TabType, label: "Balances", icon: "💰" },
    { id: "revenues" as TabType, label: "Revenues", icon: "📈" },
    { id: "expenses" as TabType, label: "Expenses", icon: "📉" },
    { id: "hypotheticals" as TabType, label: "Hypotheticals", icon: "🔮" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90">
      <div className="bg-gradient-to-b from-cosmic-purple/5 to-transparent">
        {/* Header */}
        <header className="border-b border-stone-gray/20 bg-pure-light/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <VergilLogo variant="logo" size="lg" animated />
                <div className="h-8 w-px bg-stone-gray/30" />
                <div>
                  <h1 className="text-2xl font-display font-bold text-pure-light mb-1">
                    Financial Admin Panel
                  </h1>
                  <p className="text-stone-gray text-sm">
                    Manage financial data and projections
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/10"
                onClick={() => window.location.href = "/investors"}
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-cosmic-purple text-white shadow-lg shadow-cosmic-purple/30"
                    : "bg-pure-light/10 text-stone-gray hover:bg-pure-light/20 hover:text-pure-light"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === "balances" && <BalanceManager />}
            {activeTab === "revenues" && <RevenueManager />}
            {activeTab === "expenses" && <ExpenseManager />}
            {activeTab === "hypotheticals" && <HypotheticalManager />}
          </div>
        </div>
      </div>
    </div>
  );
}