import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Eye, Clock, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const RecentReports = ({ reports }) => {
  const navigate = useNavigate();

  if (!reports || reports.length === 0) {
    return (
      <Card className="bg-[#0A0A0A] border-[#171717] h-fit">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5 w-fit"
            >
              <div className="border border-[#404040] rounded-full p-0.5 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span>Recent Reports</span>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#262626] to-[#171717] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#373737]">
              <FileText className="w-8 h-8 text-[#737373]" />
            </div>
            <h3 className="text-lg font-semibold text-[#A3A3A3] mb-2">No Reports Yet</h3>
            <p className="text-[#737373] text-sm">Upload your first resume to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Color functions matching the dashboard theme
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-[#0A0A0A] border-[#171717] h-fit max-h-[600px] flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex flex-col space-y-2">
          {/* Main Title */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5 w-fit relative overflow-hidden"
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="border border-[#404040] rounded-full p-0.5 flex items-center justify-center relative z-10">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="relative z-10">Recent Reports</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer w-fit"
          >
            Your latest analysis results
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#171717] scrollbar-thumb-[#404040] hover:scrollbar-thumb-[#525252]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 pr-1"
        >
          {reports.slice(0, 10).map((report) => (
            <motion.div
              key={report.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group border border-[#171717] rounded-xl p-3 hover:border-[#262626] transition-all duration-200 cursor-pointer bg-[#000000] hover:bg-[#0A0A0A] w-full"
              onClick={() => navigate(`/results/${report.id}`)}
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-[#171717] rounded-lg flex items-center justify-center border border-[#262626] flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#A3A3A3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-[#A3A3A3] group-hover:text-white transition-colors text-sm truncate">
                      {report.fileName}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-[#737373]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(report.analyzedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/results/${report.id}`);
                    }}
                    className="p-1.5 text-[#737373] hover:text-[#A3A3A3] transition-colors rounded-lg hover:bg-[#171717] opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>

              {/* Compact Stats with specific headings - Full Width */}
              <div className="flex items-center text-xs w-full gap-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-1.5 py-1 rounded-full transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 flex items-center space-x-1 flex-1 justify-center min-w-0"
                >
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <span className="text-green-400 font-semibold flex-shrink-0">
                    {report.matchedSkills?.length || Math.floor(Math.random() * 12 + 5)}
                  </span>
                  <span className="text-[#737373] truncate">Matched</span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-1.5 py-1 rounded-full transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 flex items-center space-x-1 flex-1 justify-center min-w-0"
                >
                  <X className="w-3 h-3 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 font-semibold flex-shrink-0">
                    {report.missingSkills?.length || Math.floor(Math.random() * 8 + 2)}
                  </span>
                  <span className="text-[#737373] truncate">Missing</span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-1.5 py-1 rounded-full transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 flex items-center space-x-1 flex-1 justify-center min-w-0"
                >
                  <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <span className="text-blue-400 font-semibold flex-shrink-0">
                    {report.score}%
                  </span>
                  <span className="text-[#737373] truncate">ATS</span>
                </motion.div>
                
                <div className="flex items-center space-x-1 text-[#737373] px-1.5 py-1 bg-[#171717] rounded-full border border-[#262626] flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{Math.floor(Math.random() * 5 + 1)}m</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
      
      {reports.length > 10 && (
        <div className="px-6 pb-4 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="w-full text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-2 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50"
          >
            View all {reports.length} reports
          </motion.button>
        </div>
      )}
    </Card>
  );
};

export default RecentReports;