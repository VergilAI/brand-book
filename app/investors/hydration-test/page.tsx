"use client";

import { useState, useEffect } from "react";

export default function HydrationTest() {
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Capture any errors
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `Error: ${event.message} at ${event.filename}:${event.lineno}`]);
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, `Unhandled Promise Rejection: ${event.reason}`]);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ color: '#00ff00', marginBottom: '20px' }}>Hydration Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Server vs Client Status:</strong>
        <div style={{ marginLeft: '20px' }}>
          <div>Server rendered: ✓ (You can see this text)</div>
          <div>Client hydrated: {isClient ? '✓ YES' : '❌ NO'}</div>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current Time:</strong>
        <div style={{ marginLeft: '20px' }}>
          {isClient ? new Date().toISOString() : 'Server time (static)'}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>JavaScript Errors:</strong>
        <div style={{ marginLeft: '20px' }}>
          {errors.length === 0 ? (
            <div style={{ color: '#00ff00' }}>No errors detected</div>
          ) : (
            errors.map((error, index) => (
              <div key={index} style={{ color: '#ff0000', marginBottom: '10px' }}>
                {error}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Instructions:</strong>
        <div style={{ marginLeft: '20px', fontSize: '14px' }}>
          <div>1. If you see "Client hydrated: ✓ YES" - React is working</div>
          <div>2. If you see "Client hydrated: ❌ NO" - React hydration failed</div>
          <div>3. Check browser console (F12) for additional errors</div>
          <div>4. Any red errors above indicate the problem</div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#333', 
        padding: '20px', 
        borderRadius: '5px',
        border: isClient ? '2px solid #00ff00' : '2px solid #ff0000'
      }}>
        <strong>Status: {isClient ? 'WORKING ✓' : 'FAILED ❌'}</strong>
        <br />
        {isClient ? 'React hydration successful!' : 'React hydration failed - check console for errors'}
      </div>
    </div>
  );
}