import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  CheckSquare, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  Award,
  BarChart3,
  Zap,
  Brain,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const Suggestions = ({ suggestions, report, className = '' }) => {
  // Generate dynamic suggestions based on the complete report data
  const generateDynamicSuggestions = () => {
    const dynamicSuggestions = [];
    
    if (!report) return suggestions || [];

    const { score, sections, matchedSkills, missingSkills } = report;
    
    // Score-based suggestions
    if (score < 60) {
      dynamicSuggestions.push({
        type: 'critical',
        priority: 5,
        suggestion: 'Your ATS score needs significant improvement. Focus on keyword optimization and skills alignment first.',
        impact: 'Critical for ATS compatibility',
        icon: AlertTriangle,
        actionable: 'Start with adding 5-7 missing keywords and 2-3 relevant skills'
      });
    } else if (score < 80) {
      dynamicSuggestions.push({
        type: 'improvement',
        priority: 4,
        suggestion: 'Good foundation! Focus on fine-tuning keyword density and adding missing technical skills.',
        impact: 'Could increase score by 10-15 points',
        icon: TrendingUp,
        actionable: 'Add 3-5 missing keywords and improve weakest section'
      });
    }

    // Skills-based suggestions
    if (missingSkills && missingSkills.length > 0) {
      const criticalSkills = missingSkills.slice(0, 3);
      dynamicSuggestions.push({
        type: 'skills',
        priority: 4,
        suggestion: `Add experience with high-demand skills: ${criticalSkills.join(', ')}`,
        impact: 'Significantly improves skill matching',
        icon: Target,
        actionable: `Include 1-2 projects or experiences demonstrating these skills`
      });
    }

    // Section-specific suggestions
    if (sections) {
      const weakSections = Object.entries(sections)
        .filter(([_, data]) => data.score < 70)
        .sort(([,a], [,b]) => a.score - b.score);

      weakSections.forEach(([sectionName, sectionData]) => {
        let suggestionText = '';
        let actionable = '';
        
        switch (sectionName) {
          case 'formatting':
            suggestionText = 'Improve resume structure with clear section headers, bullet points, and consistent formatting';
            actionable = 'Use standard headings: Experience, Education, Skills, Projects';
            break;
          case 'keywords':
            suggestionText = `Keyword density is low (${sectionData.matchedCount || 0}/${sectionData.totalCount || 0} matched). Integrate more job-specific terms naturally`;
            actionable = 'Review job posting and add 5-7 relevant keywords throughout your resume';
            break;
          case 'experience':
            suggestionText = 'Strengthen experience section with quantified achievements and specific results';
            actionable = 'Add numbers, percentages, and metrics to your accomplishments';
            break;
          case 'education':
            suggestionText = 'Include relevant education, certifications, and coursework';
            actionable = 'Add GPA (if 3.5+), relevant coursework, and professional certifications';
            break;
          case 'skills':
            suggestionText = 'Expand skills section with both technical abilities and soft skills';
            actionable = 'Create separate subsections for Technical Skills and Core Competencies';
            break;
        }
        
        if (suggestionText) {
          dynamicSuggestions.push({
            type: sectionName,
            priority: 3,
            suggestion: suggestionText,
            impact: `Will improve ${sectionName} section score`,
            icon: BarChart3,
            actionable
          });
        }
      });
    }

    // Performance-based suggestions
    if (matchedSkills && matchedSkills.length > 0) {
      dynamicSuggestions.push({
        type: 'optimization',
        priority: 2,
        suggestion: `You have ${matchedSkills.length} matched skills. Emphasize these more prominently in your summary and experience sections`,
        impact: 'Reinforces your strongest qualifications',
        icon: Star,
        actionable: 'Move your top 3-5 skills to a prominent "Core Skills" section near the top'
      });
    }

    // Combine with original suggestions and remove duplicates
    const allSuggestions = [...dynamicSuggestions];
    
    if (suggestions && suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        if (!allSuggestions.some(ds => ds.suggestion.includes(suggestion.substring(0, 30)))) {
          allSuggestions.push({
            type: 'general',
            priority: 2,
            suggestion,
            impact: 'General improvement',
            icon: Lightbulb,
            actionable: 'Review and implement this recommendation'
          });
        }
      });
    }

    return allSuggestions.sort((a, b) => b.priority - a.priority).slice(0, 8);
  };

  const dynamicSuggestions = generateDynamicSuggestions();
  
  const getPriorityColor = (priority) => {
    if (priority >= 5) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (priority >= 4) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (priority >= 3) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const getImpactPotential = () => {
    if (!report) return 0;
    const { score } = report;
    if (score < 60) return Math.min(25, 100 - score);
    if (score < 80) return Math.min(15, 100 - score);
    return Math.min(10, 100 - score);
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <Card className={`${className} bg-[#0A0A0A] border-[#373737] h-[368px] flex flex-col`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#171717] rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#737373]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Smart Recommendations</CardTitle>
              <p className="text-[#737373] text-xs">AI-powered suggestions tailored to your resume</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-green-400">+{getImpactPotential()}</div>
            <div className="text-xs text-[#737373]">Potential Points</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-3 pr-2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {dynamicSuggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon || Lightbulb;
              const priorityColor = getPriorityColor(suggestion.priority);
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-[#171717] border border-[#262626] rounded-lg p-3 hover:shadow-md hover:border-[#373737] transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${priorityColor}`}>
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[#A3A3A3] leading-relaxed text-sm font-medium">
                        {suggestion.suggestion}
                      </p>
                      {suggestion.actionable && (
                        <p className="text-[#737373] text-xs leading-relaxed italic">
                          💡 {suggestion.actionable}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#525252] bg-[#262626] px-2 py-1 rounded">
                          {suggestion.impact}
                        </span>
                        <span className="text-xs text-[#737373] capitalize">
                          {suggestion.type} • Priority {suggestion.priority}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="flex-shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 text-[#737373]" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            variants={itemVariants}
            className="mt-4 p-3 bg-[#171717] rounded-lg border border-[#262626]"
          >
            <div className="flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-[#737373] mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1 text-sm">Performance Insight</h4>
                <p className="text-[#737373] text-xs leading-relaxed">
                  {report && report.score >= 80 
                    ? `Excellent work! Your resume is highly optimized. Focus on minor tweaks and keeping content fresh.`
                    : report && report.score >= 60 
                    ? `You're on the right track! Implementing top 3 suggestions could boost your score by ${getImpactPotential()} points.`
                    : `Your resume needs significant optimization. Start with critical suggestions first for maximum impact.`
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Wins */}
          {report && (
            <motion.div
              variants={itemVariants}
              className="mt-4"
            >
              <h4 className="font-medium text-white mb-2 flex items-center space-x-2 text-sm">
                <Award className="w-4 h-4 text-[#737373]" />
                <span>Quick Wins Checklist</span>
              </h4>
              <div className="space-y-1.5">
                <label className="flex items-start space-x-2.5 text-xs cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 rounded border-[#404040] bg-[#262626] text-[#737373] focus:ring-[#737373]"
                  />
                  <span className="text-[#737373] leading-relaxed">
                    Add {Math.min(5, (report.missingSkills?.length || 0))} missing keywords from job posting
                  </span>
                </label>
                <label className="flex items-start space-x-2.5 text-xs cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 rounded border-[#404040] bg-[#262626] text-[#737373] focus:ring-[#737373]"
                  />
                  <span className="text-[#737373] leading-relaxed">
                    Quantify 2-3 achievements with specific numbers or percentages
                  </span>
                </label>
                <label className="flex items-start space-x-2.5 text-xs cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 rounded border-[#404040] bg-[#262626] text-[#737373] focus:ring-[#737373]"
                  />
                  <span className="text-[#737373] leading-relaxed">
                    Ensure consistent formatting with clear section headers
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Suggestions;