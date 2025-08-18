import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, TrendingUp, Award, BarChart3, Target, Clock, Zap, Users, ChevronDown, ChevronUp } from 'lucide-react';

const StatsAccordion = ({ stats }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded

  if (!stats) return null;

  const cards = [
    {
      title: 'Total Reports',
      value: stats.totalReports || 0,
      icon: FileText,
      color: 'primary',
      change: stats.totalReports > 0 ? '+' + Math.floor(Math.random() * 20 + 5) + '%' : '0%',
      changeType: stats.totalReports > 0 ? 'increase' : 'neutral',
      description: 'Resumes analyzed',
      gradient: 'from-[#373737] to-[#262626]',
      isPercentage: false,
      valueType: 'reports'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore || 0}%`,
      icon: BarChart3,
      color: 'secondary',
      change: stats.averageScore > 70 ? '+5.2%' : stats.averageScore > 50 ? '+2.1%' : '-1.3%',
      changeType: stats.averageScore > 50 ? 'increase' : 'decrease',
      description: 'ATS compatibility',
      gradient: 'from-[#525252] to-[#373737]',
      isPercentage: true,
      percentageValue: stats.averageScore || 0
    },
    {
      title: 'Highest Score',
      value: `${stats.highestScore || 0}%`,
      icon: Award,
      color: 'accent',
      change: `Best: ${stats.highestScore || 0}%`,
      changeType: 'neutral',
      description: 'Personal best',
      gradient: 'from-[#737373] to-[#525252]',
      isPercentage: true,
      percentageValue: stats.highestScore || 0
    },
    {
      title: 'Success Rate',
      value: stats.totalReports > 0 ? Math.round((stats.totalReports * 0.7)) + '%' : '0%',
      icon: Target,
      color: 'success',
      change: '+8.1%',
      changeType: 'increase',
      description: 'Optimization success',
      gradient: 'from-[#404040] to-[#373737]',
      isPercentage: true,
      percentageValue: stats.totalReports > 0 ? Math.round((stats.totalReports * 0.7)) : 0
    },
    {
      title: 'Time Saved',
      value: stats.totalReports ? `${Math.round(stats.totalReports * 2.5)}h` : '0h',
      icon: Clock,
      color: 'time',
      change: '+15h',
      changeType: 'increase',
      description: 'vs manual review',
      gradient: 'from-[#262626] to-[#171717]',
      isPercentage: false,
      valueType: 'time'
    },
    {
      title: 'Quick Fixes',
      value: stats.totalReports ? Math.round(stats.totalReports * 8.2) : 0,
      icon: Zap,
      color: 'fixes',
      change: '+24',
      changeType: 'increase',
      description: 'Issues resolved',
      gradient: 'from-[#373737] to-[#262626]',
      isPercentage: false,
      valueType: 'fixes'
    }
  ];

  // Function to get color based on percentage criteria
  const getPercentageColor = (value) => {
    if (value >= 80) return 'text-green-400'; // Excellent performance - green
    if (value >= 60) return 'text-blue-400'; // Good performance - blue
    if (value >= 40) return 'text-yellow-400'; // Average performance - yellow
    return 'text-red-400'; // Poor performance - red
  };

  // Function to get color for change/improvement values
  const getChangeColor = (changeType, value) => {
    if (changeType === 'increase') {
      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (numericValue >= 15) return 'text-green-400 border-green-500/30'; // High improvement
      if (numericValue >= 8) return 'text-blue-400 border-blue-500/30'; // Good improvement
      if (numericValue >= 3) return 'text-yellow-400 border-yellow-500/30'; // Moderate improvement
      return 'text-red-400 border-red-500/30'; // Low improvement
    }
    return 'text-red-400 border-red-500/30'; // Decrease or neutral
  };

  // Function to get color for important numbers (time, fixes, reports)
  const getImportantNumberColor = (value, type) => {
    switch (type) {
      case 'reports':
        if (value >= 20) return 'text-green-400'; // Many reports
        if (value >= 10) return 'text-blue-400'; // Good amount
        if (value >= 5) return 'text-yellow-400'; // Some reports
        return 'text-red-400'; // Few reports
      
      case 'time':
        const timeValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        if (timeValue >= 20) return 'text-green-400'; // High time saved
        if (timeValue >= 10) return 'text-blue-400'; // Good time saved
        if (timeValue >= 5) return 'text-yellow-400'; // Moderate time saved
        return 'text-red-400'; // Low time saved
      
      case 'fixes':
        if (value >= 50) return 'text-green-400'; // Many fixes
        if (value >= 25) return 'text-blue-400'; // Good fixes
        if (value >= 10) return 'text-yellow-400'; // Some fixes
        return 'text-red-400'; // Few fixes
      
      default:
        return 'text-blue-400';
    }
  };

  const colorClasses = {
    primary: {
      bg: 'bg-[#171717]',
      icon: 'text-[#A3A3A3]',
      text: 'text-[#A3A3A3]',
      border: 'border-[#404040]'
    },
    secondary: {
      bg: 'bg-[#0A0A0A]',
      icon: 'text-[#A3A3A3]',
      text: 'text-[#A3A3A3]',
      border: 'border-[#404040]'
    },
    accent: {
      bg: 'bg-[#262626]',
      icon: 'text-[#A3A3A3]',
      text: 'text-[#A3A3A3]',
      border: 'border-[#525252]'
    },
    success: {
      bg: 'bg-[#0A0A0A]',
      icon: 'text-[#737373]',
      text: 'text-[#737373]',
      border: 'border-[#373737]'
    },
    time: {
      bg: 'bg-[#171717]',
      icon: 'text-[#737373]',
      text: 'text-[#737373]',
      border: 'border-[#373737]'
    },
    fixes: {
      bg: 'bg-[#0A0A0A]',
      icon: 'text-[#737373]',
      text: 'text-[#737373]',
      border: 'border-[#373737]'
    }
  };

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
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-[#171717]/30 hover:bg-[#171717]/50 transition-all duration-200 border-b border-[#262626]/50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#404040] flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#A3A3A3]" />
          </div>
          <span className="text-sm font-medium text-[#A3A3A3]">Performance Statistics</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[#737373]" />
        </motion.div>
      </motion.button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-4 grid grid-cols-1 gap-2.5"
            >
              {cards.map((card, index) => {
                const colors = colorClasses[card.color];
                const IconComponent = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <div className={`
                      text-white hover:text-[#A3A3A3] 
                      border border-[#404040] hover:border-[#A3A3A3] 
                      px-2.5 py-1.5 rounded-full text-xs font-medium 
                      transition-all duration-200 
                      bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 
                      flex items-center space-x-1.5 cursor-pointer
                      min-w-fit
                    `}>
                      <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center border ${colors.border}`}>
                        <IconComponent className={`w-3.5 h-3.5 ${colors.icon}`} />
                      </div>
                      
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-sm font-bold leading-none ${
                          card.isPercentage 
                            ? getPercentageColor(card.percentageValue) 
                            : card.valueType 
                              ? getImportantNumberColor(card.value, card.valueType)
                              : colors.text
                        }`}>
                          {card.value}
                        </span>
                        <span className="text-xs text-[#737373]">
                          {card.title}
                        </span>
                        {card.changeType !== 'neutral' && (
                          <span className={`text-xs font-semibold px-1 py-0.5 rounded-full border bg-[#0A0A0A] ${
                            getChangeColor(card.changeType, card.change)
                          }`}>
                            {card.change}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatsAccordion;
