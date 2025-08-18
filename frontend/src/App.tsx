// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import UploadForm from './components/upload/UploadForm';
// import AuthPage from './pages/AuthPage';
// import DashboardPage from './pages/DashboardPage';
// import ResultsPage from './pages/ResultsPage';
// import HomePage from './pages/HomePage';
// import GoogleCallbackPage from './pages/GoogleCallbackPage';
// // @ts-ignore - JavaScript module
// import useAuthStore from './store/authStore';

// function App() {
//   const { isAuthenticated, isLoading, initializeAuth, user } = useAuthStore();

//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-dark-100">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-8 h-8 border-2 border-dark-600 border-t-accent-300 rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-dark-100">
//         <AnimatePresence mode="wait">
//           {isAuthenticated && (
//             <motion.header
//               initial={{ y: -100, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -100, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-dark-200 shadow-sm border-b border-dark-500"
//             >
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                   <motion.div 
//                     className="flex items-center"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <h1 className="text-xl font-bold text-accent-400">ATS Resume Checker</h1>
//                   </motion.div>
//                   <div className="flex items-center space-x-4">
//                     <span className="text-dark-700">Welcome, {user?.name || user?.email}</span>
//                     <nav className="flex space-x-4">
//                       <motion.a 
//                         href="/" 
//                         className="text-dark-700 hover:text-accent-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         Analyze
//                       </motion.a>
//                       <motion.a 
//                         href="/dashboard" 
//                         className="text-dark-700 hover:text-accent-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         Dashboard
//                       </motion.a>
//                       <motion.button 
//                         onClick={() => useAuthStore.getState().logout()}
//                         className="text-dark-700 hover:text-accent-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         Logout
//                       </motion.button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             </motion.header>
//           )}
//         </AnimatePresence>

//         <main className={isAuthenticated ? "py-8" : ""}>
//           <AnimatePresence mode="wait">
//             <Routes>
//               {/* Google OAuth Callback Route */}
//               <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
              
//               {/* Public routes */}
//               <Route 
//                 path="/login" 
//                 element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage type="login" />} 
//               />
//               <Route 
//                 path="/register" 
//                 element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage type="register" />} 
//               />
              
//               {/* Protected routes */}
//               {isAuthenticated ? (
//                 <>
//                   <Route path="/" element={<UploadForm />} />
//                   <Route path="/dashboard" element={<DashboardPage />} />
//                   <Route path="/results" element={<ResultsPage />} />
//                   <Route path="/results/:id" element={<ResultsPage />} />
//                 </>
//               ) : (
//                 <Route path="*" element={<Navigate to="/login" replace />} />
//               )}
//             </Routes>
//           </AnimatePresence>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
