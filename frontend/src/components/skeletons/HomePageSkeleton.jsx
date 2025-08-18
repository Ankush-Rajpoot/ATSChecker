import React from 'react';
import { motion } from 'framer-motion';

const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Navbar Skeleton */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#0A0A0A] border-b border-[#171717] sticky top-0 z-50 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
              <div className="w-24 h-6 bg-[#171717] rounded animate-pulse"></div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-8 bg-[#171717] rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-[#171717] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section Skeleton */}
      <section className="relative px-4 py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-8"
          >
            <div className="space-y-4">
              <div className="h-12 bg-[#171717] rounded-lg w-96 mx-auto animate-pulse"></div>
              <div className="h-12 bg-[#171717] rounded-lg w-80 mx-auto animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-[#0A0A0A] rounded-lg w-[500px] mx-auto animate-pulse"></div>
              <div className="h-6 bg-[#0A0A0A] rounded-lg w-[450px] mx-auto animate-pulse"></div>
            </div>
          </motion.div>

          {/* Action Buttons Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <div className="h-12 bg-[#171717] rounded-lg w-32 animate-pulse"></div>
            <div className="h-12 bg-[#171717] border border-[#262626] rounded-lg w-28 animate-pulse"></div>
          </motion.div>

          {/* Demo Video/Image Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="w-full max-w-4xl mx-auto h-80 bg-[#171717] rounded-2xl animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="h-10 bg-[#171717] rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-[#0A0A0A] rounded-lg w-[500px] mx-auto animate-pulse"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-[#0A0A0A] p-6 rounded-lg border border-[#171717]"
              >
                <div className="w-12 h-12 bg-[#171717] rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-[#171717] rounded w-24 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#0A0A0A] rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-[#0A0A0A] rounded w-3/4 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="h-10 bg-[#171717] rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-[#0A0A0A] rounded-lg w-80 mx-auto animate-pulse"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#171717] rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-6 bg-[#171717] rounded w-32 mx-auto mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#0A0A0A] rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-[#0A0A0A] rounded w-5/6 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-[#0A0A0A] rounded w-4/5 mx-auto animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-[#171717] rounded-2xl p-12"
          >
            <div className="h-10 bg-[#171717] rounded-lg w-80 mx-auto mb-6 animate-pulse"></div>
            <div className="space-y-3 mb-8">
              <div className="h-5 bg-[#0A0A0A] rounded-lg w-96 mx-auto animate-pulse"></div>
              <div className="h-5 bg-[#0A0A0A] rounded-lg w-80 mx-auto animate-pulse"></div>
            </div>
            <div className="h-12 bg-[#171717] rounded-lg w-40 mx-auto animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-[#0A0A0A] border-t border-[#171717] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="h-5 bg-[#171717] rounded w-24 animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-[#0A0A0A] rounded w-20 animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[#171717] mt-12 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="h-4 bg-[#0A0A0A] rounded w-48 animate-pulse"></div>
              <div className="flex space-x-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-[#0A0A0A] rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePageSkeleton;
