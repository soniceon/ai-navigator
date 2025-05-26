import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import FeaturedSection from './FeaturedSection';
import MobileNav from './MobileNav';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar - Shown only when toggled */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="w-64 h-full bg-white dark:bg-gray-900 animate-slide-in-left">
            <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
          
          {/* Featured Section - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:block w-80 p-4 border-l border-gray-200 dark:border-gray-800">
            <FeaturedSection />
          </div>
        </main>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      </div>
    </div>
  );
};

export default Layout;