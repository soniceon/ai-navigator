import React from 'react';
import Link from 'next/link';
import { FiHome, FiGrid, FiSearch, FiMenu } from 'react-icons/fi';

interface MobileNavProps {
  onSidebarToggle: () => void;
}

const MobileNav = ({ onSidebarToggle }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-gray-900 border-t border-gray-800">
      <div className="grid grid-cols-4 h-16">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-gray-400 hover:text-white"
        >
          <FiHome className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/search"
          className="flex flex-col items-center justify-center text-gray-400 hover:text-white"
        >
          <FiSearch className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>

        <Link
          href="/categories"
          className="flex flex-col items-center justify-center text-gray-400 hover:text-white"
        >
          <FiGrid className="h-6 w-6" />
          <span className="text-xs mt-1">Categories</span>
        </Link>

        <button
          onClick={onSidebarToggle}
          className="flex flex-col items-center justify-center text-gray-400 hover:text-white w-full"
        >
          <FiMenu className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;