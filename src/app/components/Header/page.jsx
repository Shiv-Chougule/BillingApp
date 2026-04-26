import React from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  House,
  ChartNoAxesCombined,
  IndianRupee,
  Users,
  ChartLine,
  ShoppingCart,
  User,
  ScrollText,
  ChartNoAxesColumnIncreasing,
  Landmark
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

const iconComponents = {
  House,
  ChartNoAxesCombined,
  IndianRupee,
  Users,
  ChartLine,
  ShoppingCart,
  User,
  ScrollText,
  ChartNoAxesColumnIncreasing,
  Landmark
};

function Header() {
  // Get state and methods from zustand store
  const { dark, setTheme, activePage } = useAdminStore();

  // Function to get page label based on activePage state
  const getPageLabel = () => {
    const pageLabels = {
      'dashboard': 'Dashboard',
      'sales': 'Sales',
      'customers': 'Customers',
      'expenses': 'Expenses',
      'payments': 'Payments',
      'performa': 'Performa-Invoices',
    };
    return pageLabels[activePage] || activePage || 'Dashboard';
  };

  // Function to get icon based on activePage state
  const getIcon = () => {
    const pageToIconMap = {
      'dashboard': House,
      'invoices': ScrollText,
      'customers': Users,
      'expenses': IndianRupee,
      'payments': ChartNoAxesColumnIncreasing,
      'performa-invoices': ChartLine,
      'performaInvoice': ChartLine,
    };
    return iconComponents[pageToIconMap[activePage]?.name] || House;
  };

  const Icon = getIcon();
  const pageLabel = getPageLabel();

  // Theme-based styles (unchanged)
  const headerBg = dark ? 'bg-gray-800' : 'bg-white';
  const headerText = dark ? 'text-white' : 'text-gray-800';
  const financialYearText = dark ? 'text-gray-300' : 'text-black';

  const handleThemeToggle = () => {
    setTheme();
  };

  return (
    <div className={`print:hidden w-full ${headerBg} transition-colors duration-300 border-b`}>
      {/* Only show desktop header - mobile header is handled by Sidebar */}
      <div className="flex justify-between items-center p-4">
        <div className={`flex items-center font-bold ${headerText}`}>
          <Icon size={24} />
          <span className="ml-2 text-xl">{pageLabel}</span>
        </div>
        <div className={financialYearText}>
          <span>Financial Year: April 2025 - March 2026</span>
        </div>
        <button
          onClick={handleThemeToggle}
          className={`p-2 rounded-full transition-colors duration-300 ${dark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
            }`}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}

export default Header;