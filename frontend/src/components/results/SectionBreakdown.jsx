import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Hash, Briefcase, GraduationCap, Star } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const SectionBreakdown = ({ sections, className = '' }) => {
  const sectionIcons = {
    formatting: FileText,
    keywords: Hash,
    experience: Briefcase,
    education: GraduationCap
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Card className={`${className} bg-[#0A0A0A] border-[#373737] h-[580px] flex flex-col`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#171717] rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">Section Breakdown</CardTitle>
            <p className="text-[#737373] text-xs">Detailed analysis of resume sections</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4 pr-2">
          {Object.entries(sections).map(([section, data]) => {
            const IconComponent = sectionIcons[section] || FileText;
            const scoreColor = getScoreColor(data.score);
            
            // Using universal grade colors and your palette
            const scoreColorClass = scoreColor === 'high' ? 'text-green-400' : 
                                   scoreColor === 'medium' ? 'text-yellow-400' : 
                                   'text-red-400';
            
            return (
              <motion.div
                key={section}
                variants={itemVariants}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 bg-[#171717] rounded-lg flex items-center justify-center">
                      <IconComponent className="w-3.5 h-3.5 text-[#737373]" />
                    </div>
                    <span className="font-medium text-white capitalize text-sm">
                      {section}
                    </span>
                  </div>
                  <span className={`font-bold text-sm ${scoreColorClass}`}>
                    {data.score}%
                  </span>
                </div>

                <ProgressBar 
                  progress={data.score} 
                  color={scoreColor}
                  showLabel={false}
                  size="sm"
                />

                <p className="text-xs text-[#737373] ml-9 leading-relaxed">
                  {data.feedback}
                </p>
              </motion.div>
            );
          })}

          <div className="mt-4 p-3 bg-[#171717] border border-[#262626] rounded-lg">
            <h4 className="font-medium text-white mb-2 text-sm">How to improve your sections:</h4>
            <ul className="text-xs text-[#737373] space-y-1">
              <li>• <strong className="text-[#A3A3A3]">Formatting:</strong> Use clear headers, bullet points, and consistent spacing</li>
              <li>• <strong className="text-[#A3A3A3]">Keywords:</strong> Include relevant technical terms from the job description</li>
              <li>• <strong className="text-[#A3A3A3]">Experience:</strong> Quantify achievements with numbers and metrics</li>
              <li>• <strong className="text-[#A3A3A3]">Education:</strong> Include relevant coursework, certifications, and GPA if strong</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionBreakdown;