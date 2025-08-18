import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Search, BarChart3, LogOut, User, Zap, Menu, X } from 'lucide-react';
import UploadForm from './components/upload/UploadForm';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import HomePage from './pages/HomePage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import useAuthStore from './store/authStore';
import { AppLoadingSkeleton } from './components/skeletons';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function NavBar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return false;
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    setIsSidebarOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#000000] shadow-lg border-b border-[#171717] sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7">
          <div className="flex justify-between items-center h-14">
            {/* Logo/Brand */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h1 className="text-lg sm:text-xl font-bold text-accent-400">ATS Checker</h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.span 
                className="text-[#A3A3A3] border border-[#262626] px-2.5 py-1 rounded-full bg-[#171717]/50 flex items-center space-x-1.5 max-w-40"
                whileHover={{ scale: 1.02, borderColor: "#A3A3A3" }}
                transition={{ duration: 0.2 }}
              >
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm truncate">{user?.name || user?.email}</span>
              </motion.span>
              <nav className="flex space-x-2.5">
                <motion.a 
                  href="/" 
                  className={`text-[#A3A3A3] hover:text-accent-400 border border-[#262626] hover:border-accent-400 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#171717]/30 hover:bg-[#171717]/50 flex items-center space-x-1.5 relative overflow-hidden ${
                    isActive('/') ? 'border-accent-400 text-accent-400' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive('/') && (
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  )}
                  <Zap className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Analyze</span>
                </motion.a>
                <motion.a 
                  href="/dashboard" 
                  className={`text-[#A3A3A3] hover:text-accent-400 border border-[#262626] hover:border-accent-400 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#171717]/30 hover:bg-[#171717]/50 flex items-center space-x-1.5 relative overflow-hidden ${
                    isActive('/dashboard') ? 'border-accent-400 text-accent-400' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive('/dashboard') && (
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  )}
                  <BarChart3 className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Dashboard</span>
                </motion.a>
                <motion.button 
                  onClick={handleLogout}
                  className="text-[#A3A3A3] hover:text-red-400 border border-[#262626] hover:border-red-400 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#171717]/30 hover:bg-red-500/20 flex items-center space-x-1.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </motion.button>
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-[#A3A3A3] hover:text-accent-400 transition-colors rounded-lg hover:bg-[#171717]/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 bg-[#000000]/95 backdrop-blur-md border-r border-[#171717]/50 z-50 md:hidden"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#171717]/50">
              <h2 className="text-lg font-bold text-accent-400">ATS Checker</h2>
              <motion.button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-[#A3A3A3] hover:text-accent-400 transition-colors rounded-lg hover:bg-[#171717]/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-[#171717]/50">
              <div className="flex items-center space-x-3 px-3 py-3 bg-[#171717]/30 rounded-lg border border-[#262626]/50">
                <User className="w-5 h-5 text-accent-400 flex-shrink-0" />
                <div>
                  <div className="text-sm text-[#A3A3A3] font-medium truncate">{user?.name || 'User'}</div>
                  <div className="text-xs text-[#737373] truncate">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-3">
              <motion.a 
                href="/" 
                onClick={() => setIsSidebarOpen(false)}
                className={`text-[#A3A3A3] hover:text-accent-400 border border-[#262626] hover:border-accent-400 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-[#171717]/30 hover:bg-[#171717]/50 flex items-center space-x-2.5 relative overflow-hidden ${
                  isActive('/') ? 'border-accent-400 text-accent-400' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive('/') && (
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                )}
                <Zap className="w-4 h-4 flex-shrink-0 relative z-10" />
                <span className="relative z-10">Analyze Resume</span>
              </motion.a>
              
              <motion.a 
                href="/dashboard" 
                onClick={() => setIsSidebarOpen(false)}
                className={`text-[#A3A3A3] hover:text-accent-400 border border-[#262626] hover:border-accent-400 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-[#171717]/30 hover:bg-[#171717]/50 flex items-center space-x-2.5 relative overflow-hidden ${
                  isActive('/dashboard') ? 'border-accent-400 text-accent-400' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive('/dashboard') && (
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                )}
                <BarChart3 className="w-4 h-4 flex-shrink-0 relative z-10" />
                <span className="relative z-10">Dashboard</span>
              </motion.a>
            </div>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.button 
                onClick={handleLogout}
                className="text-[#A3A3A3] hover:text-red-400 border border-[#262626] hover:border-red-400 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-[#171717]/30 hover:bg-red-500/20 flex items-center space-x-2.5 w-full justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  const { isAuthenticated, isLoading, initializeAuth, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <AppLoadingSkeleton 
        type="default"
        message="Initializing ATS Checker..."
        showIcon={true}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#000000]">
          <AnimatePresence mode="wait">
            {isAuthenticated && <NavBar />}
          </AnimatePresence>

          <main className={isAuthenticated ? "py-8" : ""}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Google OAuth Callback Route */}
                <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
                
                {/* Public routes */}
                <Route 
                  path="/login" 
                  element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage type="login" />} 
                />
                <Route 
                  path="/register" 
                  element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage type="register" />} 
                />
                
                {/* Protected routes */}
                {isAuthenticated ? (
                  <>
                    <Route path="/" element={<UploadForm />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/results/:id" element={<ResultsPage />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" replace />} />
                )}
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;