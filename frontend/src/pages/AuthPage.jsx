import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, FileText, Loader } from 'lucide-react';
import Lottie from 'lottie-react';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import GoogleIcon from '../components/ui/GoogleIcon';
import hireMeAnimation from '../assets/Hire Me.json';

const AuthPage = ({ type = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, googleAuth, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLogin = type === 'login';

  React.useEffect(() => {
    clearError();
    setIsTransitioning(true);
    
    // Check for error in URL params
    const urlParams = new URLSearchParams(location.search);
    const urlError = urlParams.get('error');
    if (urlError) {
      // Set error in store if it exists in URL
      console.error('URL Error:', urlError);
    }
    
    // Clear form when switching between login/signup
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    // Reset transition state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleAuth = () => {
    googleAuth();
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center py-4 sm:py-6 lg:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Lottie Animation - Positioned with overlap */}
      <div className="hidden lg:block absolute left-1/4 top-1/2 transform -translate-y-1/2 pointer-events-none z-0">
        <Lottie
          animationData={hireMeAnimation}
          loop={true}
          autoplay={true}
          className="w-80 xl:w-96 h-80 xl:h-96 opacity-60"
        />
      </div>
      
      {/* Form Content - Centered with higher z-index */}
      <div className="max-w-sm w-full space-y-4 sm:space-y-5 lg:space-y-6 relative z-10" style={{ perspective: "1200px" }}>
        <motion.div
          key={`header-${isLogin ? 'login' : 'signup'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div 
            className="flex justify-center mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
          </motion.div>
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-accent-400"
            key={`title-${isLogin ? 'login' : 'signup'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {isLogin ? 'Welcome back' : 'Create your account'}
          </motion.h2>
          <motion.p 
            className="mt-2 text-dark-700"
            key={`subtitle-${isLogin ? 'login' : 'signup'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* {isLogin 
              ? 'Sign in to access your ATS reports' 
              : 'Start optimizing your resume today'
            } */}
          </motion.p>
        </motion.div>

        <div className="relative" style={{ perspective: "1200px" }}>
          <motion.div
            animate={{ 
              rotateY: isLogin ? 0 : 180
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut"
            }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center center"
            }}
          >
            {/* Login Card - Front Side */}
            <motion.div
              style={{
                backfaceVisibility: "hidden",
                position: isLogin ? "relative" : "absolute",
                width: "100%",
                top: 0,
                left: 0
              }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-dark-400 backdrop-blur-sm bg-dark-200/90 transform-gpu">
                <CardContent className="p-4 sm:p-5 lg:p-6 pt-5 sm:pt-6 lg:pt-8">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLogin ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: isLogin ? 0.4 : 0 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <label htmlFor="email" className="block text-xs font-medium text-accent-400 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-700 pointer-events-none z-10" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 relative"
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <label htmlFor="password" className="block text-xs font-medium text-accent-400 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-700 pointer-events-none z-10" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10 relative"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-dark-700 hover:text-accent-400 transition-colors z-10 flex items-center justify-center w-5 h-5 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/50 rounded-lg p-3"
                      >
                        <p className="text-red-400 text-xs">{error}</p>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                        size="lg"
                        showArrow={true}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <span>Sign In</span>
                        )}
                      </Button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div 
                      className="relative my-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.45 }}
                    >
                      <div className="flex items-center">
                        <div className="flex-1 border-t border-dark-400"></div>
                        <span className="px-4 text-xs uppercase text-dark-700 font-medium">Or continue with</span>
                        <div className="flex-1 border-t border-dark-400"></div>
                      </div>
                    </motion.div>

                    {/* Google Auth Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-dark-400 rounded-lg shadow-sm bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <GoogleIcon className="w-5 h-5 mr-3" />
                        <span className="text-white font-medium">Sign in with Google</span>
                      </button>
                    </motion.div>

                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="text-dark-700 text-xs flex items-baseline justify-center gap-1">
                        <motion.span 
                          className="bg-gradient-to-r from-dark-700 via-accent-400 to-dark-700 bg-clip-text text-transparent leading-none"
                          animate={{
                            backgroundPosition: ['200% 50%', '-100% 50%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{
                            backgroundSize: '300% 100%',
                            backgroundImage: 'linear-gradient(90deg, #737373 0%, #737373 20%, #A3A3A3 40%, #D4D4D8 50%, #A3A3A3 60%, #737373 80%, #737373 100%)'
                          }}
                        >
                          Don't have an account?
                        </motion.span>
                        <Link
                          to="/register"
                          className="font-medium text-accent-300 hover:text-accent-400 transition-colors leading-none"
                        >
                          Sign up
                        </Link>
                      </div>
                    </motion.div>
                  </motion.form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Signup Card - Back Side */}
            <motion.div
              style={{
                backfaceVisibility: "hidden",
                position: !isLogin ? "relative" : "absolute",
                width: "100%",
                top: 0,
                left: 0,
                transform: "rotateY(180deg)"
              }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-dark-400 backdrop-blur-sm bg-dark-200/90 transform-gpu">
                <CardContent className="p-4 sm:p-5 lg:p-6 pt-5 sm:pt-6 lg:pt-8">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: !isLogin ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: !isLogin ? 0.4 : 0 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <label htmlFor="name" className="block text-xs font-medium text-accent-400 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-700 pointer-events-none z-10" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 relative"
                          placeholder="Enter your full name"
                          autoComplete="name"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <label htmlFor="signup-email" className="block text-xs font-medium text-accent-400 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-700 pointer-events-none z-10" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 relative"
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <label htmlFor="signup-password" className="block text-xs font-medium text-accent-400 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-700 pointer-events-none z-10" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10 relative"
                          placeholder="Enter your password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-dark-700 hover:text-accent-400 transition-colors z-10 flex items-center justify-center w-5 h-5 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-xs font-medium text-accent-400 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-700 pointer-events-none z-10" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required={!isLogin}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`pl-10 pr-10 relative ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                              : ''
                          }`}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-dark-700 hover:text-accent-400 transition-colors z-10 flex items-center justify-center w-5 h-5 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs text-red-400"
                        >
                          Passwords do not match
                        </motion.p>
                      )}
                    </motion.div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/50 rounded-lg p-3"
                      >
                        <p className="text-red-400 text-xs">{error}</p>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading || (formData.password !== formData.confirmPassword)}
                        className="w-full"
                        size="lg"
                        showArrow={true}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          <span>Create Account</span>
                        )}
                      </Button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div 
                      className="relative my-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.55 }}
                    >
                      <div className="flex items-center">
                        <div className="flex-1 border-t border-dark-400"></div>
                        <span className="px-4 text-xs uppercase text-dark-700 font-medium">Or continue with</span>
                        <div className="flex-1 border-t border-dark-400"></div>
                      </div>
                    </motion.div>

                    {/* Google Auth Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-dark-400 rounded-lg shadow-sm bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <GoogleIcon className="w-5 h-5 mr-3" />
                        <span className="text-white font-medium">Sign up with Google</span>
                      </button>
                    </motion.div>

                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.65 }}
                    >
                      <div className="text-dark-700 text-xs flex items-baseline justify-center gap-1">
                        <motion.span 
                          className="bg-gradient-to-r from-dark-700 via-accent-400 to-dark-700 bg-clip-text text-transparent leading-none"
                          animate={{
                            backgroundPosition: ['200% 50%', '-100% 50%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{
                            backgroundSize: '300% 100%',
                            backgroundImage: 'linear-gradient(90deg, #737373 0%, #737373 20%, #A3A3A3 40%, #D4D4D8 50%, #A3A3A3 60%, #737373 80%, #737373 100%)'
                          }}
                        >
                          Already have an account?
                        </motion.span>
                        <Link
                          to="/login"
                          className="font-medium text-accent-300 hover:text-accent-400 transition-colors leading-none"
                        >
                          Sign in
                        </Link>
                      </div>
                    </motion.div>
                  </motion.form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-sm text-dark-700"
        >
          <p>✓ Free ATS analysis • ✓ Instant results • ✓ Detailed feedback</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;