"use client";

import { useState, useEffect } from "react";

export default function SimpleTest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch("/api/investors/dashboard");
        console.log("Response:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Data:", result);
        setData(result);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <div className="text-white p-8">
      <h1 className="text-2xl mb-4">Test Data:</h1>
      <pre className="bg-gray-800 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}