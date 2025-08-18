import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-dark-400",
      className
    )}
    {...props}
  >
    <motion.div
      className="h-full bg-gradient-to-r from-dark-600 to-accent-100 transition-all duration-500"
      initial={{ width: 0 }}
      animate={{ width: `${value || 0}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
