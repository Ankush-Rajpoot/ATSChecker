import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Loader, FileText, Target } from 'lucide-react';
import FileUpload from './FileUpload';
import ProgressBar from '../common/ProgressBar';
import useATSStore from '../../store/atsStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AnalyzingStateSkeleton } from '../skeletons';

const UploadForm = () => {
  const navigate = useNavigate();
  const { analyzeResume, isAnalyzing, progress } = useATSStore();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [step, setStep] = useState(1);

  // Update step based on current state
  React.useEffect(() => {
    if (!resumeFile) {
      setStep(1); // Reset to step 1 if no resume
    } else if (resumeFile && jobDescription.trim().length < 50) {
      setStep(2); // Move to step 2 if resume exists but job description incomplete
    } else if (resumeFile && jobDescription.trim().length >= 50) {
      setStep(3); // Move to step 3 if both are complete
    }
  }, [resumeFile, jobDescription]);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) return;

    try {
      const report = await analyzeResume(resumeFile, jobDescription);
      navigate(`/results/${report.id}`);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const canProceed = resumeFile && jobDescription.trim().length > 50;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (isAnalyzing) {
    return <AnalyzingStateSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#000000] py-3 sm:py-5 relative overflow-hidden">
      {/* Animated Zigzag Thread Background */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Base Thread Path */}
          <motion.path
            d="M 0 0 L 200 100 L 100 200 L 300 300 L 200 400 L 400 500 L 300 600 L 500 700 L 400 800 L 600 900 L 500 1000 L 700 1080"
            stroke="url(#threadGradient)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              strokeDashoffset: [0, -8]
            }}
            transition={{ 
              pathLength: { duration: 3, ease: "easeInOut" },
              opacity: { duration: 1 },
              strokeDashoffset: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          
          {/* Shimmer Effect Path */}
          <motion.path
            d="M 0 0 L 200 100 L 100 200 L 300 300 L 200 400 L 400 500 L 300 600 L 500 700 L 400 800 L 600 900 L 500 1000 L 700 1080"
            stroke="url(#shimmerGradient1)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          <defs>
            <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#373737" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#525252" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#737373" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#A3A3A3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#373737" stopOpacity="0.2" />
            </linearGradient>
            
            {/* Shimmer Gradient */}
            <linearGradient id="shimmerGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3A3A3" stopOpacity="0" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A3A3A3" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A3A3A3" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-5"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-accent-400 mb-2">
            Analyze Your Resume
          </h1>
          <p className="text-sm sm:text-base text-dark-700 max-w-lg mx-auto px-4">
            Upload your resume and job description to get an instant ATS compatibility score
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="flex justify-center mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-2.5 px-2">
            <motion.div 
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full transition-all duration-300 relative overflow-hidden ${
                step >= 1 ? 'bg-gradient-to-r from-accent-500/20 to-accent-400/20 text-accent-300 border border-accent-400/30 shadow-sm shadow-accent-400/20' : 'bg-dark-400/50 text-dark-700 border border-dark-500/50'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {/* Shining effect for Resume step */}
              {step === 1 && !resumeFile && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              <FileText className="w-3 h-3 relative z-10" />
              <span className={`text-xs font-medium relative z-10 ${step === 1 && !resumeFile ? 'text-gray-200' : ''}`}>Resume</span>
            </motion.div>
            <ArrowRight className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-dark-600" />
            <motion.div 
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full transition-all duration-300 relative overflow-hidden ${
                step >= 2 ? 'bg-gradient-to-r from-accent-500/20 to-accent-400/20 text-accent-300 border border-accent-400/30 shadow-sm shadow-accent-400/20' : 'bg-dark-400/50 text-dark-700 border border-dark-500/50'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {/* Shining effect for Job Description step */}
              {step === 2 && resumeFile && jobDescription.length < 50 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              <Target className="w-3 h-3 relative z-10" />
              <span className={`text-xs font-medium relative z-10 ${step === 2 && resumeFile && jobDescription.length < 50 ? 'text-gray-200' : ''}`}>Job Desc.</span>
            </motion.div>
            <ArrowRight className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-dark-600" />
            <motion.div 
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full transition-all duration-300 relative overflow-hidden ${
                canProceed ? 'bg-gradient-to-r from-accent-500/20 to-accent-400/20 text-accent-300 border border-accent-400/30 shadow-sm shadow-accent-400/20' : 'bg-dark-400/50 text-dark-700 border border-dark-500/50'
              }`}
              whileHover={{ scale: canProceed ? 1.05 : 1 }}
            >
              {/* Shining effect for Analyze step */}
              {canProceed && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              <Zap className="w-3 h-3 relative z-10" />
              <span className={`text-xs font-medium relative z-10 ${canProceed ? 'text-gray-200' : ''}`}>Analyze</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Resume Upload */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full border-dark-400/50 bg-dark-200/80 backdrop-blur-sm hover:border-accent-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-400/10 overflow-hidden">
              <div className="bg-black border-b border-dark-400 px-3 sm:px-5 py-2.5 sm:py-3">
                <CardTitle className="flex items-center text-sm sm:text-base text-white">
                  <span className="relative flex items-center space-x-2 px-2 sm:px-2.5 py-1 rounded-full border border-dark-400 bg-dark-200/30 hover:bg-dark-200/50 transition-all duration-200 overflow-hidden">
                    <FileText className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-300" />
                    <span className="text-xs text-gray-400">Upload Resume</span>
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 mt-1 sm:mt-1.5">
                  Upload your resume in PDF, DOC, DOCX, or TXT format
                </CardDescription>
              </div>
              <CardContent className="pt-2 sm:pt-3 px-3 sm:px-6 pb-4 sm:pb-6">
                <FileUpload
                  onFileSelect={(file) => {
                    setResumeFile(file);
                    // Step logic is now handled by useEffect
                  }}
                  className="mt-1 sm:mt-1.5"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Description */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full border-dark-400/50 bg-dark-200/80 backdrop-blur-sm hover:border-accent-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-400/10 overflow-hidden">
              <div className="bg-black border-b border-dark-400 px-3 sm:px-5 py-2.5 sm:py-3">
                <CardTitle className="flex items-center text-sm sm:text-base text-white">
                  <span className="relative flex items-center space-x-2 px-2 sm:px-2.5 py-1 rounded-full border border-dark-400 bg-dark-200/30 hover:bg-dark-200/50 transition-all duration-200 overflow-hidden">
                    <Target className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-300" />
                    <span className="text-xs text-gray-400">Job Description</span>
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 mt-1 sm:mt-1.5">
                  Paste the job description you want to optimize your resume for
                </CardDescription>
              </div>
              <CardContent className="pt-2 sm:pt-3 px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="mt-1 sm:mt-1.5">
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here. Include all requirements, skills, and qualifications mentioned in the posting..."
                    className="w-full h-32 sm:h-40 px-2 sm:px-2.5 py-2 border border-dark-500/50 rounded-lg focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400/50 resize-none transition-all duration-200 bg-dark-300/80 text-accent-400 placeholder-dark-700 hover:border-dark-400 text-xs backdrop-blur-sm"
                  />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1.5 space-y-1 sm:space-y-0">
                    <span className="text-xs text-dark-700">
                      {jobDescription.length} characters
                    </span>
                    <span className={`text-xs transition-colors duration-200 ${
                      jobDescription.length >= 50 ? 'text-accent-400' : 'text-dark-700'
                    }`}>
                      Minimum 50 characters required
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4 sm:mt-6"
        >
          <Button
            onClick={handleAnalyze}
            disabled={!canProceed}
            size="lg"
            className={`inline-flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
              canProceed ? 'shadow-accent-400/20 hover:shadow-accent-400/30' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Analyze Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          
          <AnimatePresence>
            {canProceed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-dark-700 mt-2 sm:mt-2.5 text-xs px-4"
              >
                Analysis typically takes 10-15 seconds
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadForm;