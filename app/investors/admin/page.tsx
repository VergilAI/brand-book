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
import { AdminQuickStats } from "@/components/investors/admin/AdminQuickStats";
import { MobileNav } from "@/components/investors/MobileNav";
import { Menu, ChevronDown, Grid3X3 } from "lucide-react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

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
  const [showTabSelector, setShowTabSelector] = useState(false);

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
    { id: "balances" as TabType, label: "Balances" },
    { id: "revenues" as TabType, label: "Revenues" },
    { id: "expenses" as TabType, label: "Expenses" },
    { id: "hypotheticals" as TabType, label: "Hypotheticals" },
    { id: "users" as TabType, label: "Users" },
  ];

  // Swipe navigation between tabs
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const { isSwiping, swipeDirection, swipeProgress } = useSwipeGesture({
    onSwipeLeft: () => {
      if (currentTabIndex < tabs.length - 1) {
        setActiveTab(tabs[currentTabIndex + 1].id);
      }
    },
    onSwipeRight: () => {
      if (currentTabIndex > 0) {
        setActiveTab(tabs[currentTabIndex - 1].id);
      } else {
        // Swipe right on first tab goes back to dashboard
        router.push('/investors');
      }
    }
  }, {
    minSwipeDistance: 60,
    preventScrollOnSwipe: true
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5 relative overflow-hidden">
      {/* Swipe Visual Feedback */}
      {isSwiping && (
        <>
          {/* Left swipe indicator */}
          {swipeDirection === 'left' && currentTabIndex < tabs.length - 1 && (
            <div className="fixed inset-y-0 right-0 w-1 bg-electric-violet/50 z-50 lg:hidden">
              <div 
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-electric-violet to-transparent"
                style={{ 
                  width: `${swipeProgress * 100}px`,
                  opacity: swipeProgress 
                }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 right-4 text-electric-violet transition-all"
                style={{
                  opacity: swipeProgress,
                  transform: `translateY(-50%) translateX(${-20 * swipeProgress}px)`
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{tabs[currentTabIndex + 1].label}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Right swipe indicator */}
          {swipeDirection === 'right' && (
            <div className="fixed inset-y-0 left-0 w-1 bg-consciousness-cyan/50 z-50 lg:hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-consciousness-cyan to-transparent"
                style={{ 
                  width: `${swipeProgress * 100}px`,
                  opacity: swipeProgress 
                }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 left-4 text-consciousness-cyan transition-all"
                style={{
                  opacity: swipeProgress,
                  transform: `translateY(-50%) translateX(${20 * swipeProgress}px)`
                }}
              >
                {currentTabIndex > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tabs[currentTabIndex - 1].label}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Swipe Hints */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-2 z-40 lg:hidden pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 border border-gray-200 flex items-center gap-2">
          {currentTabIndex > 0 && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>{currentTabIndex === 0 ? 'Dashboard' : tabs[currentTabIndex - 1].label}</span>
            </>
          )}
          {currentTabIndex === 0 && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Dashboard</span>
            </>
          )}
          <span className="mx-2">•</span>
          {currentTabIndex < tabs.length - 1 && (
            <>
              <span>{tabs[currentTabIndex + 1].label}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </div>
      </div>
      
      <div className="">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 py-4 lg:py-6 max-w-7xl">
            {/* Mobile Navigation */}
            <MobileNav 
              user={user} 
              onLogout={handleLogout} 
              adminTab={activeTab} 
              onAdminTabChange={(tab) => setActiveTab(tab as TabType)} 
            />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VergilLogo variant="mark" size="lg" animated className="filter invert" />
                <h1 className="text-2xl font-display font-bold text-dark-900">
                  Vergil Finances
                </h1>
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
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
          {/* Quick Stats */}
          <AdminQuickStats />
          
          {/* Mobile Tab Selector */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowTabSelector(!showTabSelector)}
              className="w-full justify-between border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showTabSelector ? 'rotate-180' : ''}`} />
            </Button>

            {/* Mobile Tab Dropdown */}
            {showTabSelector && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowTabSelector(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      activeTab === tab.id
                        ? "bg-cosmic-purple/10 text-cosmic-purple"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="ml-auto text-xs bg-cosmic-purple/10 text-cosmic-purple px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden lg:flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-cosmic-purple text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
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