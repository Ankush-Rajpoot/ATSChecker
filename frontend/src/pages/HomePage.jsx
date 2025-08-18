import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Users, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume Analysis",
      description: "Upload your resume and get detailed ATS compatibility analysis"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Score Tracking",
      description: "Track your resume improvements over time with detailed scoring"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Industry Standards",
      description: "Compare against current industry standards and best practices"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get immediate feedback and actionable suggestions for improvement"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            Beat the <span className="text-accent-400">ATS</span> System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-dark-700 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Optimize your resume for Applicant Tracking Systems and increase your chances of landing interviews
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 text-center"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 text-center"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-dark-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Why Choose Our ATS Checker?
            </h2>
            <p className="text-lg sm:text-xl text-dark-700 max-w-2xl mx-auto px-4">
              Our advanced algorithm analyzes your resume the same way ATS systems do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-dark-300 p-4 sm:p-6 rounded-lg border border-dark-500 hover:border-accent-500 transition-colors duration-200"
              >
                <div className="text-accent-400 mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-700 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
          >
            Ready to Optimize Your Resume?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-700 mb-6 sm:mb-8 px-4"
          >
            Join thousands of job seekers who have improved their resume's ATS compatibility
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 inline-block"
              >
                Start Your Free Analysis
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;