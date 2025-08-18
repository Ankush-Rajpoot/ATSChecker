import React from 'react';
import { motion } from 'framer-motion';

const FileUploadSkeleton = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* File Upload Area Skeleton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-2 border-dashed border-[#262626] rounded-xl p-8 text-center bg-[#171717]/30 animate-pulse"
      >
        <div className="space-y-4">
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center animate-pulse"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-8 h-8 bg-[#373737] rounded animate-pulse"></div>
          </motion.div>
          
          <div className="space-y-3">
            <div className="w-32 h-5 bg-[#262626] rounded mx-auto animate-pulse"></div>
            <div className="w-48 h-4 bg-[#171717] rounded mx-auto animate-pulse"></div>
            <div className="w-40 h-4 bg-[#171717] rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploadSkeleton;
