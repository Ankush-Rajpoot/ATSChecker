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
    <div className="min-h-screen bg-dark-100 py-5 relative overflow-hidden">
      {/* Animated Floating Circles Background */}
      <div className="absolute inset-0 opacity-60">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-accent-500/40 to-accent-400/20 blur-lg"
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
          className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-accent-400/35 to-accent-300/15 blur-md"
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
          className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-dark-400/50 to-dark-300/25 blur-xl"
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
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-accent-300/30 to-accent-500/10 blur-sm"
          style={{ top: '30%', right: '10%' }}
          animate={{
            x: [0, -35, 20, 0],
            y: [0, 25, -30, 0],
            scale: [1, 1.4, 0.6, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-dark-500/45 to-dark-400/20 blur-lg"
          style={{ top: '5%', right: '45%' }}
          animate={{
            x: [0, 20, -40, 0],
            y: [0, -35, 15, 0],
            scale: [1, 0.9, 1.5, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-bold text-accent-400 mb-2">
            Analyze Your Resume
          </h1>
          <p className="text-base text-dark-700 max-w-lg mx-auto">
            Upload your resume and job description to get an instant ATS compatibility score
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="flex justify-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2.5">
            <motion.div 
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all duration-300 relative overflow-hidden ${
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
            <ArrowRight className="w-2.5 h-2.5 text-dark-600" />
            <motion.div 
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all duration-300 relative overflow-hidden ${
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
              <span className={`text-xs font-medium relative z-10 ${step === 2 && resumeFile && jobDescription.length < 50 ? 'text-gray-200' : ''}`}>Job Description</span>
            </motion.div>
            <ArrowRight className="w-2.5 h-2.5 text-dark-600" />
            <motion.div 
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all duration-300 relative overflow-hidden ${
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

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Resume Upload */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full border-dark-400/50 bg-dark-200/80 backdrop-blur-sm hover:border-accent-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-400/10 overflow-hidden">
              <div className="bg-black border-b border-dark-400 px-5 py-3">
                <CardTitle className="flex items-center text-base text-white">
                  <span className="relative flex items-center space-x-2 px-2.5 py-1 rounded-full border border-dark-400 bg-dark-200/30 hover:bg-dark-200/50 transition-all duration-200 overflow-hidden">
                    <FileText className="w-3.5 h-3.5 text-accent-300" />
                    <span className="text-xs text-gray-400">Upload Resume</span>
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 mt-1.5">
                  Upload your resume in PDF, DOC, DOCX, or TXT format
                </CardDescription>
              </div>
              <CardContent className="pt-3">
                <FileUpload
                  onFileSelect={(file) => {
                    setResumeFile(file);
                    // Step logic is now handled by useEffect
                  }}
                  className="mt-1.5"
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
              <div className="bg-black border-b border-dark-400 px-5 py-3">
                <CardTitle className="flex items-center text-base text-white">
                  <span className="relative flex items-center space-x-2 px-2.5 py-1 rounded-full border border-dark-400 bg-dark-200/30 hover:bg-dark-200/50 transition-all duration-200 overflow-hidden">
                    <Target className="w-3.5 h-3.5 text-accent-300" />
                    <span className="text-xs text-gray-400">Job Description</span>
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 mt-1.5">
                  Paste the job description you want to optimize your resume for
                </CardDescription>
              </div>
              <CardContent className="pt-3">
                <div className="mt-1.5">
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here. Include all requirements, skills, and qualifications mentioned in the posting..."
                    className="w-full h-40 px-2.5 py-2 border border-dark-500/50 rounded-lg focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400/50 resize-none transition-all duration-200 bg-dark-300/80 text-accent-400 placeholder-dark-700 hover:border-dark-400 text-xs backdrop-blur-sm"
                  />
                  <div className="flex justify-between items-center mt-1.5">
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
          className="text-center mt-6"
        >
          <Button
            onClick={handleAnalyze}
            disabled={!canProceed}
            size="lg"
            className={`inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
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
                className="text-dark-700 mt-2.5 text-xs"
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