import React from 'react';
import { motion } from 'framer-motion';

const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = '',
  showHeader = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0A0A0A] border border-[#171717] rounded-xl overflow-hidden ${className}`}
    >
      {showHeader && (
        <div className="border-b border-[#171717] p-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(columns)].map((_, i) => (
              <div key={i} className="h-4 bg-[#171717] rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-[#171717]">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(columns)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 bg-[#171717] rounded animate-pulse ${
                    colIndex === 0 ? 'w-3/4' : 'w-full'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TableSkeleton;
