const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  },
  extractedText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Job description must be at least 50 characters']
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  analysis: {
    matchedSkills: [{
      skill: String,
      confidence: Number,
      category: String
    }],
    missingSkills: [{
      skill: String,
      importance: Number,
      category: String
    }],
    keywordMatches: {
      total: Number,
      matched: Number,
      percentage: Number,
      details: [{
        keyword: String,
        found: Boolean,
        frequency: Number
      }]
    },
    sections: {
      formatting: {
        score: Number,
        feedback: String,
        issues: [String]
      },
      keywords: {
        score: Number,
        feedback: String,
        matchedCount: Number,
        totalCount: Number
      },
      experience: {
        score: Number,
        feedback: String,
        yearsFound: Number,
        relevantExperience: Boolean
      },
      education: {
        score: Number,
        feedback: String,
        degreeFound: Boolean,
        relevantDegree: Boolean
      },
      skills: {
        score: Number,
        feedback: String,
        technicalSkills: Number,
        softSkills: Number
      }
    },
    suggestions: {
      type: [{
        type: { type: String, required: true }, // 'keyword', 'skill', 'format', 'experience', 'education'
        priority: { type: Number, required: true }, // 1-5, 5 being highest
        suggestion: { type: String, required: true },
        impact: { type: String, required: true } // Expected improvement description
      }],
      default: []
    },
    readabilityScore: Number,
    atsCompatibilityScore: Number
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  error: {
    message: String,
    code: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Index for faster queries
reportSchema.index({ user: 1, createdAt: -1 });
reportSchema.index({ score: -1 });
reportSchema.index({ status: 1 });

// Virtual for analysis summary
reportSchema.virtual('summary').get(function() {
  if (!this.analysis) return null;
  
  return {
    totalSkills: this.analysis.matchedSkills.length + this.analysis.missingSkills.length,
    matchedSkillsCount: this.analysis.matchedSkills.length,
    missingSkillsCount: this.analysis.missingSkills.length,
    keywordMatchPercentage: this.analysis.keywordMatches?.percentage || 0,
    averageSectionScore: this.analysis.sections ? 
      Object.values(this.analysis.sections).reduce((acc, section) => acc + (section.score || 0), 0) / 
      Object.keys(this.analysis.sections).length : 0,
    highPrioritySuggestions: this.analysis.suggestions?.filter(s => s.priority >= 4).length || 0
  };
});

// Method to calculate improvement potential
reportSchema.methods.getImprovementPotential = function() {
  if (!this.analysis || !this.analysis.sections) return 0;
  
  const sections = this.analysis.sections;
  const currentAvg = Object.values(sections).reduce((acc, section) => acc + (section.score || 0), 0) / Object.keys(sections).length;
  const potential = Math.min(100, currentAvg + (this.analysis.suggestions?.length * 3 || 0));
  
  return Math.round(potential - currentAvg);
};

// Method to get report insights
reportSchema.methods.getInsights = function() {
  const insights = [];
  
  if (this.score >= 90) {
    insights.push({
      type: 'success',
      message: 'Excellent ATS compatibility! Your resume should pass most automated screenings.'
    });
  } else if (this.score >= 70) {
    insights.push({
      type: 'warning',
      message: 'Good ATS score with room for improvement. Consider implementing high-priority suggestions.'
    });
  } else {
    insights.push({
      type: 'error',
      message: 'Your resume may struggle with ATS systems. Significant improvements recommended.'
    });
  }
  
  // Add specific insights based on analysis
  if (this.analysis) {
    if (this.analysis.keywordMatches?.percentage < 40) {
      insights.push({
        type: 'warning',
        message: 'Low keyword match rate. Include more relevant terms from the job description.'
      });
    }
    
    if (this.analysis.missingSkills?.length > 5) {
      insights.push({
        type: 'info',
        message: `${this.analysis.missingSkills.length} skills missing. Consider adding relevant ones to your resume.`
      });
    }
  }
  
  return insights;
};

module.exports = mongoose.model('Report', reportSchema);
