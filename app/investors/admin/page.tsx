"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VergilLogo } from "@/components/vergil/vergil-logo";
import { BalanceManager } from "@/components/investors/admin/BalanceManager";
import { RevenueManager } from "@/components/investors/admin/RevenueManager";
import { ExpenseManager } from "@/components/investors/admin/ExpenseManager";
import { HypotheticalManager } from "@/components/investors/admin/HypotheticalManager";
import { UserManager } from "@/components/investors/admin/UserManager";
import { MobileNav } from "@/components/investors/MobileNav";
import { Menu } from "lucide-react";

type TabType = "balances" | "revenues" | "expenses" | "hypotheticals" | "users";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'investor';
  name: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("balances");
  const [user, setUser] = useState<User | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/investors/auth');
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/investors/auth', { method: 'DELETE' });
      router.push('/investors/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const tabs = [
    { id: "balances" as TabType, label: "Balances", icon: "💰" },
    { id: "revenues" as TabType, label: "Revenues", icon: "📈" },
    { id: "expenses" as TabType, label: "Expenses", icon: "📉" },
    { id: "hypotheticals" as TabType, label: "Hypotheticals", icon: "🔮" },
    { id: "users" as TabType, label: "Users", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90">
      <div className="bg-gradient-to-b from-cosmic-purple/5 to-transparent">
        {/* Header */}
        <header className="border-b border-stone-gray/20 bg-pure-light/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 lg:py-6 max-w-7xl">
            {/* Mobile Navigation */}
            <MobileNav user={user} onLogout={handleLogout} />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
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
          <div className="overflow-x-auto -mx-4 px-4 mb-8">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-cosmic-purple text-white shadow-lg shadow-cosmic-purple/30"
                      : "bg-pure-light/10 text-stone-gray hover:bg-pure-light/20 hover:text-pure-light"
                  }`}
                >
                  <span className="text-base lg:text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === "balances" && <BalanceManager />}
            {activeTab === "revenues" && <RevenueManager />}
            {activeTab === "expenses" && <ExpenseManager />}
            {activeTab === "hypotheticals" && <HypotheticalManager />}
            {activeTab === "users" && <UserManager />}
          </div>
        </div>
      </div>
    </div>
  );
}