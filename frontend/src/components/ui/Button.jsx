import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = {
  default: "bg-[#262626] text-[#A3A3A3] hover:bg-[#373737] border border-[#373737] hover:border-[#525252]",
  destructive: "bg-red-600 text-red-100 hover:bg-red-700 border border-red-700",
  outline: "border border-[#373737] bg-transparent hover:bg-[#171717] hover:text-[#A3A3A3] text-[#737373]",
  secondary: "bg-[#171717] text-[#A3A3A3] hover:bg-[#262626] border border-[#262626]",
  ghost: "hover:bg-[#171717] hover:text-[#A3A3A3] text-[#737373]",
  link: "text-[#A3A3A3] underline-offset-4 hover:underline"
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
};

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  disabled,
  showArrow = false,
  asChild = false,
  ...props 
}, ref) => {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium ring-offset-[#000000] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#525252] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md",
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  if (asChild) {
    // When asChild is true, wrap the child with button styles but don't render as button
    return React.cloneElement(React.Children.only(children), {
      className: cn(baseStyles, children.props.className),
      ref,
      ...props
    });
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={baseStyles}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </motion.button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
