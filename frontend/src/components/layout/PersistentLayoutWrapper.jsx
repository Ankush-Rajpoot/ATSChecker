import React from 'react';
import { motion } from 'framer-motion';

/**
 * Layout wrapper that maintains persistent UI structure while allowing
 * individual components to show loading states
 */
const PersistentLayoutWrapper = ({ 
  children, 
  className = '',
  showHeader = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-[#000000] ${className}`}
    >
      {/* Main content area that respects the persistent navbar */}
      <div className="pt-0">
        {children}
      </div>
    </motion.div>
  );
};

export default PersistentLayoutWrapper;
