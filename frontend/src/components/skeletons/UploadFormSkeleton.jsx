import React from 'react';
import { motion } from 'framer-motion';

const UploadFormSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#000000] py-5 relative overflow-hidden">
      {/* Animated Background Skeleton Circles */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-[#171717] blur-lg"
          style={{ top: '10%', left: '15%' }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-[#262626] blur-md"
          style={{ top: '60%', right: '20%' }}
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 30, -25, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-[#171717] blur-xl"
          style={{ bottom: '20%', left: '10%' }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -20, 35, 0],
            scale: [1, 1.3, 0.7, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7 relative z-10">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <div className="h-8 bg-[#171717] rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-5 bg-[#0A0A0A] rounded-lg w-96 mx-auto animate-pulse"></div>
        </motion.div>

        {/* Progress Steps Skeleton */}
        <motion.div 
          className="flex justify-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#171717] border border-[#262626] animate-pulse">
              <div className="w-3 h-3 bg-[#373737] rounded-full"></div>
              <div className="w-12 h-3 bg-[#373737] rounded"></div>
            </div>
            <div className="w-2.5 h-2.5 bg-[#525252] rounded-full"></div>
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0A0A0A] border border-[#171717] animate-pulse">
              <div className="w-3 h-3 bg-[#262626] rounded-full"></div>
              <div className="w-20 h-3 bg-[#262626] rounded"></div>
            </div>
            <div className="w-2.5 h-2.5 bg-[#525252] rounded-full"></div>
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0A0A0A] border border-[#171717] animate-pulse">
              <div className="w-3 h-3 bg-[#262626] rounded-full"></div>
              <div className="w-16 h-3 bg-[#262626] rounded"></div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Resume Upload Skeleton */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="h-full border border-[#262626] bg-[#0A0A0A] rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="bg-[#000000] border-b border-[#262626] px-5 py-3">
                <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full border border-[#262626] bg-[#171717] animate-pulse">
                  <div className="w-3.5 h-3.5 bg-[#373737] rounded-full"></div>
                  <div className="w-20 h-3 bg-[#373737] rounded"></div>
                </div>
                <div className="w-48 h-3 bg-[#171717] rounded mt-1.5 animate-pulse"></div>
              </div>
              <div className="pt-3 px-5 pb-5">
                <div className="mt-1.5">
                  {/* File Upload Area Skeleton */}
                  <div className="border-2 border-dashed border-[#262626] rounded-xl p-8 text-center bg-[#171717]/30 animate-pulse">
                    <div className="w-16 h-16 bg-[#262626] rounded-full mx-auto mb-4"></div>
                    <div className="space-y-3">
                      <div className="w-32 h-5 bg-[#262626] rounded mx-auto"></div>
                      <div className="w-48 h-4 bg-[#171717] rounded mx-auto"></div>
                      <div className="w-40 h-4 bg-[#171717] rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Job Description Skeleton */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="h-full border border-[#262626] bg-[#0A0A0A] rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="bg-[#000000] border-b border-[#262626] px-5 py-3">
                <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full border border-[#262626] bg-[#171717] animate-pulse">
                  <div className="w-3.5 h-3.5 bg-[#373737] rounded-full"></div>
                  <div className="w-24 h-3 bg-[#373737] rounded"></div>
                </div>
                <div className="w-52 h-3 bg-[#171717] rounded mt-1.5 animate-pulse"></div>
              </div>
              <div className="pt-3 px-5 pb-5">
                <div className="mt-1.5">
                  <div className="w-full h-40 border border-[#262626] rounded-lg bg-[#171717]/50 animate-pulse"></div>
                  <div className="flex justify-between items-center mt-1.5">
                    <div className="w-16 h-3 bg-[#171717] rounded animate-pulse"></div>
                    <div className="w-32 h-3 bg-[#171717] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analyze Button Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#171717] border border-[#262626] rounded-lg animate-pulse">
            <div className="w-4 h-4 bg-[#373737] rounded-full"></div>
            <div className="w-24 h-4 bg-[#373737] rounded"></div>
            <div className="w-3.5 h-3.5 bg-[#373737] rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadFormSkeleton;
