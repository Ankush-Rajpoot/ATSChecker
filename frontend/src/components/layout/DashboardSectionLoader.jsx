import React from 'react';
import { motion } from 'framer-motion';
import { StatsCardsSkeleton, RecentReportsSkeleton, AnalyticsOverviewSkeleton } from '../skeletons';

/**
 * Dashboard component loader that maintains the dashboard layout
 * while showing skeleton states for individual sections
 */
const DashboardSectionLoader = ({ 
  isLoading, 
  section, 
  children 
}) => {
  if (!isLoading) {
    return children;
  }

  const getSectionSkeleton = () => {
    switch (section) {
      case 'stats':
        return <StatsCardsSkeleton />;
      case 'reports':
        return <RecentReportsSkeleton />;
      case 'analytics':
        return <AnalyticsOverviewSkeleton />;
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-6"
          >
            <div className="space-y-4">
              <div className="h-6 bg-[#171717] rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-[#0A0A0A] rounded w-2/3 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-[#171717] rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return getSectionSkeleton();
};

export default DashboardSectionLoader;
