import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/Card';

const AnalyticsOverviewSkeleton = () => {
  return (
    <Card className="bg-[#0A0A0A] border-[#171717]">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#171717] rounded-xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-5 bg-[#171717] rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-[#0A0A0A] rounded w-48 animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Area Skeleton */}
        <div className="h-80 bg-[#171717] rounded-xl mb-6 animate-pulse"></div>
        
        {/* Legend Skeleton */}
        <div className="flex items-center justify-center space-x-6">
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-3 h-3 bg-[#171717] rounded-full animate-pulse"></div>
              <div className="h-4 bg-[#171717] rounded w-16 animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverviewSkeleton;
