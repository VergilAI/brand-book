"use client";

import { useState, useEffect } from "react";

export default function SimpleInvestorsPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const response = await fetch("/api/investors/dashboard");
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Dashboard data:", data);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">Connection Error</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              window.location.reload();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simple Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            Vergil Financial Status Panel
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time company financial health monitoring
          </p>
        </div>
      </header>

      {/* Simple Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Dashboard Data</h2>
          {dashboardData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-gray-300 text-sm">Current Balance</h3>
                <p className="text-2xl font-bold text-green-400">
                  ${parseInt(dashboardData.current_balance).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-gray-300 text-sm">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-blue-400">
                  ${parseInt(dashboardData.monthly_revenue).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-gray-300 text-sm">Monthly Expenses</h3>
                <p className="text-2xl font-bold text-red-400">
                  ${parseInt(dashboardData.monthly_expenses).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-gray-300 text-sm">Burn Rate</h3>
                <p className="text-2xl font-bold text-yellow-400">
                  ${parseInt(Math.abs(dashboardData.burnrate)).toLocaleString()}/month
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-gray-300 text-sm">Status</h3>
                <p className="text-2xl font-bold text-green-400">
                  {dashboardData.burnrate < 0 ? "Profitable" : "Burning"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}