import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, className = '', showLabel = true, size = 'md', color = 'default' }) => {
  const sizeClasses = {
    sm: 'h-0.5',
    md: 'h-1',
    lg: 'h-1.5'
  };

  const colorClasses = {
    default: 'bg-gradient-to-r from-[#404040] to-[#525252]',
    high: 'bg-gradient-to-r from-green-700 to-green-600',
    medium: 'bg-gradient-to-r from-yellow-700 to-yellow-600',
    low: 'bg-gradient-to-r from-red-800 to-red-700',
    success: 'bg-gradient-to-r from-green-700 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-700 to-yellow-600',
    error: 'bg-gradient-to-r from-red-800 to-red-700'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-accent-400">Progress</span>
          <span className="text-sm text-dark-700">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#262626] rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;