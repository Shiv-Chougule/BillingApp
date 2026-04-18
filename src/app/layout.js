'use client';
import './globals.css';
import React, { useEffect } from "react";
import { usePathname } from 'next/navigation';
import Sidebar from "./components/Sidebar/page";
import Header from "./components/Header/page";
import AdminStoreProvider from './store/AdminStoreProvider';
import { useAdminStore } from './store/adminStore';

// Import your MainPage component
import MainPage from "./components/mainpage/page";
// Import your dashboard page (assuming it's at the same level)
import DashboardPage from "./page"; // Adjust the import path if needed

function LayoutContent() {
  const pathname = usePathname();
  const { activePage, initializeTheme } = useAdminStore();

  // Initialize theme on component mount
  useEffect(() => {
    initializeTheme();
  }, []);

  // Determine which content to show based on activePage
  const renderContent = () => {
    // If no active page is set or dashboard is active, show dashboard
    if (!activePage || activePage === 'dashboard') {
      return <DashboardPage />;
    }

    // For other pages, show MainPage (you can extend this logic as needed)
    return <MainPage />;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-200 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="print:hidden hidden lg:flex flex-shrink-0">
          <Header />
        </div>
        <div className="h-[2000px] overflow-hidden hide-scrollbar bg-gray-200 dark:bg-gray-900 flex-1 overflow-y-auto pt-16 lg:pt-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children, params }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Blocking theme script — runs synchronously before the first paint.
          Reads the saved theme from localStorage and applies the .dark class
          immediately so the page renders with the correct border/bg colors,
          with zero flash of wrong colors (FOUC).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('admin-theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AdminStoreProvider>
          <LayoutContent />
        </AdminStoreProvider>
      </body>
    </html>
  );
}