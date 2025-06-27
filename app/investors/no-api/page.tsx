"use client";

import { useState } from "react";

export default function NoApiPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-2xl mb-4">No API Test Page</h1>
      <p className="text-white mb-4">This page should work without any API calls.</p>
      
      <div className="bg-gray-800 p-4 rounded">
        <p className="text-white">Counter: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Click me
        </button>
      </div>
      
      <div className="mt-4 text-green-400">
        ✓ React state management working
      </div>
    </div>
  );
}