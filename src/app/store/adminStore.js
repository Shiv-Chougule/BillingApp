'use client';

import { create } from 'zustand';
import axios from 'axios';

export const useAdminStore = create((set, get) => ({
  // State
  invoices: [],
  payments: [],
  customers: [],
  expenses: [],
  performaInvoices: [],
  activePage: 'dashboard',
  dark: false,
  loading: {},
  errors: {},

  //method to setActivePage
  setActivePage: (page) => {
    set({ activePage: page });
  },

  // Method to get active page label
  getActivePageLabel: () => {
    const { activePage } = get();
    const pageLabels = {
      'dashboard': 'Dashboard',
      'sales': 'Sales',
      'customers': 'Customers',
      'expenses': 'Expenses',
      'payments': 'Payments',
      'performa': 'Performa Invoices',
    };
    return pageLabels[activePage] || activePage;
  },
  // Theme management
  initializeTheme: () => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('admin-theme');

    if (savedTheme) {
      set({ dark: savedTheme === 'dark' });
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ dark: systemPrefersDark });
    }
  },

  setTheme: (theme = null) => {
    set((state) => {
      let newDark = state.dark;

      if (theme === 'dark' || theme === 'light') {
        newDark = theme === 'dark';
      } else {
        newDark = !state.dark;
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-theme', newDark ? 'dark' : 'light');

        // Apply theme class to document root
        if (newDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      return { dark: newDark };
    });
  },

  // Helper function for loading states
  setLoading: (key, isLoading) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: isLoading
      }
    }));
  },

  // Helper function for errors
  setError: (key, error) => {
    set((state) => ({
      errors: {
        ...state.loading,
        [key]: error
      }
    }));
  },

  // Data fetching function
  fetchData: async (endpoint) => {
    const key = endpoint;
    get().setLoading(key, true);

    try {
      const response = await axios.get(`/api/${endpoint}`);
      const data = response.data;

      if (data && (data.error || data.success === false)) {
        throw new Error(data.error || data.message || `Failed to fetch ${endpoint}`);
      }

      let fetchedData = [];

      if (Array.isArray(data)) {
        fetchedData = data;
      } else if (data[endpoint]) {
        fetchedData = data[endpoint];
      } else if (Array.isArray(data.data)) {
        fetchedData = data.data;
      } else if (data.success && Array.isArray(data.data)) {
        fetchedData = data.data;
      } else {
        fetchedData = data;
      }

      set({
        [endpoint]: fetchedData,
        errors: { ...get().errors, [key]: null },
      });
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      set({
        [endpoint]: [],
        errors: { ...get().errors, [key]: error.message },
      });
    } finally {
      get().setLoading(key, false);
    }
  },

  // Replace individual fetch methods with calls to fetchData
  fetchInvoices: async () => get().fetchData('invoices'),
  fetchPayments: async () => get().fetchData('payments'),
  fetchCustomers: async () => get().fetchData('customers'),
  fetchExpenses: async () => get().fetchData('expenses'),
  fetchPerformaInvoices: async () => get().fetchData('performaInvoice'),

  // Refresh all data
  refreshAllData: () => {
    get().fetchInvoices();
    get().fetchPayments();
    get().fetchCustomers();
    get().fetchExpenses();
  },

  // Helper to check if any data is loading
  get isLoading() {
    return Object.values(get().loading).some(status => status === true);
  },

  // Date helper function
  isDateInMonth: (dateString, targetMonth) => {
    if (targetMonth === null || targetMonth === undefined) return true;
    if (!dateString) return false;

    const monthNumber = Number(targetMonth);
    if (isNaN(monthNumber)) return true;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return false;
      return date.getMonth() === monthNumber;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return false;
    }
  },

  // Calculation functions
  getTotalRevenue: (month = null) => {
    const { invoices } = get();
    let filteredInvoices = invoices;

    if (month !== null && month !== '') {
      filteredInvoices = invoices.filter(invoice =>
        get().isDateInMonth(invoice?.invoiceDate, month)
      );
    }

    return filteredInvoices.reduce((sum, invoice) => sum + (invoice?.total || 0), 0);
  },

  getReceivedAmount: (month = null) => {
    const { payments } = get();
    let filteredPayments = payments;

    if (month !== null && month !== '') {
      filteredPayments = payments.filter(payment =>
        get().isDateInMonth(payment?.paymentDate, month)
      );
    }

    return filteredPayments.reduce((sum, payment) => sum + (payment?.totalPaid || 0), 0);
  },

  getDueAmount: (month = null) => {
    const { invoices } = get();
    let filteredInvoices = invoices;

    if (month !== null && month !== '') {
      filteredInvoices = invoices.filter(invoice =>
        get().isDateInMonth(invoice?.invoiceDate, month)
      );
    }

    return filteredInvoices
      .filter(inv => inv && inv?.total !== inv?.totalPaid)
      .reduce((sum, inv) => {
        const total = inv?.total || 0;
        const totalPaid = inv?.totalPaid || 0;
        return sum + (total - totalPaid);
      }, 0);
  },

  getPendingInvoices: (month = null) => {
    const { invoices } = get();
    let filteredInvoices = invoices;

    if (month !== null && month !== '') {
      filteredInvoices = invoices.filter(invoice =>
        get().isDateInMonth(invoice?.invoiceDate, month)
      );
    }

    return filteredInvoices.filter(inv => inv?.total !== inv?.totalPaid).length;
  },

  getTotalExpenses: (month = null) => {
    const { expenses } = get();
    let filteredExpenses = expenses;

    if (month !== null && month !== '') {
      filteredExpenses = expenses.filter(expense =>
        get().isDateInMonth(expense?.date, month)
      );
    }

    return filteredExpenses.reduce((sum, expense) => sum + (expense?.amount || 0), 0);
  },

  getNetProfit: (month = null) => {
    return get().getTotalRevenue(month) - get().getTotalExpenses(month);
  },

  getProfitMargin: (month = null) => {
    const revenue = get().getTotalRevenue(month);
    if (revenue === 0) return 0;
    return Number(((get().getNetProfit(month) / revenue) * 100).toFixed(2));
  },

  getOverdueInvoices: (month = null) => {
    const { invoices } = get();
    let filteredInvoices = invoices;

    if (month !== null && month !== '') {
      filteredInvoices = invoices.filter(invoice =>
        get().isDateInMonth(invoice?.date, month)
      );
    }

    return filteredInvoices.filter(inv => inv?.status === 'overdue').length;
  },

  getTotalCustomers: () => {
    return get().customers?.length || 0;
  }
}));