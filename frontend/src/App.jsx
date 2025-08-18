import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Search, BarChart3, LogOut, User, Zap } from 'lucide-react';
import UploadForm from './components/upload/UploadForm';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import HomePage from './pages/HomePage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import useAuthStore from './store/authStore';

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

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return false;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-black shadow-lg border-b border-dark-500"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7">
        <div className="flex justify-between items-center h-14">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* <h1 className="text-xl font-bold text-accent-400">ATS Resume Checker</h1> */}
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.span 
              className="text-white border border-dark-400 px-2.5 py-1 rounded-full bg-dark-200/50 flex items-center space-x-1.5"
              whileHover={{ scale: 1.02, borderColor: "#A3A3A3" }}
              transition={{ duration: 0.2 }}
            >
              <User className="w-3.5 h-3.5" />
              <span className="text-sm">{user?.name || user?.email}</span>
            </motion.span>
            <nav className="flex space-x-2.5">
              <motion.a 
                href="/" 
                className={`text-white hover:text-accent-400 border border-dark-400 hover:border-accent-400 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-dark-200/30 hover:bg-dark-200/50 flex items-center space-x-1.5 relative overflow-hidden ${
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
                className={`text-white hover:text-accent-400 border border-dark-400 hover:border-accent-400 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-dark-200/30 hover:bg-dark-200/50 flex items-center space-x-1.5 relative overflow-hidden ${
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
                onClick={() => useAuthStore.getState().logout()}
                className="text-white hover:text-red-400 border border-dark-400 hover:border-red-400 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-dark-200/30 hover:bg-red-500/20 flex items-center space-x-1.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </motion.button>
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function App() {
  const { isAuthenticated, isLoading, initializeAuth, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-dark-600 border-t-accent-300 rounded-full"
        />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-dark-100">
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