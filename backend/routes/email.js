const express = require('express');
const authMiddleware = require('../middleware/auth');
const EmailService = require('../services/emailService');
const Report = require('../models/Report');

const router = express.Router();

// @desc    Send dashboard summary email
// @route   POST /api/email/dashboard-summary
// @access  Private
router.post('/dashboard-summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get dashboard stats
    const totalReports = await Report.countDocuments({ user: userId, status: 'completed' });
    
    if (totalReports === 0) {
      return res.status(400).json({
        success: false,
        message: 'No reports found to generate dashboard summary'
      });
    }
    
    const scoreStats = await Report.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' }
        }
      }
    ]);
    
    // Get recent reports
    const recentReports = await Report.find({
      user: userId,
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fileName score createdAt analysis.matchedSkills analysis.missingSkills analysis.suggestions')
      .lean();
    
    const dashboardData = {
      totalReports,
      averageScore: Math.round(scoreStats[0]?.avgScore || 0),
      highestScore: scoreStats[0]?.maxScore || 0,
      lowestScore: scoreStats[0]?.minScore || 0,
      recentReports: recentReports.map(report => ({
        id: report._id,
        fileName: report.fileName,
        score: report.score,
        analyzedAt: report.createdAt,
        matchedSkills: report.analysis?.matchedSkills || [],
        missingSkills: report.analysis?.missingSkills || [],
        suggestions: report.analysis?.suggestions || []
      }))
    };
    
    const emailResult = await EmailService.sendDashboardEmail(req.user, dashboardData);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Dashboard summary email sent successfully',
        data: {
          messageId: emailResult.messageId,
          previewUrl: emailResult.previewUrl
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send dashboard summary email',
        error: emailResult.error
      });
    }
    
  } catch (error) {
    console.error('Dashboard summary email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending dashboard summary email'
    });
  }
});

// @desc    Send test email
// @route   POST /api/email/test
// @access  Private
router.post('/test', authMiddleware, async (req, res) => {
  try {
    console.log('📧 === TEST EMAIL ENDPOINT CALLED ===');
    console.log('📧 User:', { id: req.user._id, email: req.user.email, name: req.user.name });
    console.log('📧 Environment variables check:');
    console.log('📧 ENABLE_EMAIL_NOTIFICATIONS:', process.env.ENABLE_EMAIL_NOTIFICATIONS);
    console.log('📧 EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('📧 EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('📧 EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? '***' + process.env.EMAIL_USER.slice(-4) : 'NOT SET');
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
    console.log('📧 EMAIL_FROM:', process.env.EMAIL_FROM);
    
    console.log('📧 Calling EmailService.sendTestEmail...');
    const emailResult = await EmailService.sendTestEmail(req.user.email);
    console.log('📧 Test email result:', emailResult);
    
    if (emailResult.success) {
      console.log('✅ Test email sent successfully');
      res.json({
        success: true,
        message: 'Test email sent successfully',
        data: {
          messageId: emailResult.messageId,
          previewUrl: emailResult.previewUrl
        }
      });
    } else {
      console.log('❌ Test email failed:', emailResult.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: emailResult.error
      });
    }
    
  } catch (error) {
    console.error('❌ Test email error:', error);
    console.error('❌ Test email error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error sending test email'
    });
  }
});

// @desc    Get email settings
// @route   GET /api/email/settings
// @access  Private
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        emailNotificationsEnabled: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
        userEmail: req.user.email,
        emailService: process.env.EMAIL_SERVICE || 'gmail',
        supportedServices: ['gmail', 'outlook', 'yahoo', 'smtp']
      }
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving email settings'
    });
  }
});

module.exports = router;
