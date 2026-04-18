'use client';

import { useAdminStore } from './adminStore';
import { shallow } from "zustand/shallow";


// Individual data hooks
export const useInvoices = () => {
  const invoices = useAdminStore((state) => state.invoices);
  const fetchInvoices = useAdminStore((state) => state.fetchInvoices);
  const loading = useAdminStore((state) => state.loading.invoices);
  const error = useAdminStore((state) => state.errors.invoices);
  
  return { 
    invoices, 
    refreshInvoices: fetchInvoices, 
    isLoading: loading, 
    error 
  };
};

export const usePayments = () => {
  const payments = useAdminStore((state) => state.payments);
  const fetchPayments = useAdminStore((state) => state.fetchPayments);
  const loading = useAdminStore((state) => state.loading.payments);
  const error = useAdminStore((state) => state.errors.payments);
  
  return { 
    payments, 
    refreshPayments: fetchPayments, 
    isLoading: loading, 
    error 
  };
};

export const useCustomers = () => {
  const customers = useAdminStore((state) => state.customers);
  const fetchCustomers = useAdminStore((state) => state.fetchCustomers);
  const loading = useAdminStore((state) => state.loading.customers);
  const error = useAdminStore((state) => state.errors.customers);
  
  return { 
    customers, 
    refreshCustomers: fetchCustomers, 
    isLoading: loading, 
    error 
  };
};

export const useExpenses = () => {
  const expenses = useAdminStore((state) => state.expenses);
  const fetchExpenses = useAdminStore((state) => state.fetchExpenses);
  const loading = useAdminStore((state) => state.loading.expenses);
  const error = useAdminStore((state) => state.errors.expenses);
  
  return { 
    expenses, 
    refreshExpenses: fetchExpenses, 
    isLoading: loading, 
    error 
  };
};

// Theme hook
export const useTheme = () => {
  const dark = useAdminStore((state) => state.dark);
  const setTheme = useAdminStore((state) => state.setTheme);
  const initializeTheme = useAdminStore((state) => state.initializeTheme);
  
  return { dark, setTheme, initializeTheme };
};

// Hook that returns all data and functions (shallow comparison)
export const useAllAdminData = () => {
  const invoices = useAdminStore((state) => state.invoices);
  const payments = useAdminStore((state) => state.payments);
  const customers = useAdminStore((state) => state.customers);
  const expenses = useAdminStore((state) => state.expenses);
  const dark = useAdminStore((state) => state.dark);

  const fetchInvoices = useAdminStore((state) => state.fetchInvoices);
  const fetchPayments = useAdminStore((state) => state.fetchPayments);
  const fetchCustomers = useAdminStore((state) => state.fetchCustomers);
  const fetchExpenses = useAdminStore((state) => state.fetchExpenses);
  const refreshAllData = useAdminStore((state) => state.refreshAllData);

  const loading = useAdminStore((state) => state.loading);
  const errors = useAdminStore((state) => state.errors);
  const isLoading = useAdminStore((state) => state.isLoading);

  const getTotalRevenue = useAdminStore((state) => state.getTotalRevenue);
  const getReceivedAmount = useAdminStore((state) => state.getReceivedAmount);
  const getDueAmount = useAdminStore((state) => state.getDueAmount);
  const getTotalCustomers = useAdminStore((state) => state.getTotalCustomers);
  const getPendingInvoices = useAdminStore((state) => state.getPendingInvoices);
  const getOverdueInvoices = useAdminStore((state) => state.getOverdueInvoices);
  const getTotalExpenses = useAdminStore((state) => state.getTotalExpenses);
  const getNetProfit = useAdminStore((state) => state.getNetProfit);
  const getProfitMargin = useAdminStore((state) => state.getProfitMargin);

  const setTheme = useAdminStore((state) => state.setTheme);
  const initializeTheme = useAdminStore((state) => state.initializeTheme);

  return {
    invoices,
    payments,
    customers,
    expenses,
    dark,
    fetchInvoices,
    fetchPayments,
    fetchCustomers,
    fetchExpenses,
    refreshAllData,
    loading,
    errors,
    isLoading,
    getTotalRevenue,
    getReceivedAmount,
    getDueAmount,
    getTotalCustomers,
    getPendingInvoices,
    getOverdueInvoices,
    getTotalExpenses,
    getNetProfit,
    getProfitMargin,
    setTheme,
    initializeTheme,
  };
};

// Hook for calculations only (optimized)
export const useCalculations = () => {
  return useAdminStore(
    (state) => ({
      getTotalRevenue: state.getTotalRevenue,
      getReceivedAmount: state.getReceivedAmount,
      getDueAmount: state.getDueAmount,
      getTotalCustomers: state.getTotalCustomers,
      getPendingInvoices: state.getPendingInvoices,
      getOverdueInvoices: state.getOverdueInvoices,
      getTotalExpenses: state.getTotalExpenses,
      getNetProfit: state.getNetProfit,
      getProfitMargin: state.getProfitMargin,
    }),
    shallow
  );
};