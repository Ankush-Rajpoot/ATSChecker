import React from 'react';
import { motion } from 'framer-motion';

const StatsCardsSkeleton = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2.5 justify-center sm:justify-start"
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="bg-[#0A0A0A] border border-[#171717] rounded-xl p-4 min-w-[140px] flex-1 max-w-[200px]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#171717] rounded-xl animate-pulse"></div>
            <div className="h-6 bg-[#171717] rounded-full w-12 animate-pulse"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-3 bg-[#171717] rounded w-16 animate-pulse"></div>
            <div className="h-7 bg-[#171717] rounded w-12 animate-pulse"></div>
            <div className="h-3 bg-[#0A0A0A] rounded w-20 animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCardsSkeleton;
