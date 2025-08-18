import React from 'react';
import { motion } from 'framer-motion';

const CardSkeleton = ({ 
  className = '', 
  showHeader = true, 
  showContent = true,
  headerHeight = 'h-6',
  contentLines = 3 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0A0A0A] border border-[#171717] rounded-xl overflow-hidden ${className}`}
    >
      {showHeader && (
        <div className="border-b border-[#171717] p-4">
          <div className={`bg-[#171717] rounded w-32 animate-pulse ${headerHeight}`}></div>
        </div>
      )}
      
      {showContent && (
        <div className="p-4 space-y-3">
          {[...Array(contentLines)].map((_, i) => (
            <div
              key={i}
              className={`bg-[#171717] rounded animate-pulse ${
                i === contentLines - 1 ? 'w-3/4' : 'w-full'
              } h-4`}
            ></div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CardSkeleton;
