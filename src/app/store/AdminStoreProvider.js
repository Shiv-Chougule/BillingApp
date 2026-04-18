'use client';

import { useEffect } from 'react';
import { useAdminStore } from './adminStore';

export default function AdminStoreProvider({ children }) {
  const initializeTheme = useAdminStore((state) => state.initializeTheme);
  const refreshAllData = useAdminStore((state) => state.refreshAllData);
  
  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  
  // Load initial data
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);
  
  return <>{children}</>;
}