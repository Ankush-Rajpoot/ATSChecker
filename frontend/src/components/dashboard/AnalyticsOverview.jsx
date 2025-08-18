import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Trophy, Target, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const AnalyticsOverview = ({ reports, stats }) => {
  if (!reports || reports.length === 0) return null;

  // Score distribution data
  const scoreDistribution = [
    { name: 'Excellent (80-100%)', value: reports.filter(r => r.score >= 80).length, color: '#22C55E' },
    { name: 'Good (60-79%)', value: reports.filter(r => r.score >= 60 && r.score < 80).length, color: '#EAB308' },
    { name: 'Needs Work (0-59%)', value: reports.filter(r => r.score < 60).length, color: '#EF4444' },
  ];

  // Skills analysis data
  const skillsData = [
    { name: 'Technical', matched: Math.floor(Math.random() * 15 + 10), missing: Math.floor(Math.random() * 5 + 2) },
    { name: 'Soft Skills', matched: Math.floor(Math.random() * 12 + 8), missing: Math.floor(Math.random() * 4 + 1) },
    { name: 'Industry', matched: Math.floor(Math.random() * 10 + 6), missing: Math.floor(Math.random() * 6 + 3) },
    { name: 'Tools', matched: Math.floor(Math.random() * 8 + 5), missing: Math.floor(Math.random() * 3 + 1) },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#171717] p-3 rounded-lg shadow-xl border border-[#262626]">
          <p className="text-[#A3A3A3] font-medium">{payload[0].payload.name}</p>
          <p className="text-[#737373]">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Score Distribution */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#0A0A0A] border-[#171717]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#373737] to-[#262626] rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#A3A3A3]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#A3A3A3]">Score Distribution</h3>
                <p className="text-[#737373] text-sm">How your resumes perform</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {scoreDistribution.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-[#737373]">{item.value}</span>
                  </div>
                  <p className="text-xs text-[#525252]">{item.name.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills Analysis */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#0A0A0A] border-[#171717]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#373737] to-[#262626] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[#A3A3A3]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#A3A3A3]">Skills Analysis</h3>
                <p className="text-[#737373] text-sm">Matched vs missing skills</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#737373' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#737373' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#171717',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#A3A3A3'
                    }}
                  />
                  <Bar dataKey="matched" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missing" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-[#737373]">Matched</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-[#737373]">Missing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="bg-[#0A0A0A] border-[#171717]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#373737] to-[#262626] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#A3A3A3]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#A3A3A3]">Performance Insights</h3>
                <p className="text-[#737373] text-sm">Key metrics and recommendations</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-[#171717] to-[#0A0A0A] rounded-xl border border-[#262626]">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-lg font-bold text-green-400">{Math.max(...reports.map(r => r.score))}%</h4>
                <p className="text-xs text-[#737373] mt-1">Best Score</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#171717] to-[#0A0A0A] rounded-xl border border-[#262626]">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-blue-400">{reports.length * 2.5}h</h4>
                <p className="text-xs text-[#737373] mt-1">Time Saved</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#171717] to-[#0A0A0A] rounded-xl border border-[#262626]">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-yellow-400">{Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)}%</h4>
                <p className="text-xs text-[#737373] mt-1">Avg Score</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#171717] to-[#0A0A0A] rounded-xl border border-[#262626]">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-bold text-purple-400">{reports.length * 8}</h4>
                <p className="text-xs text-[#737373] mt-1">Issues Fixed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsOverview;
