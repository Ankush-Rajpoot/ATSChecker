import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <motion.input
      whileFocus={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-dark-500 bg-dark-200 px-3 py-2 text-xs text-accent-400 ring-offset-dark-100 file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-dark-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-400/15 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-dark-600",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
