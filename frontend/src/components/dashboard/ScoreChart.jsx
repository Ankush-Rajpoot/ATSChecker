import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const ScoreChart = ({ reports }) => {
  // Color functions matching StatsCards
  const getPercentageColor = (value) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-blue-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendColor = (isImproving, hasData) => {
    if (!hasData) return 'text-yellow-400';
    return isImproving ? 'text-green-400' : 'text-red-400';
  };

  const getReportsColor = (count) => {
    if (count >= 20) return 'text-green-400';
    if (count >= 10) return 'text-blue-400';
    if (count >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!reports || reports.length === 0) {
    return (
      <Card className="p-8 text-center bg-[#0A0A0A] border-[#171717]">
        <div className="w-16 h-16 bg-gradient-to-br from-[#262626] to-[#171717] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-[#737373]" />
        </div>
        <h3 className="text-lg font-semibold text-[#A3A3A3] mb-2">No Data Yet</h3>
        <p className="text-[#737373]">Complete more analyses to see your progress chart.</p>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = reports
    .sort((a, b) => new Date(a.analyzedAt) - new Date(b.analyzedAt)) // Sort by date ascending (oldest first)
    .slice(-10) // Last 10 reports
    .map((report, index) => ({
      name: `Report ${index + 1}`,
      score: report.score,
      date: new Date(report.analyzedAt).toLocaleDateString(),
      fileName: report.fileName
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0A0A0A] border border-[#404040] rounded-xl p-3 shadow-xl backdrop-blur-sm">
          {/* File name pill */}
          <div className="text-white border border-[#404040] px-2 py-1 rounded-full text-xs font-medium bg-[#171717]/50 flex items-center space-x-1 mb-2 w-fit">
            <span className="text-[#A3A3A3] truncate max-w-[200px]">{data.fileName}</span>
          </div>
          
          {/* Date pill */}
          <div className="text-white border border-[#404040] px-2 py-1 rounded-full text-xs bg-[#171717]/30 flex items-center space-x-1 mb-2 w-fit">
            <span className="text-[#737373]">{data.date}</span>
          </div>
          
          {/* Score pill with color coding */}
          <div className={`border border-[#404040] px-2 py-1 rounded-full text-xs font-semibold bg-[#171717]/30 flex items-center space-x-1 w-fit ${
            data.score >= 80 ? 'text-green-400' : 
            data.score >= 60 ? 'text-blue-400' : 
            data.score >= 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            <span>ATS Score: {data.score}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#0A0A0A] border-[#171717]">
      <CardHeader>
        <div className="flex flex-col items-start space-y-2 mb-4">
          {/* Progress Score with bordered icon inside - self-sizing with shimmer effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5 w-fit relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="border border-[#404040] rounded-full p-0.5 flex items-center justify-center relative z-10">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="relative z-10"> ATS Score Progress</span>
          </motion.div>
          
          {/* Description - self-sizing with shimmer effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer w-fit relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <span className="relative z-10">Track your ATS score improvements over time</span>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 bg-[#000000] rounded-xl p-4 border border-[#171717]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" className="opacity-50" />
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#737373' }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#737373' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#A3A3A3"
                strokeWidth={3}
                dot={{ 
                  fill: '#A3A3A3', 
                  strokeWidth: 2, 
                  stroke: '#373737',
                  r: 6 
                }}
                activeDot={{ 
                  r: 8, 
                  fill: '#A3A3A3',
                  stroke: '#373737',
                  strokeWidth: 3
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Chart insights - Navbar style with white icons and colors */}
        <div className="mt-6 flex flex-wrap gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5"
          >
            <div className="w-5 h-5 rounded-full bg-[#171717] flex items-center justify-center border border-[#404040]">
              <TrendingUp className="w-3 h-3 text-[#A3A3A3]" />
            </div>
            <span>Average Trend:</span>
            <span className={
              chartData.length > 1 
                ? getTrendColor(chartData[chartData.length - 1].score > chartData[0].score, true)
                : getTrendColor(false, false)
            }>
              {chartData.length > 1 
                ? `${chartData[chartData.length - 1].score > chartData[0].score ? 'Improving' : 'Declining'}`
                : 'Not enough data yet'
              }
            </span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5"
          >
            <div className="w-5 h-5 rounded-full bg-[#262626] flex items-center justify-center border border-[#525252]">
              <Award className="w-3 h-3 text-[#A3A3A3]" />
            </div>
            <span>Best Score:</span>
            <span className={getPercentageColor(Math.max(...chartData.map(d => d.score)))}>
              {Math.max(...chartData.map(d => d.score))}% personal best
            </span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5"
          >
            <div className="w-5 h-5 rounded-full bg-[#0A0A0A] flex items-center justify-center border border-[#404040]">
              <BarChart3 className="w-3 h-3 text-[#A3A3A3]" />
            </div>
            <span>Total Analyses:</span>
            <span className={getReportsColor(chartData.length)}>
              {chartData.length} reports completed
            </span>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreChart;