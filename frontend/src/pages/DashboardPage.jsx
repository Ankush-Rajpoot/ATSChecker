import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Download, FileText, Calendar, Bell, Search, Filter } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import StatsAccordion from '../components/dashboard/StatsAccordion';
import RecentReports from '../components/dashboard/RecentReports';
import ScoreChart from '../components/dashboard/ScoreChart';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import useATSStore from '../store/atsStore';
import useAuthStore from '../store/authStore';
import { generateDashboardReportPDF } from '../utils/pdfUtils';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { reports, getStats, loadReports, loadStats } = useATSStore();
  const [isExporting, setIsExporting] = React.useState(false);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterBy, setFilterBy] = React.useState('all');
  const [isSearchActive, setIsSearchActive] = React.useState(false);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load reports and stats from backend
        await loadReports();
        const statsData = await loadStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to local stats if backend fails
        setStats(getStats());
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, loadReports, loadStats, getStats]);

  // Filter and search logic
  const filteredReports = React.useMemo(() => {
    if (!reports) return [];
    
    let filtered = [...reports];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(report =>
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply score filter
    if (filterBy === 'high') {
      filtered = filtered.filter(report => report.score >= 80);
    } else if (filterBy === 'medium') {
      filtered = filtered.filter(report => report.score >= 60 && report.score < 80);
    } else if (filterBy === 'low') {
      filtered = filtered.filter(report => report.score < 60);
    } else if (filterBy === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(report => new Date(report.analyzedAt) > oneWeekAgo);
    }
    
    // Sort by most recent
    return filtered.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));
  }, [reports, searchTerm, filterBy]);

  const getFilterColor = (filter) => {
    return filterBy === filter ? 'text-blue-400' : 'text-[#A3A3A3]';
  };

  const getFilterBorder = (filter) => {
    return filterBy === filter ? 'border-blue-400' : 'border-[#404040]';
  };

  const handleExportDashboard = async () => {
    if (!stats) return;
    
    setIsExporting(true);
    try {
      await generateDashboardReportPDF(stats, reports);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

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

  // Show loading skeleton while data is being fetched
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#000000] py-4 sm:py-6"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Enhanced Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col space-y-4 mb-6 sm:mb-8"
        >
          {/* Welcome Section - Mobile First */}
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-sm sm:text-base text-[#737373] mt-1">
              Track your ATS optimization progress
            </p>
          </div>
          
          {/* Action Buttons - Single Row */}
          <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center justify-center space-x-2 text-sm bg-[#000000] hover:bg-[#171717] text-[#A3A3A3] border-[#373737] flex-1 sm:flex-none"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden xs:inline">Notify</span>
              <span className="xs:hidden">Notify</span>
            </Button>
            
            <Button
              onClick={handleExportDashboard}
              disabled={!stats || isExporting}
              variant="outline"
              size="sm"
              className="inline-flex items-center justify-center space-x-2 text-sm bg-[#000000] hover:bg-[#171717] text-[#A3A3A3] border-[#373737] flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="sm"
              className="inline-flex items-center justify-center space-x-2 text-sm bg-[#000000] hover:bg-[#171717] text-[#A3A3A3] border-[#373737] flex-1 sm:flex-none"
            >
              <Link to="/">
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Analyze</span>
                <span className="xs:hidden">Analyze</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          {/* Desktop: Cards, Mobile: Accordion */}
          <div className="hidden sm:block">
            <StatsCards stats={stats} />
          </div>
          <div className="block sm:hidden">
            <StatsAccordion stats={stats} />
          </div>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div
          variants={itemVariants}
          className="mb-3 sm:mb-4"
        >
          <Card className="bg-[#0A0A0A] border-[#171717]">
            <CardContent className="p-2 sm:p-2.5 lg:p-3">
              <div className="flex flex-col space-y-2 sm:space-y-1.5">
                {/* Header Row - Mobile Stack */}
                <div className="flex flex-col space-y-2 sm:space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Quick Actions Title */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5 w-fit"
                    >
                      <div className="border border-[#404040] rounded-full p-0.5 flex items-center justify-center">
                        <Filter className="w-3.5 h-3.5" />
                      </div>
                      <span>Quick Actions</span>
                    </motion.div>

                    {/* Search Toggle - Mobile */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSearchActive(!isSearchActive)}
                      className={`border hover:border-[#A3A3A3] px-2 py-1.5 rounded-full transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5 ${
                        isSearchActive ? 'text-blue-400 border-blue-400' : 'text-white border-[#404040]'
                      }`}
                    >
                      <div className={`border rounded-full p-0.5 flex items-center justify-center ${
                        isSearchActive ? 'border-blue-400' : 'border-[#404040]'
                      }`}>
                        <Search className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs">Search</span>
                    </motion.div>
                  </div>
                  
                  {/* Last Updated - Mobile Responsive */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#737373] hover:text-[#A3A3A3] border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center space-x-1.5 w-fit sm:ml-auto"
                  >
                    <div className="border border-[#404040] rounded-full p-0.5 flex items-center justify-center">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <span>Last updated: 8/18/2025</span>
                  </motion.div>
                </div>

                {/* Search Input */}
                {isSearchActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search by filename..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#171717] border border-[#404040] rounded-full px-4 py-2 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-blue-400 transition-all duration-200"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  </motion.div>
                )}

                {/* Filter Pills - Mobile Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2">
                  {['all', 'high', 'medium', 'low', 'recent'].map((filter) => (
                    <motion.div
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterBy(filter)}
                      className={`hover:text-[#A3A3A3] border hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 cursor-pointer flex items-center justify-center text-center w-full lg:w-fit ${
                        getFilterColor(filter)} ${getFilterBorder(filter)}`}
                    >
                      <span className="capitalize truncate">
                        {filter === 'all' ? 'All' : 
                         filter === 'high' ? 'High (80%+)' :
                         filter === 'medium' ? 'Med (60-79%)' :
                         filter === 'low' ? 'Low (<60%)' :
                         'Recent (7d)'}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Results Count */}
                {(searchTerm || filterBy !== 'all') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
                  >
                    <motion.div
                      className="text-white border border-[#404040] px-2.5 py-1.5 rounded-full text-xs font-medium bg-[#0A0A0A]/30 flex items-center space-x-1.5 w-fit"
                    >
                      <span>Found {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}</span>
                    </motion.div>
                    
                    {(searchTerm || filterBy !== 'all') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchTerm('');
                          setFilterBy('all');
                          setIsSearchActive(false);
                        }}
                        className="text-[#737373] hover:text-white border border-[#404040] hover:border-[#A3A3A3] px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/50 w-fit"
                      >
                        Clear All
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid - Enhanced Mobile Layout */}
        <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
          {/* Chart and Recent Reports Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Chart - Full width on mobile */}
            <motion.div variants={itemVariants} className="lg:col-span-2 order-2 lg:order-1">
              <ScoreChart reports={filteredReports} />
            </motion.div>

            {/* Recent Reports - Full width on mobile, appears first */}
            <motion.div variants={itemVariants} className="lg:col-span-1 order-1 lg:order-2">
              <RecentReports reports={filteredReports?.slice(0, 5) || []} />
            </motion.div>
          </div>
        </div>

        {/* Enhanced Empty State */}
        {(!reports || reports.length === 0) && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 sm:py-16 px-4"
          >
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-[#262626] to-[#171717] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-[#373737]">
              <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-[#737373]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#A3A3A3] mb-3 sm:mb-4">
              Ready to optimize your first resume?
            </h3>
            <p className="text-[#737373] mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Upload your resume and job description to get instant ATS compatibility analysis and improvement suggestions.
            </p>
            <Button
              asChild
              size="lg"
              className="inline-flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl bg-[#262626] hover:bg-[#373737] text-[#A3A3A3] border-[#373737]"
            >
              <Link to="/">
                <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Analyze Your First Resume</span>
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardPage;