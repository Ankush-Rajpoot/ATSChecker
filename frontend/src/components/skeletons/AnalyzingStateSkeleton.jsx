import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '../common/ProgressBar';
import useATSStore from '../../store/atsStore';
import { Zap } from 'lucide-react';

const AnalyzingStateSkeleton = () => {
  const { progress } = useATSStore();

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      <div className="max-w-sm w-full border border-[#262626] bg-[#0A0A0A] backdrop-blur-sm rounded-xl">
        <div className="p-6 text-center">
          <div className="mb-5">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-[#171717] to-[#262626] border border-[#373737] rounded-full flex items-center justify-center mx-auto mb-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-6 h-6 text-[#A3A3A3]" />
            </motion.div>
            <h2 className="text-xl font-bold text-[#A3A3A3] mb-2">Analyzing Your Resume</h2>
            <p className="text-[#737373] text-sm">
              Our AI is carefully analyzing your resume against the job requirements...
            </p>
          </div>

          <ProgressBar progress={progress} className="mb-3" />
          
          <motion.div 
            className="text-xs text-[#737373]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {progress < 30 && "Reading your resume..."}
            {progress >= 30 && progress < 50 && "Processing job description..."}
            {progress >= 50 && progress < 80 && "Matching skills and keywords..."}
            {progress >= 80 && progress < 100 && "Generating insights..."}
            {progress >= 100 && "Almost done!"}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingStateSkeleton;
