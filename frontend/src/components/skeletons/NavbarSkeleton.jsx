import React from 'react';
import { motion } from 'framer-motion';

const NavbarSkeleton = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[#0A0A0A]/90 backdrop-blur-lg border-b border-[#171717] sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
            <div className="w-28 h-6 bg-[#171717] rounded animate-pulse"></div>
          </div>

          {/* Desktop Navigation Skeleton */}
          <div className="hidden md:flex items-center space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 px-3 py-2 rounded-lg">
                <div className="w-4 h-4 bg-[#171717] rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-[#171717] rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* User Menu Skeleton */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-3 py-2 border border-[#262626] rounded-full bg-[#171717]/50">
              <div className="w-8 h-8 bg-[#262626] rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-[#262626] rounded animate-pulse"></div>
            </div>
          </div>

          {/* Mobile Menu Button Skeleton */}
          <div className="md:hidden">
            <div className="w-8 h-8 bg-[#171717] rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavbarSkeleton;
