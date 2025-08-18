import React from 'react';
import { motion } from 'framer-motion';

const ResultsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#000000] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
        >
          <div className="mb-4 sm:mb-0">
            <div className="h-8 bg-[#171717] rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-[#0A0A0A] rounded-lg w-64 animate-pulse"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-9 bg-[#171717] border border-[#262626] rounded-lg w-24 animate-pulse"></div>
            <div className="h-9 bg-[#171717] border border-[#262626] rounded-lg w-28 animate-pulse"></div>
          </div>
        </motion.div>

        {/* Main Layout Grid Skeleton */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Score Card Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-2">
                    <div className="h-6 bg-[#171717] rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-[#0A0A0A] rounded w-48 animate-pulse"></div>
                  </div>
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#171717] rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#262626] rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Status indicators */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#171717] rounded-full animate-pulse"></div>
                    <div className="w-16 h-4 bg-[#171717] rounded animate-pulse"></div>
                  </div>
                  <div className="w-20 h-6 bg-[#171717] rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>

            {/* Improvement Suggestions Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl">
                <div className="border-b border-[#171717] p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-[#171717] rounded w-36 animate-pulse"></div>
                      <div className="h-3 bg-[#0A0A0A] rounded w-48 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 bg-[#171717] rounded-lg border border-[#262626]">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-[#262626] rounded-lg animate-pulse mt-1"></div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-20 h-4 bg-[#262626] rounded animate-pulse"></div>
                            <div className="w-12 h-5 bg-[#262626] rounded-full animate-pulse"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full h-4 bg-[#262626] rounded animate-pulse"></div>
                            <div className="w-3/4 h-4 bg-[#262626] rounded animate-pulse"></div>
                          </div>
                          <div className="w-16 h-6 bg-[#262626] rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Section Breakdown Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl">
              <div className="border-b border-[#171717] p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-[#171717] rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-[#0A0A0A] rounded w-44 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
                        <div className="w-24 h-4 bg-[#171717] rounded animate-pulse"></div>
                      </div>
                      <div className="w-12 h-6 bg-[#171717] rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-full h-2 bg-[#171717] rounded-full animate-pulse"></div>
                    <div className="w-32 h-3 bg-[#0A0A0A] rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Analysis Skeleton - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Matched Skills Skeleton */}
            <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl h-[300px] flex flex-col">
              <div className="border-b border-[#171717] p-4 flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#171717] rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-[#0A0A0A] rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-[#171717] rounded-lg border border-[#262626] animate-pulse">
                      <div className="w-20 h-4 bg-[#262626] rounded"></div>
                      <div className="w-4 h-4 bg-[#262626] rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Skills Skeleton */}
            <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl h-[300px] flex flex-col">
              <div className="border-b border-[#171717] p-4 flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-[#171717] rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#171717] rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-[#0A0A0A] rounded w-36 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-[#171717] rounded-lg border border-[#262626] animate-pulse">
                      <div className="w-24 h-4 bg-[#262626] rounded"></div>
                      <div className="w-4 h-4 bg-[#262626] rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPageSkeleton;
