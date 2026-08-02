import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>অফলাইন মোড সক্রিয় — মেমো ও ডাটা পরিবর্তন ব্রাউজার স্টোরেজে সংরক্ষিত হচ্ছে।</span>
      </div>
    </div>
  );
};
