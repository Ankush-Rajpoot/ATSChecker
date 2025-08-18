import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertTriangle } from 'lucide-react';

const ScoreCard = ({ score, className = '' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return Award;
    if (score >= 60) return Target;
    return AlertTriangle;
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent ATS Compatibility';
    if (score >= 60) return 'Good - Room for Improvement';
    return 'Needs Significant Improvement';
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Your resume is highly optimized for ATS systems.';
    if (score >= 60) return 'Your resume has good potential but could benefit from optimization.';
    return 'Your resume may struggle with ATS systems. Consider implementing improvements.';
  };

  const scoreColor = getScoreColor(score);
  const ScoreIcon = getScoreIcon(score);
  
  // Using your specified dark palette with universal grade colors
  const colorClasses = {
    high: {
      bg: 'bg-[#0A0A0A]',
      border: 'border-[#373737]',
      text: 'text-[#A3A3A3]',
      icon: 'text-green-500', // Universal A grade color
      accent: 'text-green-400'
    },
    medium: {
      bg: 'bg-[#0A0A0A]',
      border: 'border-[#262626]', 
      text: 'text-[#737373]',
      icon: 'text-yellow-500', // Universal B grade color
      accent: 'text-yellow-400'
    },
    low: {
      bg: 'bg-[#0A0A0A]',
      border: 'border-[#171717]',
      text: 'text-[#525252]', 
      icon: 'text-red-500', // Universal C/F grade color
      accent: 'text-red-400'
    }
  };

  const colors = colorClasses[scoreColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${colors.bg}/30 ${colors.border}/40 border rounded-xl p-4 h-[196px] ${className} backdrop-blur-md overflow-hidden`}
      style={{
        background: 'rgba(10, 10, 10, 0.3)',
        borderColor: 'rgba(55, 55, 55, 0.4)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      
      {/* Shimmer effect for entire card */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        animate={{
          x: [-400, 400],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-1"
        >
          <div className="relative inline-block">
            {/* Compact Score Circle */}
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                  className="text-[#262626]"
                />
                <motion.path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={colors.icon}
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${score}, 100` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className={`text-xl font-bold ${colors.accent}`}>
                    {score}
                  </div>
                  <div className={`text-xs font-medium ${colors.text}`}>
                    ATS Score
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Compact Score Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className={`absolute -bottom-2 -right-2 w-6 h-6 ${colors.bg} ${colors.border} border rounded-full flex items-center justify-center`}
            >
              <ScoreIcon className={`w-3 h-3 ${colors.icon}`} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className={`text-xs font-bold mb-0.5 ${colors.accent}`}>
            {getScoreMessage(score)}
          </h3>
          <p className={`text-xs leading-relaxed ${colors.text}`}>
            {getScoreDescription(score)}
          </p>
        </motion.div>

        {/* Compact Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-2 grid grid-cols-3 gap-2"
        >
          <div className="text-center">
            <div className={`text-xs font-bold ${colors.accent}`}>
              {score >= 80 ? '80+' : score >= 60 ? '60-79' : '<60'}
            </div>
            <div className={`text-xs ${colors.text}`}>Score Range</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-bold ${colors.accent}`}>
              {score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low'}
            </div>
            <div className={`text-xs ${colors.text}`}>Pass Rate</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-bold ${colors.accent}`}>
              {score >= 80 ? 'A' : score >= 60 ? 'B' : 'C'}
            </div>
            <div className={`text-xs ${colors.text}`}>Grade</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScoreCard;