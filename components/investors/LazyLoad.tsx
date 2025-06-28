'use client';

import { Suspense, lazy, ComponentType, ReactNode } from 'react';

interface LazyLoadProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
}

export function LazyLoad({ loader, fallback, props = {} }: LazyLoadProps) {
  const Component = lazy(loader);

  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-dark-800 rounded-lg h-64" />}>
      <Component {...props} />
    </Suspense>
  );
}

// Preload component utility
export function preloadComponent(loader: () => Promise<{ default: ComponentType<any> }>) {
  // Trigger the dynamic import to start loading
  loader();
}

// Intersection Observer hook for lazy loading
export function useLazyLoad(
  ref: React.RefObject<HTMLElement>,
  onIntersect: () => void,
  options?: IntersectionObserverInit
) {
  const { useEffect } = require('react');
  
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect();
        observer.disconnect();
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, onIntersect, options]);
}