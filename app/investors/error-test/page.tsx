"use client";

import { useState, useEffect } from "react";

export default function ErrorTestPage() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const handleError = (event) => {
      setErrors(prev => [...prev, {
        type: 'error',
        message: event.error?.message || event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleUnhandledRejection = (event) => {
      setErrors(prev => [...prev, {
        type: 'unhandled-rejection',
        message: event.reason?.message || String(event.reason),
        timestamp: new Date().toISOString()
      }]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Try to import the problematic component
    const testImports = async () => {
      try {
        console.log("Testing imports...");
        
        // Test VergilLogo
        const { VergilLogo } = await import("@/components/vergil/vergil-logo");
        console.log("VergilLogo imported successfully");
        
        // Test Card components
        const { Card } = await import("@/components/ui/card");
        console.log("Card imported successfully");
        
        // Test FinancialSummary
        const { FinancialSummary } = await import("@/components/investors/FinancialSummary");
        console.log("FinancialSummary imported successfully");
        
      } catch (error) {
        console.error("Import error:", error);
        setErrors(prev => [...prev, {
          type: 'import-error',
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }]);
      }
    };

    testImports();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-2xl mb-4">Error Test Page</h1>
      
      {errors.length === 0 ? (
        <div className="text-green-400">
          ✓ No errors detected so far!
        </div>
      ) : (
        <div>
          <h2 className="text-red-400 text-xl mb-4">Errors Detected:</h2>
          {errors.map((error, index) => (
            <div key={index} className="bg-red-900 text-white p-4 rounded mb-4">
              <h3 className="font-bold">{error.type}</h3>
              <p className="text-sm">{error.timestamp}</p>
              <p className="mt-2">{error.message}</p>
              {error.stack && (
                <pre className="text-xs mt-2 bg-black p-2 rounded overflow-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-white text-xl mb-4">Console Output:</h2>
        <p className="text-gray-400 text-sm">Check the browser console (F12) for additional errors</p>
      </div>
    </div>
  );
}