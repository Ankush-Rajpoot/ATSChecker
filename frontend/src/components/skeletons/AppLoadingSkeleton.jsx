import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Zap, Loader } from 'lucide-react';

const AppLoadingSkeleton = ({ 
  type = 'default', 
  message = 'Loading...', 
  showIcon = true,
  className = '' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'analysis':
        return <Zap className="w-8 h-8 text-[#A3A3A3]" />;
      case 'dashboard':
        return <BarChart3 className="w-8 h-8 text-[#A3A3A3]" />;
      case 'file':
        return <FileText className="w-8 h-8 text-[#A3A3A3]" />;
      default:
        return <Loader className="w-8 h-8 text-[#A3A3A3]" />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#000000] flex items-center justify-center p-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {showIcon && (
          <motion.div
            className="mb-6"
            animate={{ 
              rotate: type === 'analysis' ? 360 : 0,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            {getIcon()}
          </motion.div>
        )}
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-[#A3A3A3] mb-3"
        >
          {message}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#373737] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AppLoadingSkeleton;
