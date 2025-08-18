const natural = require('natural');
const compromise = require('compromise');

/**
 * Main ATS analysis function
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description text
 * @returns {Object} - Complete analysis results
 */
const analyzeResume = async (resumeText, jobDescription) => {
  const startTime = Date.now();
  
  try {
    // Preprocess texts
    const processedResume = preprocessText(resumeText);
    const processedJob = preprocessText(jobDescription);
    
    // Extract keywords and skills
    const resumeKeywords = extractKeywords(processedResume);
    const jobKeywords = extractKeywords(processedJob);
    const resumeSkills = extractSkills(processedResume);
    const jobSkills = extractSkills(processedJob);
    
    // Perform keyword matching
    const keywordAnalysis = analyzeKeywordMatching(resumeKeywords, jobKeywords);
    
    // Perform skills analysis
    const skillsAnalysis = analyzeSkills(resumeSkills, jobSkills);
    
    // Analyze resume sections
    const sectionsAnalysis = analyzeSections(resumeText, jobDescription);
    
    // Generate suggestions
    const suggestions = generateSuggestions(keywordAnalysis, skillsAnalysis, sectionsAnalysis);
    
    // Calculate overall score
    const score = calculateOverallScore(keywordAnalysis, skillsAnalysis, sectionsAnalysis);
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;
    
    return {
      score,
      analysis: {
        matchedSkills: skillsAnalysis.matched,
        missingSkills: skillsAnalysis.missing,
        keywordMatches: keywordAnalysis,
        sections: sectionsAnalysis,
        suggestions,
        readabilityScore: calculateReadabilityScore(resumeText),
        atsCompatibilityScore: calculateATSCompatibilityScore(resumeText)
      },
      processingTime
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};

/**
 * Preprocess text for analysis
 */
const preprocessText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extract keywords using TF-IDF
 */
const extractKeywords = (text) => {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  
  // Add the text to TF-IDF
  tfidf.addDocument(text);
  
  // Get terms with their scores
  const keywords = [];
  tfidf.listTerms(0).forEach(item => {
    if (item.term.length > 2 && item.tfidf > 0.1) {
      keywords.push({
        term: item.term,
        score: item.tfidf,
        frequency: (text.match(new RegExp(item.term, 'g')) || []).length
      });
    }
  });
  
  return keywords.sort((a, b) => b.score - a.score).slice(0, 50);
};

/**
 * Extract skills from text
 */
const extractSkills = (text) => {
  const technicalSkills = [
    // Programming languages
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
    'typescript', 'go', 'rust', 'scala', 'r', 'matlab', 'perl',
    
    // Web technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
    'flask', 'spring', 'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap',
    'sass', 'less', 'webpack', 'gulp', 'grunt',
    
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
    'oracle', 'sql server', 'cassandra', 'dynamodb',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab',
    'github', 'terraform', 'ansible', 'chef', 'puppet', 'nagios',
    
    // Tools & Platforms
    'git', 'svn', 'jira', 'confluence', 'slack', 'trello', 'asana',
    'visual studio', 'intellij', 'eclipse', 'sublime', 'atom',
    
    // Testing
    'jest', 'mocha', 'jasmine', 'selenium', 'cypress', 'junit', 'pytest',
    
    // Mobile
    'android', 'ios', 'react native', 'flutter', 'xamarin',
    
    // Data Science & AI
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'tableau', 'power bi', 'spark', 'hadoop'
  ];
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'project management', 'analytical', 'creative', 'innovative',
    'collaborative', 'adaptable', 'flexible', 'detail oriented', 'organized',
    'multitasking', 'decision making', 'conflict resolution', 'mentoring'
  ];
  
  const foundSkills = [];
  
  // Check for technical skills
  technicalSkills.forEach(skill => {
    const regex = new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    if (matches) {
      foundSkills.push({
        skill: skill,
        category: 'technical',
        frequency: matches.length,
        confidence: Math.min(matches.length * 0.3, 1)
      });
    }
  });
  
  // Check for soft skills
  softSkills.forEach(skill => {
    const regex = new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    if (matches) {
      foundSkills.push({
        skill: skill,
        category: 'soft',
        frequency: matches.length,
        confidence: Math.min(matches.length * 0.2, 1)
      });
    }
  });
  
  return foundSkills.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Analyze keyword matching between resume and job description
 */
const analyzeKeywordMatching = (resumeKeywords, jobKeywords) => {
  const matchedKeywords = [];
  const resumeTerms = resumeKeywords.map(k => k.term);
  
  let totalMatches = 0;
  let totalKeywords = jobKeywords.length;
  
  jobKeywords.forEach(jobKeyword => {
    const match = resumeTerms.find(term => 
      term === jobKeyword.term || 
      natural.JaroWinklerDistance(term, jobKeyword.term) > 0.8
    );
    
    const isMatched = !!match;
    if (isMatched) totalMatches++;
    
    matchedKeywords.push({
      keyword: jobKeyword.term,
      found: isMatched,
      frequency: isMatched ? resumeKeywords.find(k => k.term === match).frequency : 0,
      importance: jobKeyword.score
    });
  });
  
  return {
    total: totalKeywords,
    matched: totalMatches,
    percentage: totalKeywords > 0 ? Math.round((totalMatches / totalKeywords) * 100) : 0,
    details: matchedKeywords.sort((a, b) => b.importance - a.importance)
  };
};

/**
 * Analyze skills matching
 */
const analyzeSkills = (resumeSkills, jobSkills) => {
  const matched = [];
  const missing = [];
  
  const resumeSkillNames = resumeSkills.map(s => s.skill.toLowerCase());
  
  // Find matched skills
  resumeSkills.forEach(skill => {
    const jobMatch = jobSkills.find(js => 
      js.skill.toLowerCase() === skill.skill.toLowerCase() ||
      natural.JaroWinklerDistance(js.skill.toLowerCase(), skill.skill.toLowerCase()) > 0.8
    );
    
    if (jobMatch) {
      matched.push({
        skill: skill.skill,
        confidence: skill.confidence,
        category: skill.category
      });
    }
  });
  
  // Find missing skills
  jobSkills.forEach(skill => {
    const resumeMatch = resumeSkillNames.find(rs => 
      rs === skill.skill.toLowerCase() ||
      natural.JaroWinklerDistance(rs, skill.skill.toLowerCase()) > 0.8
    );
    
    if (!resumeMatch) {
      missing.push({
        skill: skill.skill,
        importance: skill.confidence,
        category: skill.category
      });
    }
  });
  
  return {
    matched: matched.slice(0, 15), // Limit to top 15
    missing: missing.slice(0, 10)  // Limit to top 10
  };
};

/**
 * Analyze resume sections
 */
const analyzeSections = (resumeText, jobDescription) => {
  const sections = {
    formatting: analyzeFormatting(resumeText),
    keywords: analyzeKeywordDensity(resumeText, jobDescription),
    experience: analyzeExperience(resumeText),
    education: analyzeEducation(resumeText),
    skills: analyzeSkillsSection(resumeText)
  };
  
  return sections;
};

const analyzeFormatting = (text) => {
  let score = 80; // Start with base score
  const issues = [];
  
  // Check for proper structure
  const hasHeaders = /^[A-Z\s]+$/m.test(text);
  if (!hasHeaders) {
    score -= 10;
    issues.push('Consider using clear section headers');
  }
  
  // Check for bullet points or structured content
  const hasBullets = /[•\-\*]/.test(text);
  if (!hasBullets) {
    score -= 10;
    issues.push('Use bullet points for better readability');
  }
  
  // Check length
  if (text.length < 1000) {
    score -= 15;
    issues.push('Resume appears too short');
  } else if (text.length > 4000) {
    score -= 5;
    issues.push('Resume might be too long');
  }
  
  return {
    score: Math.max(score, 0),
    feedback: issues.length === 0 ? 'Good formatting and structure' : 'Formatting could be improved',
    issues
  };
};

const analyzeKeywordDensity = (resumeText, jobDescription) => {
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);
  
  // Get important job keywords (excluding common words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const jobKeywords = [...new Set(jobWords.filter(word => 
    word.length > 3 && !stopWords.has(word)
  ))];
  
  let matchedCount = 0;
  jobKeywords.forEach(keyword => {
    if (resumeWords.includes(keyword)) {
      matchedCount++;
    }
  });
  
  const percentage = jobKeywords.length > 0 ? (matchedCount / jobKeywords.length) * 100 : 0;
  let score = Math.min(percentage * 1.2, 100);
  
  return {
    score: Math.round(score),
    feedback: score > 70 ? 'Good keyword optimization' : 'Consider including more relevant keywords',
    matchedCount,
    totalCount: jobKeywords.length
  };
};

const analyzeExperience = (text) => {
  let score = 70;
  let yearsFound = 0;
  let relevantExperience = false;
  
  // Look for years of experience
  const yearPatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /(\d+)\+?\s*yrs?\s*(?:of\s*)?(?:experience|exp)/gi
  ];
  
  yearPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const years = parseInt(match.match(/\d+/)[0]);
        yearsFound = Math.max(yearsFound, years);
      });
    }
  });
  
  if (yearsFound > 0) {
    score += Math.min(yearsFound * 5, 25);
    relevantExperience = true;
  }
  
  // Look for quantified achievements
  const quantifiedAchievements = text.match(/\d+%|increased|improved|reduced|grew|generated|\$\d+/gi);
  if (quantifiedAchievements && quantifiedAchievements.length > 3) {
    score += 15;
  }
  
  return {
    score: Math.min(score, 100),
    feedback: relevantExperience ? 'Strong experience section with quantifiable achievements' : 'Consider adding more specific experience details',
    yearsFound,
    relevantExperience
  };
};

const analyzeEducation = (text) => {
  let score = 60;
  let degreeFound = false;
  let relevantDegree = false;
  
  const degreePatterns = [
    /bachelor|ba|bs|bsc|beng/gi,
    /master|ma|ms|msc|mba|meng/gi,
    /phd|doctorate|doctoral/gi,
    /associate|diploma|certificate/gi
  ];
  
  degreePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      degreeFound = true;
      score += 20;
    }
  });
  
  // Look for relevant fields
  const relevantFields = [
    'computer science', 'engineering', 'information technology',
    'software', 'business', 'management', 'marketing'
  ];
  
  relevantFields.forEach(field => {
    if (text.toLowerCase().includes(field)) {
      relevantDegree = true;
      score += 15;
    }
  });
  
  return {
    score: Math.min(score, 100),
    feedback: degreeFound ? 'Education section present' : 'Consider adding education details',
    degreeFound,
    relevantDegree
  };
};

const analyzeSkillsSection = (text) => {
  const doc = compromise(text);
  const skills = doc.match('#Skill').out('array');
  
  let technicalSkills = 0;
  let softSkills = 0;
  
  // Count different types of skills
  const techKeywords = ['programming', 'software', 'technical', 'coding', 'development'];
  const softKeywords = ['communication', 'leadership', 'teamwork', 'management'];
  
  techKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) technicalSkills++;
  });
  
  softKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) softSkills++;
  });
  
  const totalSkills = technicalSkills + softSkills;
  let score = Math.min(totalSkills * 10, 100);
  
  return {
    score,
    feedback: totalSkills > 5 ? 'Good mix of technical and soft skills' : 'Consider adding more relevant skills',
    technicalSkills,
    softSkills
  };
};

/**
 * Generate improvement suggestions
 */
const generateSuggestions = (keywordAnalysis, skillsAnalysis, sectionsAnalysis) => {
  const suggestions = [];
  
  // Keyword suggestions
  if (keywordAnalysis.percentage < 40) {
    suggestions.push({
      type: 'keyword',
      priority: 5,
      suggestion: 'Include more keywords from the job description to improve ATS compatibility',
      impact: 'Could increase score by 10-15 points'
    });
  }
  
  // Skills suggestions
  if (skillsAnalysis.missing.length > 3) {
    const topMissing = skillsAnalysis.missing.slice(0, 3).map(s => s.skill).join(', ');
    suggestions.push({
      type: 'skill',
      priority: 4,
      suggestion: `Consider adding experience with: ${topMissing}`,
      impact: 'Could improve skill matching significantly'
    });
  }
  
  // Section-specific suggestions
  Object.entries(sectionsAnalysis).forEach(([section, analysis]) => {
    if (analysis.score < 70) {
      let suggestionText = '';
      let priority = 3;
      
      switch (section) {
        case 'formatting':
          suggestionText = 'Improve resume formatting with clear headers and bullet points';
          break;
        case 'keywords':
          suggestionText = 'Increase keyword density by incorporating more job-specific terms';
          priority = 4;
          break;
        case 'experience':
          suggestionText = 'Add more quantified achievements and specific experience details';
          break;
        case 'education':
          suggestionText = 'Include relevant education and certifications';
          break;
        case 'skills':
          suggestionText = 'Expand skills section with both technical and soft skills';
          break;
      }
      
      if (suggestionText) {
        suggestions.push({
          type: section,
          priority,
          suggestion: suggestionText,
          impact: 'Will improve section scoring'
        });
      }
    }
  });
  
  return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 8);
};

/**
 * Calculate overall ATS score
 */
const calculateOverallScore = (keywordAnalysis, skillsAnalysis, sectionsAnalysis) => {
  const weights = {
    keywords: 0.3,
    skills: 0.25,
    sections: 0.45
  };
  
  // Calculate keyword score
  const keywordScore = keywordAnalysis.percentage;
  
  // Calculate skills score
  const skillsScore = skillsAnalysis.matched.length > 0 ? 
    Math.min((skillsAnalysis.matched.length / (skillsAnalysis.matched.length + skillsAnalysis.missing.length)) * 100, 100) : 0;
  
  // Calculate average section score
  const sectionScores = Object.values(sectionsAnalysis).map(s => s.score);
  const avgSectionScore = sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length;
  
  // Calculate weighted score
  const overallScore = (
    keywordScore * weights.keywords +
    skillsScore * weights.skills +
    avgSectionScore * weights.sections
  );
  
  return Math.round(Math.max(Math.min(overallScore, 100), 0));
};

/**
 * Calculate readability score
 */
const calculateReadabilityScore = (text) => {
  // Simple readability calculation based on sentence and word length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgCharsPerWord = words.reduce((acc, word) => acc + word.length, 0) / words.length;
  
  // Lower scores are better for readability
  let score = 100;
  if (avgWordsPerSentence > 20) score -= 10;
  if (avgCharsPerWord > 6) score -= 10;
  
  return Math.max(score, 60);
};

/**
 * Calculate ATS compatibility score
 */
const calculateATSCompatibilityScore = (text) => {
  let score = 80;
  
  // Check for problematic elements
  if (/[^\x00-\x7F]/.test(text)) score -= 5; // Non-ASCII characters
  if (text.includes('\t')) score -= 5; // Tabs
  if (/\s{3,}/.test(text)) score -= 5; // Multiple spaces
  
  // Check for good practices
  if (/^[A-Z\s]+$/m.test(text)) score += 10; // Section headers
  if (/\d{4}-\d{4}/.test(text)) score += 5; // Date ranges
  
  return Math.max(Math.min(score, 100), 0);
};

module.exports = {
  analyzeResume,
  extractKeywords,
  extractSkills,
  calculateOverallScore
};
