import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share, ArrowLeft, RefreshCw } from 'lucide-react';
import ScoreCard from '../components/results/ScoreCard';
import SkillsAnalysis from '../components/results/SkillsAnalysis';
import SectionBreakdown from '../components/results/SectionBreakdown';
import Suggestions from '../components/results/Suggestions';
import useATSStore from '../store/atsStore';
import { generateATSReportPDF } from '../utils/pdfUtils';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ResultsPageSkeleton } from '../components/skeletons';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getReport } = useATSStore();
  const [isExporting, setIsExporting] = React.useState(false);
  const [report, setReport] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        
        // Clear any corrupted cache data first
        useATSStore.getState().clearCorruptedCache();
        
        const reportData = await getReport(id);
        
        // Debug logging
        console.log('🔍 Full report data:', reportData);
        console.log('🔍 Job description value:', reportData?.jobDescription);
        console.log('🔍 Job description type:', typeof reportData?.jobDescription);
        console.log('🔍 Job description length:', reportData?.jobDescription?.length);
        console.log('🔍 All report keys:', Object.keys(reportData || {}));
        
        setReport(reportData);
      } catch (error) {
        console.error('Failed to load report:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadReport();
    }
  }, [id, getReport, navigate]);

  const handleExportPDF = async () => {
    if (!report) return;
    
    setIsExporting(true);
    try {
      await generateATSReportPDF(report);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && report) {
      try {
        await navigator.share({
          title: `ATS Score Report - ${report.score}%`,
          text: `Check out my ATS compatibility score of ${report.score}% for ${report.fileName}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading || !report) {
    return <ResultsPageSkeleton />;
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#000000] py-4"
      id="results-container"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Compact Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5"
        >
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 text-dark-700 hover:text-accent-400 transition-colors rounded-lg hover:bg-dark-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-accent-400">
                ATS Analysis Results
              </h1>
              <p className="text-dark-700 text-xs">
                {report.fileName} • {new Date(report.analyzedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
            <Button
              onClick={handleShare}
              variant="outline"
              className="inline-flex items-center space-x-1.5 text-xs px-2.5 py-1.5"
            >
              <Share className="w-3.5 h-3.5" />
              <span>Share</span>
            </Button>
            
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="inline-flex items-center space-x-1.5 text-xs px-2.5 py-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </Button>
          </div>
        </motion.div>

        {/* Main Layout Grid */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Score Card */}
            <motion.div variants={itemVariants}>
              <ScoreCard score={report.score} />
            </motion.div>

            {/* Improvement Suggestions with Scroll */}
            <motion.div variants={itemVariants}>
              <Suggestions suggestions={report.suggestions} report={report} />
            </motion.div>
          </div>

          {/* Right Column - Section Breakdown */}
          <motion.div variants={itemVariants}>
            <SectionBreakdown sections={report.sections} />
          </motion.div>
        </div>

        {/* Skills Analysis - Full Width with Scroll */}
        <motion.div variants={itemVariants} className="mt-4">
          <SkillsAnalysis 
            matchedSkills={report.matchedSkills}
            missingSkills={report.missingSkills}
          />
        </motion.div>

        {/* Job Description Preview */}
        <motion.div variants={itemVariants} className="mt-4">
          <Card className="bg-[#0A0A0A] border-[#373737]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white">
                Job Description (Preview)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#171717] rounded-lg p-3 border border-[#262626]">
                <p className="text-[#737373] text-xs leading-relaxed line-clamp-4">
                  {report.jobDescription || 'No job description available for this analysis.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compact Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6"
        >
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 font-medium shadow-lg hover:shadow-xl text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Analyze Another Resume</span>
            </Button>
            
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-1.5 text-dark-700 hover:text-accent-400 font-medium transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;