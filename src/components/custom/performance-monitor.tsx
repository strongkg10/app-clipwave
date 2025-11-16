'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

export function PerformanceMonitor() {
  const [isOnline, setIsOnline] = useState(true);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Measure page load time
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      setLoadTime(pageLoadTime);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border ${
        isOnline 
          ? 'bg-green-500/20 border-green-500/50 text-green-400' 
          : 'bg-red-500/20 border-red-500/50 text-red-400'
      }`}>
        {isOnline ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="font-semibold">No Internet Connection</span>
          </>
        )}
      </div>
    </div>
  );
}

// Image Optimization Component
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  priority?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && !error && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg">
          <AlertCircle className="w-8 h-8 text-slate-500" />
        </div>
      )}
    </div>
  );
}

// Lazy Load Component
export function LazyLoad({ 
  children, 
  threshold = 0.1 
}: { 
  children: React.ReactNode; 
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-64 bg-slate-800/50 animate-pulse rounded-lg" />}
    </div>
  );
}
