'use client';
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import MonthDropdown from './components/sections/MonthDropdown';
import { CalendarDays, AlertCircle, IndianRupee, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { useAllAdminData } from './store/useAdminData';
import { FileText, Receipt } from 'lucide-react';
import { formatDate } from './utils/dateUtils';

// Only import charts for the data we have
const PaymentBarChart = dynamic(() => import('./barchart/PaymentBarchart'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center"><p className="text-gray-500">Loading chart...</p></div>
});
const InvoiceBarChart = dynamic(() => import('./barchart/InvoiceBarchart'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center"><p className="text-gray-500">Loading chart...</p></div>
});
const ExpenseBarChart = dynamic(() => import('./barchart/ExpenseBarchart'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center"><p className="text-gray-500">Loading chart...</p></div>
});

const Dashboard = () => {
  const {
    invoices,
    payments,
    customers,
    expenses,
    loading,
    errors,
    getTotalRevenue,
    getReceivedAmount,
    getDueAmount,
    getTotalCustomers,
    getPendingInvoices,
    getOverdueInvoices,
    getTotalExpenses,
    getNetProfit,
    getProfitMargin,
    isLoading,
    dark,
    // fetch methods fetchInvoices,
    fetchPayments,
    fetchCustomers,
    fetchExpenses,
    refreshAllData
  } = useAllAdminData();

  const [activeChart, setActiveChart] = useState('payments');
  const [showMonthlyStats, setShowMonthlyStats] = useState(false);
  const [selectedMonthStats, setSelectedMonthStats] = useState('');
  const [showMonthlyCharts, setShowMonthlyCharts] = useState(false);
  const [selectedMonthCharts, setSelectedMonthCharts] = useState('');

  useEffect(() => {
    const initializeDashboard = async () => {
      console.log('=== INITIALIZING DASHBOARD ===');
      console.log('Current Zustand state before fetch:');
      console.log('invoices array length:', invoices.length);
      console.log('payments array length:', payments.length);
      console.log('customers array length:', customers.length);
      console.log('expenses array length:', expenses.length);
      console.log('invoices array:', invoices);
      console.log('payments array:', payments);
      console.log('customers array:', customers);
      console.log('expenses array:', expenses);

      try {
        // Refresh all data
        console.log('Fetching data from API...');
        await refreshAllData();

        // Log after fetch
        console.log('=== AFTER DATA FETCH ===');
        console.log('invoices array length:', invoices.length);
        console.log('payments array length:', payments.length);
        console.log('customers array length:', customers.length);
        console.log('expenses array length:', expenses.length);
        console.log('invoices array:', invoices);
        console.log('payments array:', payments);
        console.log('customers array:', customers);
        console.log('expenses array:', expenses);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    initializeDashboard();

    // Run only once on component mount
  }, []);

  // Separate handlers for stats grid
  const handleStatsMonthToggle = () => {
    setShowMonthlyStats(!showMonthlyStats);
    if (!showMonthlyStats) {
      setSelectedMonthStats('');
    }
  };

  const handleStatsMonthChange = (month) => {
    setSelectedMonthStats(month);
    console.log('Stats selected month:', month);
  };

  // Separate handlers for charts
  const handleChartsMonthToggle = () => {
    setShowMonthlyCharts(!showMonthlyCharts);
    if (!showMonthlyCharts) {
      setSelectedMonthCharts('');
    }
  };

  const handleChartsMonthChange = (month) => {
    setSelectedMonthCharts(month);
    console.log('Charts selected month:', month);
  };

  // Chart button handlers
  const handlePaymentsChart = () => setActiveChart('payments');
  const handleInvoicesChart = () => setActiveChart('invoices');
  const handleExpensesChart = () => setActiveChart('expenses');

  // Calculate monthly revenue data
  const monthlyRevenue = useMemo(() => {
    const monthlyData = Array(12).fill(0);

    invoices.forEach(invoice => {
      if (invoice?.date) {
        try {
          const date = new Date(invoice.date);
          const month = date.getMonth();
          monthlyData[month] += invoice.total || 0;
        } catch (error) {
          console.error('Error processing invoice date:', error);
        }
      }
    });

    return monthlyData;
  }, [invoices]);

  // Calculate summary statistics
  const currentMonthRevenue = useMemo(() => monthlyRevenue[new Date().getMonth()] || 0, [monthlyRevenue]);
  const averageMonthlyRevenue = useMemo(() => Math.round(monthlyRevenue.reduce((a, b) => a + b, 0) / 12), [monthlyRevenue]);
  const totalYTDRevenue = useMemo(() => monthlyRevenue.reduce((a, b) => a + b, 0), [monthlyRevenue]);

  // Update metrics to use stats month filtering
  const totalRevenue = getTotalRevenue(selectedMonthStats);
  const receivedAmount = getReceivedAmount(selectedMonthStats);
  const dueAmount = getDueAmount(selectedMonthStats);
  const pendingInvoices = getPendingInvoices(selectedMonthStats);
  const totalExpenses = getTotalExpenses(selectedMonthStats);
  const netProfit = getNetProfit(selectedMonthStats);
  const profitMargin = getProfitMargin(selectedMonthStats);

  if (isLoading) {
    return (
      <div className={` flex justify-center items-center h-screen ${dark ? 'bg-gray-900' : 'bg-gray-200'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-200 text-gray-800'} pt-6 h-[380%] sm:[300%] lg:h-[360%] xl:h-[320%] 2xl:h-[280%] transition-colors duration-300 hide-scrollbar`}>
      <div className="px-2 hide-scrollbar">
        {/* Stats Grid */}
        <div className='border p-2 mb-4 rounded-lg'>
          <div className='flex gap-2 justify-end items-center mb-2'>
            <button
              onClick={handleStatsMonthToggle}
              className={`flex border border-blue-500 items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${showMonthlyStats
                ? dark
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-purple-500 text-white shadow-lg'
                : dark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <CalendarDays size={14} className="sm:w-4 sm:h-4" />
              <span>{showMonthlyStats ? 'Show Yearly Stats' : 'Show Monthly Stats'}</span>
            </button>

            {showMonthlyStats && (
              <div className="w-46 sm:w-56">
                <MonthDropdown
                  selectedMonth={selectedMonthStats}
                  onMonthChange={handleStatsMonthChange}
                  dark={dark}
                  className="text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-5 3xl:grid-cols-5 gap-6 mb-8">
            {/* Total Revenue */}
            <div className={`p-6 rounded-lg shadow-sm border-l-4 border-blue-500 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-md font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total Revenue
                    {showMonthlyStats && selectedMonthStats && (
                      <span className="text-xs ml-2 text-blue-500">({selectedMonthStats})</span>
                    )}
                    {!showMonthlyStats && (
                      <span className="text-xs ml-2 text-blue-500">(Yearly)</span>
                    )}
                  </h3>
                  <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-full ${dark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <IndianRupee size={20} className="text-blue-500" />
                </div>
              </div>
            </div>

            {/* Received Amount */}
            <div className={`p-6 rounded-lg shadow-sm border-l-4 border-green-500 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-md font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Received Amount
                    {showMonthlyStats && selectedMonthStats && (
                      <span className="text-xs ml-2 text-green-500">({selectedMonthStats})</span>
                    )}
                    {!showMonthlyStats && (
                      <span className="text-xs ml-2 text-green-500">(Yearly)</span>
                    )}
                  </h3>
                  <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{receivedAmount.toLocaleString()}</p>
                  <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Cash in hand</p>
                </div>
                <div className={`p-3 rounded-full ${dark ? 'bg-green-900' : 'bg-green-100'}`}>
                  <CreditCard size={20} className="text-green-500" />
                </div>
              </div>
            </div>

            {/* Due Amount */}
            <div className={`p-6 rounded-lg shadow-sm border-l-4 border-amber-500 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-md font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Due Amount
                    {showMonthlyStats && selectedMonthStats && (
                      <span className="text-xs ml-2 text-amber-500">({selectedMonthStats})</span>
                    )}
                    {!showMonthlyStats && (
                      <span className="text-xs ml-2 text-amber-500">(Yearly)</span>
                    )}
                  </h3>
                  <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{dueAmount.toLocaleString()}</p>
                  <p className="text-sm text-amber-500 flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />
                    {pendingInvoices} pending invoices
                  </p>
                </div>
                <div className={`p-3 rounded-full ${dark ? 'bg-amber-900' : 'bg-amber-100'}`}>
                  <AlertCircle size={20} className="text-amber-500" />
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className={`p-6 rounded-lg shadow-sm border-l-4 border-emerald-500 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-md font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Net Profit
                    {showMonthlyStats && selectedMonthStats && (
                      <span className="text-xs ml-2 text-emerald-500">({selectedMonthStats})</span>
                    )}
                    {!showMonthlyStats && (
                      <span className="text-xs ml-2 text-emerald-500">(Yearly)</span>
                    )}
                  </h3>
                  <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{netProfit.toLocaleString()}</p>
                  <p className="text-sm text-emerald-500 flex items-center mt-1">
                    <TrendingUp size={14} className="mr-1" />
                    {profitMargin}% margin
                  </p>
                </div>
                <div className={`p-3 rounded-full ${dark ? 'bg-emerald-900' : 'bg-emerald-100'}`}>
                  <DollarSign size={20} className="text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className={`p-6 rounded-lg shadow-sm border-l-4 border-red-500 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-md font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total Expenses
                    {showMonthlyStats && selectedMonthStats && (
                      <span className="text-xs ml-2 text-red-500">({selectedMonthStats})</span>
                    )}
                    {!showMonthlyStats && (
                      <span className="text-xs ml-2 text-red-500">(Yearly)</span>
                    )}
                  </h3>
                  {loading.expenses ? (
                    <div className={`animate-pulse h-8 w-20 rounded ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  ) : errors.expenses ? (
                    <p className="text-red-500 text-sm">Error loading expenses</p>
                  ) : (
                    <>
                      <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{totalExpenses.toLocaleString()}</p>
                      <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {showMonthlyStats && selectedMonthStats ? `In ${selectedMonthStats}` : 'This year'}
                      </p>
                    </>
                  )}
                </div>
                <div className={`p-3 rounded-full ${dark ? 'bg-red-900' : 'bg-red-100'}`}>
                  <CreditCard size={20} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 lg:mb-16">
          {/* Recent Payments */}
          <div className={`p-6 rounded-lg shadow-sm transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
            }`}>
            <h3 className={`text-md font-medium mb-4 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Recent Payments</h3>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${dark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                  <div>
                    <p className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{payment.customerName}</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-500">₹{payment.totalPaid?.toLocaleString()}</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{payment.paymentMode}</p>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className={`text-center py-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No recent payments
                </div>
              )}
            </div>
          </div>

          {/* Recent Customers */}
          <div className={`p-6 rounded-lg shadow-sm transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'
            }`}>
            <h3 className={`text-md font-medium mb-4 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Recent Customers</h3>
            <div className="space-y-3 max-h-100 hide-scrollbar overflow-y-auto">
              {customers.slice(0, 5).map((customer, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${dark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                  <div>
                    <p className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{customer.name}</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {customer.phone || 'No phone'}
                    </p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Since {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {customers.length === 0 && (
                <div className={`text-center py-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No customers found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics heading */}
        <div className={`flex justify-between items-center p-4 ${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm mb-6 transition-colors duration-300`}>
          <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Analytics</h1>
        </div>

        {/* Chart Selection Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className='flex flex-wrap gap-2 sm:gap-3 md:gap-4'>
            <button
              onClick={handlePaymentsChart}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${activeChart === 'payments'
                ? dark
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-500 text-white shadow-lg'
                : dark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <CreditCard size={14} className="sm:w-4 sm:h-4" />
              <span>Payments</span>
            </button>

            <button
              onClick={handleInvoicesChart}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${activeChart === 'invoices'
                ? dark
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-green-500 text-white shadow-lg'
                : dark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <FileText size={14} className="sm:w-4 sm:h-4" />
              <span>Invoices</span>
            </button>

            <button
              onClick={handleExpensesChart}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${activeChart === 'expenses'
                ? dark
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-red-500 text-white shadow-lg'
                : dark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <Receipt size={14} className="sm:w-4 sm:h-4" />
              <span>Expenses</span>
            </button>
          </div>
        </div>

        {/* Dynamic Chart Display */}
        <div className={`flex flex-col p-2 space-y-2 border sm:rounded lg:rounded-lg ${dark ? 'bg-gray-900' : 'bg-gray-200'}`}>
          <div>
            <div className='flex gap-2 justify-end items-center'>
              <button
                onClick={handleChartsMonthToggle}
                className={`flex border border-blue-500 items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${showMonthlyCharts
                  ? dark
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-500 text-white shadow-lg'
                  : dark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <CalendarDays size={14} className="sm:w-4 sm:h-4" />
                <span>{showMonthlyCharts ? 'Show Yearly Charts' : 'Show Monthly Charts'}</span>
              </button>

              {showMonthlyCharts && (
                <div className="w-46 sm:w-56">
                  <MonthDropdown
                    selectedMonth={selectedMonthCharts}
                    onMonthChange={handleChartsMonthChange}
                    dark={dark}
                    className="text-xs sm:text-sm"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            {activeChart === 'payments' && (
              <PaymentBarChart
                payments={payments}
                dark={dark}
                showMonthly={showMonthlyCharts}
                selectedMonth={selectedMonthCharts}
              />
            )}
            {activeChart === 'invoices' && (
              <InvoiceBarChart
                invoices={invoices}
                dark={dark}
                showMonthly={showMonthlyCharts}
                selectedMonth={selectedMonthCharts}
              />
            )}
            {activeChart === 'expenses' && (
              <ExpenseBarChart
                expenses={expenses}
                dark={dark}
                showMonthly={showMonthlyCharts}
                selectedMonth={selectedMonthCharts}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;