"use client";

import { useState, useEffect } from "react";

export default function FetchDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const testFetch = async () => {
    setIsLoading(true);
    setLogs([]);
    
    try {
      addLog("Starting fetch...");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        addLog("Fetch timed out after 10 seconds");
      }, 10000);
      
      addLog("Making fetch request to /api/investors/dashboard");
      
      const response = await fetch("/api/investors/dashboard", {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      clearTimeout(timeoutId);
      addLog(`Response received with status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      addLog("Parsing JSON...");
      const result = await response.json();
      addLog("JSON parsed successfully");
      
      setData(result);
      addLog("Data set in state");
      
    } catch (error) {
      if (error.name === 'AbortError') {
        addLog("Fetch was aborted due to timeout");
      } else {
        addLog(`Error: ${error.message}`);
      }
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
      addLog("Fetch completed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-2xl mb-4">Fetch Debug Page</h1>
      
      <button 
        onClick={testFetch}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 disabled:bg-gray-600"
      >
        {isLoading ? "Testing..." : "Test Fetch"}
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-white text-xl mb-2">Logs:</h2>
          <div className="bg-black p-4 rounded h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-green-400 text-sm font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-white text-xl mb-2">Data:</h2>
          <div className="bg-black p-4 rounded h-64 overflow-y-auto">
            {data ? (
              <pre className="text-green-400 text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400">No data yet</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-yellow-400">
        <p>Instructions:</p>
        <ul className="list-disc list-inside text-sm">
          <li>Click "Test Fetch" to debug the API call</li>
          <li>Watch the logs to see where it gets stuck</li>
          <li>Check browser console (F12) for additional errors</li>
          <li>Check Network tab in dev tools to see the actual request</li>
        </ul>
      </div>
    </div>
  );
}