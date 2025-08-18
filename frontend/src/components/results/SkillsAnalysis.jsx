import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const SkillsAnalysis = ({ matchedSkills, missingSkills, className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`grid md:grid-cols-2 gap-4 ${className}`}>
      {/* Matched Skills */}
      <Card className="bg-[#0A0A0A] border-[#373737] h-[300px] flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#171717] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Matched Skills</h3>
              <p className="text-[#737373] text-xs">Skills found in your resume</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-2 pr-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {matchedSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  variants={itemVariants}
                  className="flex items-center justify-between p-2.5 bg-[#171717] rounded-lg border border-[#262626]"
                >
                  <span className="font-medium text-[#A3A3A3] text-sm">{skill}</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-4 p-3 bg-[#171717] rounded-lg border border-[#262626]">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium text-white text-xs">
                  Great job! These skills align well with the job requirements.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missing Skills */}
      <Card className="bg-[#0A0A0A] border-[#373737] h-[300px] flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#171717] rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Missing Skills</h3>
              <p className="text-[#737373] text-xs">Skills to add to your resume</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-2 pr-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {missingSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  variants={itemVariants}
                  className="flex items-center justify-between p-2.5 bg-[#171717] rounded-lg border border-[#262626]"
                >
                  <span className="font-medium text-[#737373] text-sm">{skill}</span>
                  <XCircle className="w-4 h-4 text-red-400" />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-4 p-3 bg-[#171717] rounded-lg border border-[#262626]">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <span className="font-medium text-[#A3A3A3] block text-xs">
                    Consider adding these skills
                  </span>
                  <span className="text-[#737373] text-xs">
                    Include relevant experience with these technologies in your resume.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsAnalysis;