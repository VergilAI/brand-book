"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { VergilLogo } from "@/components/vergil/vergil-logo";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { MobileNav } from "@/components/investors/MobileNav";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { DashboardSkeleton } from "@/components/investors/SkeletonScreens";
import { usePerformanceMonitor } from "@/lib/performance";
import { preloadComponent } from "@/components/investors/LazyLoad";
import { prefetchCriticalResources } from "@/lib/bundle-optimization";
import { OfflineIndicator } from "@/components/investors/OfflineIndicator";

// Lazy load heavy components
const FinancialSummary = lazy(() => 
  import("@/components/investors/FinancialSummary").then(mod => ({ 
    default: mod.FinancialSummary 
  }))
);

const RevenueBreakdown = lazy(() => 
  import("@/components/investors/RevenueBreakdown").then(mod => ({ 
    default: mod.RevenueBreakdown 
  }))
);

const RecurringExpenses = lazy(() => 
  import("@/components/investors/RecurringExpenses").then(mod => ({ 
    default: mod.RecurringExpenses 
  }))
);

const HypotheticalDeals = lazy(() => 
  import("@/components/investors/HypotheticalDeals").then(mod => ({ 
    default: mod.HypotheticalDeals 
  }))
);

const BurnRateChart = lazy(() => 
  import("@/components/investors/BurnRateChart").then(mod => ({ 
    default: mod.BurnRateChart 
  }))
);


// Type imports and services
import type { OneTimeEvent, RecurringItem } from "@/lib/investors/financialDataService";
import { FinancialDataService } from "@/lib/investors/financialDataService";

interface DashboardData {
  current_balance: number;
  monthly_revenue: number;
  monthly_expenses: number;
  revenue_12month_avg: number;
  expense_12month_avg: number;
  burnrate: number;
  runway_months: number | null;
  actual_spending_this_month: number;
  zero_date: string | null;
}

interface User {
  id: string;
  email: string;
  role: 'admin' | 'investor';
  name: string;
}


export default function InvestorsPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [oneTimeEvents, setOneTimeEvents] = useState<OneTimeEvent[]>([]);
  const [recurringRevenues, setRecurringRevenues] = useState<RecurringItem[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Performance monitoring
  usePerformanceMonitor();

  // Prefetch critical resources
  useEffect(() => {
    prefetchCriticalResources();
  }, []);

  // Preload components that are likely to be needed
  useEffect(() => {
    preloadComponent(() => import("@/components/investors/FinancialSummary"));
    preloadComponent(() => import("@/components/investors/BurnRateChart"));
  }, []);

  // Swipe to admin panel for admin users
  const { isSwiping, swipeDirection, swipeProgress } = useSwipeGesture({
    onSwipeLeft: () => {
      if (user?.role === 'admin') {
        router.push('/investors/admin');
      }
    }
  }, {
    minSwipeDistance: 80,
    preventScrollOnSwipe: true
  });

  useEffect(() => {
    checkAuth();
    fetchAllData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/investors/auth');
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        // Preload admin components if user is admin
        if (data.user.role === 'admin') {
          preloadComponent(() => import("@/components/investors/HypotheticalDeals"));
        }
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

  const fetchAllData = async () => {
    try {
      // Fetch dashboard data
      const dashboardResponse = await fetch("/api/investors/dashboard");
      const dashboardData = await dashboardResponse.json();
      setDashboardData(dashboardData);

      // Fetch and process all financial data using service
      const financialData = await FinancialDataService.fetchAllFinancialData();
      
      setOneTimeEvents(financialData.oneTimeEvents);
      setRecurringRevenues(financialData.recurringRevenues);
      setRecurringExpenses(financialData.recurringExpenses);

      // Preload lower priority components after data is loaded
      preloadComponent(() => import("@/components/investors/RevenueBreakdown"));
      preloadComponent(() => import("@/components/investors/RecurringExpenses"));
    } catch (error) {
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5">
        <div className="bg-white/50 backdrop-blur-sm">
          {/* Header Skeleton */}
          <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 max-w-7xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  <div>
                    <div className="h-6 w-48 bg-gray-200 rounded mb-1 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Content Skeleton */}
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5 flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load financial data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5 relative overflow-hidden">
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Swipe Visual Feedback */}
      {isSwiping && swipeDirection === 'left' && user?.role === 'admin' && (
        <div className="fixed inset-y-0 right-0 w-1 bg-cosmic-purple/50 z-50 lg:hidden">
          <div 
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-cosmic-purple to-transparent"
            style={{ 
              width: `${swipeProgress * 100}px`,
              opacity: swipeProgress 
            }}
          />
        </div>
      )}
      
      {/* Swipe Indicator for Admin Users */}
      {user?.role === 'admin' && (
        <div className="fixed right-2 top-1/2 -translate-y-1/2 z-40 lg:hidden">
          <div className="bg-cosmic-purple/20 backdrop-blur-sm rounded-full p-2 animate-pulse">
            <div className="text-cosmic-purple text-xs font-medium flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 7l-5 5 5 5" />
              </svg>
              <span>Admin</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="">
        {/* Header with Logo */}
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 py-2 lg:py-3 max-w-7xl">
            {/* Mobile Navigation */}
            <MobileNav user={user} onLogout={handleLogout} />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VergilLogo variant="mark" size="md" animated className="filter invert" />
                <h1 className="text-xl font-display font-bold text-dark-900">
                  Vergil Finances
                </h1>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <div className="text-right mr-3">
                    <p className="text-sm text-dark-900 font-medium">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.role === 'admin' ? 'Administrator' : 'Investor'}</p>
                  </div>
                )}
                {user?.role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/investors/admin')}
                    className="border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            <Suspense fallback={<DashboardSkeleton />}>
              <FinancialSummary data={dashboardData} />

              <BurnRateChart 
                currentBalance={dashboardData.current_balance}
                monthlyBurnRate={dashboardData.monthly_expenses}
                monthlyRevenue={dashboardData.monthly_revenue}
                runwayMonths={dashboardData.runway_months}
                oneTimeEvents={oneTimeEvents}
                recurringRevenues={recurringRevenues}
                recurringExpenses={recurringExpenses}
              />

              {/* Revenue and Expense Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RevenueBreakdown />
                <RecurringExpenses />
              </div>

              {/* Hypothetical Deals */}
              <HypotheticalDeals onToggle={fetchAllData} />
            </Suspense>
            
          </div>
        </div>
      </div>
    </div>
  );
}