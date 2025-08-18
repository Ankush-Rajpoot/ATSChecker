import React from 'react';
import { motion } from 'framer-motion';

const AuthPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Skeleton */}
      <div className="hidden lg:block absolute left-1/4 top-1/2 transform -translate-y-1/2 pointer-events-none z-0">
        <div className="w-96 h-96 opacity-30">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-[#171717] to-[#262626] rounded-full blur-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      
      {/* Form Content Skeleton */}
      <div className="max-w-sm w-full space-y-5 sm:space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="h-8 bg-[#171717] rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-[#0A0A0A] rounded-lg w-64 mx-auto animate-pulse"></div>
        </motion.div>

        {/* Form Skeleton */}
        <motion.div
          initial={{ opacity: 0, rotateY: -15 }}
          animate={{ opacity: 1, rotateY: 0 }}
          className="bg-[#0A0A0A] border border-[#171717] rounded-2xl p-6 sm:p-8 backdrop-blur-lg shadow-2xl"
        >
          <div className="space-y-5">
            {/* Input Fields Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-[#171717] rounded w-20 animate-pulse"></div>
                <div className="h-12 bg-[#171717] border border-[#262626] rounded-lg animate-pulse"></div>
              </div>
            ))}

            {/* Submit Button Skeleton */}
            <div className="h-12 bg-[#171717] border border-[#262626] rounded-lg animate-pulse"></div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="flex items-center">
                <div className="flex-1 border-t border-[#262626]"></div>
                <div className="px-4 h-4 bg-[#171717] rounded w-32 animate-pulse"></div>
                <div className="flex-1 border-t border-[#262626]"></div>
              </div>
            </div>

            {/* Google Button Skeleton */}
            <div className="h-12 bg-[#171717] border border-[#262626] rounded-lg flex items-center justify-center space-x-3 animate-pulse">
              <div className="w-5 h-5 bg-[#262626] rounded-full"></div>
              <div className="w-32 h-4 bg-[#262626] rounded"></div>
            </div>

            {/* Footer Link Skeleton */}
            <div className="text-center pt-2">
              <div className="h-4 bg-[#0A0A0A] rounded w-40 mx-auto animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="h-3 bg-[#0A0A0A] rounded w-56 mx-auto animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPageSkeleton;
