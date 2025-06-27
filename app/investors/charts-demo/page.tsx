"use client";

import { BurnRateChart, RevenueChart } from "@/components/investors";

// Demo data
const revenueData = [
  { month: "2024-01", revenue: 1500000, type: "recurring" },
  { month: "2024-02", revenue: 1650000, type: "recurring" },
  { month: "2024-03", revenue: 1800000, type: "recurring" },
  { month: "2024-04", revenue: 2500000, type: "one-time" },
  { month: "2024-05", revenue: 1950000, type: "recurring" },
  { month: "2024-06", revenue: 2100000, type: "recurring" },
];

const oneTimeEvents = [
  { date: "2024-04-15", amount: 500000, name: "Grant Payment", type: "revenue" as const },
  { date: "2024-06-01", amount: 200000, name: "Equipment Purchase", type: "expense" as const },
];

export default function ChartsDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cosmic-purple mb-2">
            Mobile-Optimized Charts Demo
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Test the responsive chart components on different screen sizes
          </p>
        </div>

        {/* Burn Rate Chart */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Burn Rate Chart
          </h2>
          <BurnRateChart
            currentBalance={10000000}
            monthlyBurnRate={800000}
            monthlyRevenue={600000}
            oneTimeEvents={oneTimeEvents}
          />
        </div>

        {/* Revenue Chart */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Revenue Chart
          </h2>
          <RevenueChart data={revenueData} />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg border border-cosmic-purple/20 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Mobile Features:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• <strong>Touch Support:</strong> Tap on charts to see details (mobile only)</li>
            <li>• <strong>Horizontal Scroll:</strong> Charts maintain readability with horizontal scrolling</li>
            <li>• <strong>Responsive Axes:</strong> Labels adjust for mobile screens</li>
            <li>• <strong>Compact Legends:</strong> Space-efficient legend layout</li>
            <li>• <strong>Touch Tooltips:</strong> Tap-activated tooltips that auto-dismiss</li>
          </ul>
        </div>
      </div>
    </div>
  );
}