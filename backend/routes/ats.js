const express = require('express');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const Report = require('../models/Report');
const User = require('../models/User');
const { analyzeResume } = require('../utils/atsAnalyzer');
const { extractText } = require('../utils/fileProcessorCloudinary');
const path = require('path');

const router = express.Router();

// @desc    Analyze resume against job description
// @route   POST /api/ats/analyze
// @access  Private
router.post('/analyze', authMiddleware, validate(schemas.analyzeResume), async (req, res) => {
  try {
    console.log('🔍 ATS Analyze - Request received from user:', req.user.email);
    console.log('🔍 ATS Analyze - Request body keys:', Object.keys(req.body));
    
    const { 
      jobDescription, 
      fileId, 
      fileName, 
      extractedText, 
      cloudinaryPublicId, 
      cloudinaryUrl,
      fileSize,
      fileType 
    } = req.body;
    const userId = req.user._id;
    
    // Debug job description early
    console.log('🔍 Job Description Debug:', {
      jobDescriptionExists: !!jobDescription,
      jobDescriptionType: typeof jobDescription,
      jobDescriptionLength: jobDescription?.length,
      jobDescriptionPreview: jobDescription?.substring(0, 100),
      isUndefined: jobDescription === undefined,
      isNull: jobDescription === null,
      isEmptyString: jobDescription === '',
      startsWithUndefined: jobDescription?.startsWith('undefined')
    });
    
    // Check if user can generate more reports
    if (!req.user.canGenerateReport()) {
      return res.status(403).json({
        success: false,
        message: 'Monthly report limit reached. Please upgrade your plan or wait for next month.',
        data: {
          currentUsage: req.user.usage.reportsGenerated,
          monthlyLimit: req.user.usage.monthlyLimit,
          plan: req.user.plan
        }
      });
    }
    
    // Validate required fields
    if (!extractedText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume text and job description are required'
      });
    }
    
    console.log(`Starting ATS analysis for user ${userId}`);
    
    // Create initial report record without analysis
    const report = new Report({
      user: userId,
      fileName: fileName || 'Uploaded Resume',
      originalName: fileName || 'resume.txt',
      filePath: cloudinaryUrl || (fileId ? path.join('uploads', fileId) : ''),
      cloudinaryPublicId: cloudinaryPublicId || '',
      cloudinaryUrl: cloudinaryUrl || '',
      fileSize: fileSize || extractedText.length,
      fileType: fileType || 'text/plain',
      extractedText,
      jobDescription,
      score: 0,
      status: 'processing'
      // Don't set analysis field here - will add it after analysis is complete
    });
    
    // Debug job description before saving
    console.log('🔍 Job Description before saving report:', {
      originalJobDesc: jobDescription,
      reportJobDesc: report.jobDescription,
      areEqual: jobDescription === report.jobDescription,
      reportJobDescType: typeof report.jobDescription,
      reportJobDescLength: report.jobDescription?.length
    });
    
    await report.save();
    
    // Debug job description after saving
    console.log('🔍 Job Description after saving report:', {
      reportJobDesc: report.jobDescription,
      reportJobDescType: typeof report.jobDescription,
      reportJobDescLength: report.jobDescription?.length,
      reportJobDescPreview: report.jobDescription?.substring(0, 100)
    });
    
    try {
      // Perform ATS analysis
      const analysisResult = await analyzeResume(extractedText, jobDescription);
      
      console.log('🔍 Analysis result structure:', {
        score: analysisResult.score,
        analysisKeys: Object.keys(analysisResult.analysis),
        suggestionsType: typeof analysisResult.analysis.suggestions,
        suggestionsLength: analysisResult.analysis.suggestions?.length,
        firstSuggestion: analysisResult.analysis.suggestions?.[0],
        suggestionsArray: JSON.stringify(analysisResult.analysis.suggestions, null, 2)
      });
      
      // Update report with analysis results
      report.score = analysisResult.score;
      
      // Ensure suggestions are properly formatted as objects, not strings
      const formattedAnalysis = { ...analysisResult.analysis };
      if (formattedAnalysis.suggestions && typeof formattedAnalysis.suggestions === 'string') {
        try {
          formattedAnalysis.suggestions = JSON.parse(formattedAnalysis.suggestions);
        } catch (parseError) {
          console.error('Failed to parse suggestions:', parseError);
          formattedAnalysis.suggestions = [];
        }
      }
      
      // Debug the formatted analysis before saving
      console.log('🔍 Formatted analysis before save:', {
        suggestionsType: typeof formattedAnalysis.suggestions,
        suggestionsLength: formattedAnalysis.suggestions?.length,
        isArray: Array.isArray(formattedAnalysis.suggestions),
        firstFormatted: formattedAnalysis.suggestions?.[0]
      });
      
      // Update report with analysis results
      report.score = analysisResult.score;
      report.processingTime = analysisResult.processingTime;
      report.status = 'completed';
      
      // Create a clean analysis object to avoid any serialization issues
      const cleanAnalysis = {
        matchedSkills: formattedAnalysis.matchedSkills || [],
        missingSkills: formattedAnalysis.missingSkills || [],
        keywordMatches: formattedAnalysis.keywordMatches || {},
        sections: formattedAnalysis.sections || {},
        suggestions: formattedAnalysis.suggestions || [],
        readabilityScore: formattedAnalysis.readabilityScore || 0,
        atsCompatibilityScore: formattedAnalysis.atsCompatibilityScore || 0
      };
      
      console.log('🔍 Clean analysis object:', {
        suggestionsLength: cleanAnalysis.suggestions.length,
        suggestionsType: typeof cleanAnalysis.suggestions,
        isArray: Array.isArray(cleanAnalysis.suggestions),
        firstSuggestion: cleanAnalysis.suggestions[0]
      });
      
      // Set the entire analysis object at once
      report.analysis = cleanAnalysis;
      
      await report.save();
      
      // Update user usage
      req.user.usage.reportsGenerated += 1;
      await req.user.save();
      
      console.log(`Analysis completed for report ${report._id} with score ${analysisResult.score}`);
      
      // Return complete analysis
      res.json({
        success: true,
        message: 'Resume analysis completed successfully',
        data: {
          reportId: report._id,
          score: report.score,
          fileName: report.fileName,
          analyzedAt: report.createdAt,
          matchedSkills: analysisResult.analysis.matchedSkills.map(s => s.skill),
          missingSkills: analysisResult.analysis.missingSkills.map(s => s.skill),
          suggestions: analysisResult.analysis.suggestions.map(s => s.suggestion),
          sections: analysisResult.analysis.sections,
          processingTime: analysisResult.processingTime,
          summary: report.summary,
          insights: report.getInsights(),
          improvementPotential: report.getImprovementPotential()
        }
      });
      
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      
      // Update report with error
      report.status = 'failed';
      report.error = {
        message: analysisError.message,
        code: 'ANALYSIS_ERROR'
      };
      await report.save();
      
      throw analysisError;
    }
    
  } catch (error) {
    console.error('ATS analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during resume analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get all reports for authenticated user
// @route   GET /api/ats/reports
// @access  Private
router.get('/reports', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    if (status) query.status = status;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const reports = await Report.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-extractedText -jobDescription') // Exclude large text fields
      .lean();
    
    // Get total count for pagination
    const total = await Report.countDocuments(query);
    
    // Add summary data to each report
    const reportsWithSummary = reports.map(report => ({
      ...report,
      summary: {
        totalSkills: (report.analysis?.matchedSkills?.length || 0) + (report.analysis?.missingSkills?.length || 0),
        matchedSkillsCount: report.analysis?.matchedSkills?.length || 0,
        missingSkillsCount: report.analysis?.missingSkills?.length || 0,
        keywordMatchPercentage: report.analysis?.keywordMatches?.percentage || 0,
        suggestionCount: report.analysis?.suggestions?.length || 0
      }
    }));
    
    res.json({
      success: true,
      data: {
        reports: reportsWithSummary,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reports'
    });
  }
});

// @desc    Get specific report by ID
// @route   GET /api/ats/reports/:id
// @access  Private
router.get('/reports/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Debug job description from database
    console.log('🔍 Job Description from DB:', {
      reportId: report._id,
      jobDescExists: !!report.jobDescription,
      jobDescType: typeof report.jobDescription,
      jobDescLength: report.jobDescription?.length,
      jobDescPreview: report.jobDescription?.substring(0, 100),
      jobDescFull: report.jobDescription,
      isUndefined: report.jobDescription === undefined,
      isNull: report.jobDescription === null,
      startsWithUndefined: report.jobDescription?.startsWith('undefined')
    });
    
    const responseData = {
      ...report.toObject(),
      summary: report.summary,
      insights: report.getInsights(),
      improvementPotential: report.getImprovementPotential()
    };
    
    // Debug response data
    console.log('🔍 Response Job Description:', {
      responseJobDesc: responseData.jobDescription,
      responseJobDescType: typeof responseData.jobDescription,
      responseJobDescLength: responseData.jobDescription?.length,
      responseJobDescPreview: responseData.jobDescription?.substring(0, 100)
    });
    
    res.json({
      success: true,
      data: {
        report: responseData
      }
    });
    
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving report'
    });
  }
});

// @desc    Delete report
// @route   DELETE /api/ats/reports/:id
// @access  Private
router.delete('/reports/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Delete file from Cloudinary if exists
    if (report.cloudinaryPublicId) {
      try {
        const { deleteFromCloudinary } = require('../config/cloudinary');
        await deleteFromCloudinary(report.cloudinaryPublicId);
        console.log(`Deleted file from Cloudinary: ${report.cloudinaryPublicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with report deletion even if Cloudinary deletion fails
      }
    }
    
    await Report.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting report'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/ats/stats
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get basic stats
    const totalReports = await Report.countDocuments({ user: userId, status: 'completed' });
    
    if (totalReports === 0) {
      return res.json({
        success: true,
        data: {
          totalReports: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          recentReports: [],
          usage: req.user.usage
        }
      });
    }
    
    // Get score statistics
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
    
    const stats = scoreStats[0] || { avgScore: 0, maxScore: 0, minScore: 0 };
    
    res.json({
      success: true,
      data: {
        totalReports,
        averageScore: Math.round(stats.avgScore),
        highestScore: stats.maxScore,
        lowestScore: stats.minScore,
        recentReports: formattedRecentReports,
        usage: req.user.usage,
        plan: req.user.plan
      }
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics'
    });
  }
});

// @desc    Update report (add notes, tags, etc.)
// @route   PUT /api/ats/reports/:id
// @access  Private
router.put('/reports/:id', authMiddleware, async (req, res) => {
  try {
    const { notes, tags, isPublic } = req.body;
    
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Update allowed fields
    if (notes !== undefined) report.notes = notes;
    if (tags !== undefined) report.tags = tags;
    if (isPublic !== undefined) report.isPublic = isPublic;
    
    await report.save();
    
    res.json({
      success: true,
      message: 'Report updated successfully',
      data: { report }
    });
    
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report'
    });
  }
});

module.exports = router;
