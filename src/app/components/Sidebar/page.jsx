'use client';
import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
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
  Landmark,
  Store,
  Package,
  Menu,
  X
} from 'lucide-react';

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
  Landmark,
  Store,
  Package
};

// Array of page strings
const pageOptions = ['dashboard', 'sales', 'payments', 'customers', 'performa', 'expenses', 'vendor', 'purchase', 'stocks'];

// Map page IDs to display names and icons
const pageConfig = {
  dashboard: { name: 'Dashboard', iconName: 'House' },
  sales: { name: 'Sales', iconName: 'ChartNoAxesCombined' },
  payments: { name: 'Payments', iconName: 'IndianRupee' },
  customers: { name: 'Customers', iconName: 'Users' },
  performa: { name: 'Performa Invoice', iconName: 'ScrollText' },
  expenses: { name: 'Expenses', iconName: 'ChartNoAxesColumnIncreasing' },
  vendor: { name: 'Vendor', iconName: 'Store' },
  purchase: { name: 'Purchase', iconName: 'ShoppingCart' },
  stocks: { name: 'Stocks', iconName: 'Package' },
};

const Sidebar = () => {
  // Get state and methods from zustand store
  const { activePage, setActivePage, dark } = useAdminStore();
  console.log("theme color : ", dark);
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (iconName) => {
    const icons = {
      'House': House,
      'ChartNoAxesCombined': ChartNoAxesCombined,
      'IndianRupee': IndianRupee,
      'Users': Users,
      'ChartLine': ChartLine,
      'ShoppingCart': ShoppingCart,
      'User': User,
      'ScrollText': ScrollText,
      'ChartNoAxesColumnIncreasing': ChartNoAxesColumnIncreasing,
      'Landmark': Landmark,
      'Store': Store,
      'Package': Package
    };

    return icons[iconName] || House;
  };

  // Get current page config
  const currentPageConfig = pageConfig[activePage] || pageConfig.dashboard;

  // Theme-based styles - light sidebar to match MainPage
  const sidebarBg = dark ? 'bg-gray-900' : 'bg-white'; // White background to match MainPage
  const sidebarText = dark ? 'text-gray-100' : 'text-gray-900'; // Dark text in light mode
  const borderColor = dark ? 'border-gray-700' : 'border-blue-200'; // Blue-200 border to match MainPage
  const hoverBg = dark ? 'hover:bg-gray-700' : 'hover:bg-blue-50'; // Light blue hover
  const activeBg = dark ? 'bg-blue-700' : 'bg-blue-600'; // Blue active state
  const mobileHeaderBg = dark ? 'bg-gray-800' : 'bg-white'; // White mobile header
  const mobileHeaderText = dark ? 'text-white' : 'text-gray-900'; // Dark text
  const mobileButtonBg = dark ? 'bg-gray-700' : 'bg-gray-100'; // Light gray button
  const mobileButtonHoverBg = dark ? 'bg-gray-600' : 'bg-gray-200'; // Gray-200 hover
  const mobileButtonText = dark ? 'text-gray-100' : 'text-gray-900'; // Dark text
  const mobileButtonBorder = dark ? 'border-gray-600' : 'border-blue-200'; // Blue border

  const handlePageSelect = (pageId) => {
    // Update active page in zustand store
    setActivePage(pageId);
    setIsOpen(false);
  };

  const renderNavItem = (pageId) => {
    const config = pageConfig[pageId];
    const Icon = getIcon(config.iconName);
    const isActive = activePage === pageId;

    return (
      <li key={pageId}>
        <button
          type="button"
          onClick={() => handlePageSelect(pageId)}
          className={`w-full flex items-center p-3 rounded-lg transition-colors duration-300 ${isActive
            ? `${activeBg} text-white shadow-lg`
            : `${hoverBg} ${sidebarText}`
            }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon size={20} className="min-w-[20px]" />
          <span className="ml-3">{config.name}</span>
        </button>
      </li>
    );
  };

  const Icon = iconComponents[currentPageConfig.iconName] || House;

  return (
    <>
      {/* Mobile Header with Toggle */}
      <div className={`print:hidden fixed lg:hidden top-0 left-0 w-full h-16 ${mobileHeaderBg} shadow-sm z-[1000] transition-colors duration-300`}>
        <button
          className={`absolute top-4 left-4 p-2 h-10 w-10 ${mobileButtonBg} ${mobileButtonText} rounded-lg shadow-md ${mobileButtonHoverBg} flex items-center justify-center border ${mobileButtonBorder} transition-colors duration-300`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`flex items-center justify-end h-full ${mobileHeaderText}`}>
          <div className='flex mr-4'>
            <Icon size={24} />
            <span className="ml-2 text-xl">{currentPageConfig.name}</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`print:hidden lg:hidden fixed inset-y-0 left-0 z-[999] w-64 ${sidebarBg} ${sidebarText} transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        aria-hidden={!isOpen}
      >
        <div className={`flex items-center justify-center h-17 p-4 border-b ${borderColor}`}>
          <h1 className="text-xl font-bold">My App</h1>
        </div>

        <nav className="p-2 h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="space-y-2">
            {pageOptions.map(renderNavItem)}
          </ul>
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`print:hidden hidden border-r lg:flex lg:flex-col h-full w-64 ${sidebarBg} ${sidebarText} transition-colors duration-300`}>
        <div className={`box-content flex items-center justify-center h-[36px] p-4 border-b ${borderColor}`}>
          <h1 className="text-xl font-bold">My App</h1>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-2">
            {pageOptions.map(renderNavItem)}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;