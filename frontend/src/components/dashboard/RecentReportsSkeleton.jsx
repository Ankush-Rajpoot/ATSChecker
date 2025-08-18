import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/Card';

const RecentReportsSkeleton = () => {
  return (
    <Card className="bg-[#0A0A0A] border-[#171717] h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#171717] rounded-xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-[#171717] rounded w-28 animate-pulse"></div>
              <div className="h-3 bg-[#0A0A0A] rounded w-36 animate-pulse"></div>
            </div>
          </div>
          <div className="h-8 bg-[#171717] rounded w-20 animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-[#171717] rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#171717] rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#171717] rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-[#0A0A0A] rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 bg-[#171717] rounded-full w-16 animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-[#171717]/30 rounded-lg p-2">
                    <div className="h-5 bg-[#171717] rounded w-6 mx-auto mb-1 animate-pulse"></div>
                    <div className="h-3 bg-[#0A0A0A] rounded w-12 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsSkeleton;
