import React from 'react';
import { motion } from 'framer-motion';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#000000] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <div className="h-8 bg-[#171717] rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-[#0A0A0A] rounded-lg w-80 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-9 bg-[#171717] rounded-lg w-24 animate-pulse"></div>
            <div className="h-9 bg-[#171717] rounded-lg w-28 animate-pulse"></div>
            <div className="h-9 bg-[#171717] rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#171717] rounded-xl animate-pulse"></div>
                <div className="h-6 bg-[#171717] rounded-full w-16 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#171717] rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-[#171717] rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-[#171717] rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-[#171717] rounded w-32 animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="h-8 bg-[#171717] rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-[#171717] rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 bg-[#171717] rounded w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="space-y-8 mb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-[#171717] rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-[#171717] rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-[#171717] rounded w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-80 bg-[#171717] rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Recent Reports Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#171717] rounded-xl animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-[#171717] rounded w-28 animate-pulse"></div>
                      <div className="h-3 bg-[#171717] rounded w-36 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-[#171717] rounded w-20 animate-pulse"></div>
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-[#171717] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-[#171717] rounded-xl animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-[#171717] rounded w-32 animate-pulse"></div>
                            <div className="h-3 bg-[#171717] rounded w-24 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-8 bg-[#171717] rounded-full w-20 animate-pulse"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="bg-[#171717]/50 rounded-lg p-3">
                            <div className="h-6 bg-[#171717] rounded w-8 mx-auto mb-2 animate-pulse"></div>
                            <div className="h-3 bg-[#171717] rounded w-16 mx-auto animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
