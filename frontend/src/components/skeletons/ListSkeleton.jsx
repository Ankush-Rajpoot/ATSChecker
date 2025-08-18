import React from 'react';
import { motion } from 'framer-motion';

const ListSkeleton = ({ 
  items = 5, 
  showAvatar = true,
  showIcon = false,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-3 ${className}`}
    >
      {[...Array(items)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center space-x-3 p-3 bg-[#0A0A0A] border border-[#171717] rounded-lg"
        >
          {(showAvatar || showIcon) && (
            <div className={`bg-[#171717] animate-pulse ${
              showAvatar ? 'w-10 h-10 rounded-full' : 'w-8 h-8 rounded-lg'
            }`}></div>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#171717] rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-[#0A0A0A] rounded w-1/2 animate-pulse"></div>
          </div>
          
          <div className="w-16 h-6 bg-[#171717] rounded animate-pulse"></div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ListSkeleton;
