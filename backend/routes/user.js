const express = require('express');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const User = require('../models/User');
const Report = require('../models/Report');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          usage: user.usage,
          isEmailVerified: user.isEmailVerified,
          joinedAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', authMiddleware, validate(schemas.updateProfile), async (req, res) => {
  try {
    const { name, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update basic fields
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    
    // Handle password change
    if (newPassword && currentPassword) {
      const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
      
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      user.password = newPassword; // Will be hashed by pre-save middleware
    }
    
    await user.save();
    
    // Return updated user (without password)
    const updatedUser = await User.findById(user._id);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          plan: updatedUser.plan,
          usage: updatedUser.usage,
          isEmailVerified: updatedUser.isEmailVerified,
          joinedAt: updatedUser.createdAt,
          lastLogin: updatedUser.lastLogin
        }
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @desc    Get user usage statistics
// @route   GET /api/user/usage
// @access  Private
router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Check and reset monthly usage if needed
    const wasReset = user.checkAndResetMonthlyUsage();
    if (wasReset) {
      await user.save();
    }
    
    // Get current month's reports
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const monthlyReports = await Report.countDocuments({
      user: user._id,
      createdAt: { $gte: currentMonth },
      status: 'completed'
    });
    
    // Get total reports
    const totalReports = await Report.countDocuments({
      user: user._id,
      status: 'completed'
    });
    
    res.json({
      success: true,
      data: {
        plan: user.plan,
        usage: {
          reportsGenerated: user.usage.reportsGenerated,
          monthlyLimit: user.usage.monthlyLimit,
          remaining: Math.max(0, user.usage.monthlyLimit - user.usage.reportsGenerated),
          percentage: Math.round((user.usage.reportsGenerated / user.usage.monthlyLimit) * 100),
          lastResetDate: user.usage.lastResetDate
        },
        statistics: {
          monthlyReports,
          totalReports,
          joinedAt: user.createdAt
        },
        planLimits: getPlanLimits(user.plan)
      }
    });
    
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving usage statistics'
    });
  }
});

// @desc    Upgrade user plan
// @route   POST /api/user/upgrade
// @access  Private
router.post('/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['free', 'premium', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Don't allow downgrade to free if user has exceeded free limits
    if (plan === 'free' && user.usage.reportsGenerated > 5) {
      return res.status(400).json({
        success: false,
        message: 'Cannot downgrade to free plan due to current usage'
      });
    }
    
    user.plan = plan;
    user.updatePlanLimits();
    await user.save();
    
    res.json({
      success: true,
      message: `Plan upgraded to ${plan} successfully`,
      data: {
        plan: user.plan,
        usage: user.usage,
        planLimits: getPlanLimits(user.plan)
      }
    });
    
  } catch (error) {
    console.error('Upgrade plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upgrading plan'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }
    
    // Delete all user reports
    await Report.deleteMany({ user: user._id });
    
    // Delete user account
    await User.findByIdAndDelete(user._id);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account'
    });
  }
});

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Get basic stats
    const totalReports = await Report.countDocuments({ 
      user: user._id, 
      status: 'completed' 
    });
    
    // Get recent reports
    const recentReports = await Report.find({
      user: user._id,
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fileName score createdAt analysis.matchedSkills analysis.missingSkills analysis.suggestions')
      .lean();
    
    // Calculate score statistics
    let scoreStats = { avgScore: 0, maxScore: 0, minScore: 0 };
    
    if (totalReports > 0) {
      const scores = await Report.aggregate([
        { $match: { user: user._id, status: 'completed' } },
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$score' },
            maxScore: { $max: '$score' },
            minScore: { $min: '$score' }
          }
        }
      ]);
      
      if (scores.length > 0) {
        scoreStats = scores[0];
      }
    }
    
    // Format recent reports
    const formattedRecentReports = recentReports.map(report => ({
      id: report._id,
      fileName: report.fileName,
      score: report.score,
      analyzedAt: report.createdAt,
      matchedSkills: report.analysis?.matchedSkills?.map(s => s.skill) || [],
      missingSkills: report.analysis?.missingSkills?.map(s => s.skill) || [],
      suggestions: report.analysis?.suggestions?.map(s => s.suggestion) || []
    }));
    
    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          plan: user.plan,
          usage: user.usage
        },
        statistics: {
          totalReports,
          averageScore: Math.round(scoreStats.avgScore || 0),
          highestScore: scoreStats.maxScore || 0,
          lowestScore: scoreStats.minScore || 0
        },
        recentReports: formattedRecentReports,
        planLimits: getPlanLimits(user.plan)
      }
    });
    
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data'
    });
  }
});

// Helper function to get plan limits
const getPlanLimits = (plan) => {
  const limits = {
    free: {
      monthlyReports: 5,
      features: ['Basic ATS Analysis', 'PDF Export', 'Email Support']
    },
    premium: {
      monthlyReports: 50,
      features: ['Advanced ATS Analysis', 'Detailed Suggestions', 'Priority Support', 'Multiple Resume Formats', 'Custom Branding']
    },
    enterprise: {
      monthlyReports: 1000,
      features: ['Enterprise ATS Analysis', 'API Access', 'Team Management', 'Custom Integrations', 'Dedicated Support']
    }
  };
  
  return limits[plan] || limits.free;
};

module.exports = router;
