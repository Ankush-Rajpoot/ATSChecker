const EmailTemplate = require('./EmailTemplate');

/**
 * Report Email Template
 * Template for ATS analysis completion emails
 */
class ReportEmailTemplate extends EmailTemplate {
  constructor(config = {}) {
    super(config);
  }

  /**
   * Get score-based styling class
   */
  getScoreClass(score) {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-poor';
  }

  /**
   * Generate score-specific styles
   */
  getScoreStyles() {
    return `
      <style>
        .score-excellent { color: #22C55E; }
        .score-good { color: #3B82F6; }
        .score-average { color: #EAB308; }
        .score-poor { color: #EF4444; }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #1F1F1F 0%, #0F0F0F 100%);
          border: 1px solid #2F2F2F;
          border-radius: 8px;
          padding: 20px 16px;
          text-align: center;
          position: relative;
          transition: transform 0.2s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: #404040;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 6px;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 11px;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        
        .report-card {
          background: linear-gradient(135deg, #1F1F1F 0%, #0F0F0F 100%);
          border: 1px solid #2F2F2F;
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
          position: relative;
        }
        
        .report-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
          border-radius: 2px 2px 0 0;
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #2F2F2F;
        }
        
        .report-title {
          font-weight: 600;
          color: #FFFFFF;
          font-size: 18px;
          max-width: 70%;
          word-break: break-word;
        }
        
        .report-score {
          font-size: 24px;
          font-weight: 700;
          padding: 12px 20px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #404040;
          min-width: 80px;
          text-align: center;
          letter-spacing: 1px;
        }
        
        .report-meta {
          color: #9CA3AF;
          font-size: 14px;
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .skills-section {
          margin-top: 20px;
        }
        
        .skills-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }
        
        .skill-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .skill-matched {
          background: rgba(34, 197, 94, 0.15);
          color: #4ADE80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .skill-missing {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .suggestions-list {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid #2F2F2F;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .suggestion-item {
          padding: 12px 0;
          border-bottom: 1px solid #1F1F1F;
          color: #B3B3B3;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          padding-left: 20px;
        }
        
        .suggestion-item:last-child {
          border-bottom: none;
        }
        
        .suggestion-item::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #22C55E;
          font-weight: bold;
          font-size: 16px;
        }
        
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .report-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .report-title {
            max-width: 100%;
          }
        }
      </style>
    `;
  }

  /**
   * Generate stats grid component
   */
  generateStatsGrid(dashboardStats) {
    if (!dashboardStats) return '';

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${dashboardStats.totalReports || 0}</div>
          <div class="stat-label">Total Reports</div>
        </div>
        <div class="stat-card">
          <div class="stat-value ${this.getScoreClass(dashboardStats.averageScore || 0)}">${dashboardStats.averageScore || 0}%</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value ${this.getScoreClass(dashboardStats.highestScore || 0)}">${dashboardStats.highestScore || 0}%</div>
          <div class="stat-label">Best Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${dashboardStats.improvementTrend || '+0'}%</div>
          <div class="stat-label">Improvement</div>
        </div>
      </div>
    `;
  }

  /**
   * Generate skills analysis section
   */
  generateSkillsSection(matchedSkills = [], missingSkills = []) {
    const matchedSkillsHtml = matchedSkills.slice(0, 6).map(skill => {
      // Handle both string skills and object skills
      const skillName = typeof skill === 'string' 
        ? skill 
        : (skill.skill || skill.name || skill.text || 'Skill');
      
      return `<span class="skill-badge skill-matched">${this.escapeHtml(skillName)}</span>`;
    }).join('');

    const missingSkillsHtml = missingSkills.slice(0, 4).map(skill => {
      // Handle both string skills and object skills
      const skillName = typeof skill === 'string' 
        ? skill 
        : (skill.skill || skill.name || skill.text || 'Skill');
      
      return `<span class="skill-badge skill-missing">${this.escapeHtml(skillName)}</span>`;
    }).join('');

    if (!matchedSkillsHtml && !missingSkillsHtml) return '';

    return `
      <div class="skills-section">
        ${matchedSkillsHtml ? `
          <div style="margin-bottom: 12px; font-size: 14px; color: #B3B3B3; font-weight: 600;">
            <span style="color: #4ADE80;">MATCHED SKILLS</span>
          </div>
          <div class="skills-row">${matchedSkillsHtml}</div>
        ` : ''}
        
        ${missingSkillsHtml ? `
          <div style="margin: 20px 0 12px; font-size: 14px; color: #B3B3B3; font-weight: 600;">
            <span style="color: #F87171;">RECOMMENDED SKILLS</span>
          </div>
          <div class="skills-row">${missingSkillsHtml}</div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Generate suggestions section
   */
  generateSuggestionsSection(suggestions = []) {
    if (!suggestions || suggestions.length === 0) return '';

    const suggestionsHtml = suggestions.slice(0, 5).map(suggestion => {
      // Handle both string suggestions and object suggestions
      const suggestionText = typeof suggestion === 'string' 
        ? suggestion 
        : (suggestion.suggestion || suggestion.text || 'Optimization suggestion');
      
      return `<div class="suggestion-item">${this.escapeHtml(suggestionText)}</div>`;
    }).join('');

    return `
      <div class="suggestions-list">
        <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 16px; font-size: 16px;">
          OPTIMIZATION RECOMMENDATIONS
        </div>
        ${suggestionsHtml}
      </div>
    `;
  }

  /**
   * Generate complete report email
   */
  generate(user, report, dashboardStats = null) {
    console.log('🔍 ReportEmailTemplate.generate called with:', {
      user: { name: user?.name, email: user?.email },
      report: { 
        fileName: report?.fileName, 
        score: report?.score,
        suggestions: report?.suggestions ? {
          type: typeof report.suggestions,
          length: Array.isArray(report.suggestions) ? report.suggestions.length : 'not array',
          first: report.suggestions[0]
        } : 'no suggestions'
      }
    });

    const scoreClass = this.getScoreClass(report.score);
    const formattedDate = this.formatDate(report.analyzedAt || new Date());
    
    const content = `
      <div class="greeting">Hello ${this.escapeHtml(user.name)},</div>
      
      <div class="message">
        Your resume analysis for <strong>${this.escapeHtml(report.fileName)}</strong> has been completed successfully. 
        Below is your comprehensive ATS compatibility report with personalized optimization recommendations.
      </div>
      
      <!-- Report Card -->
      <div class="report-card">
        <div class="report-header">
          <div class="report-title">${this.escapeHtml(report.fileName)}</div>
          <div class="report-score ${scoreClass}">${report.score}%</div>
        </div>
        
        <div class="report-meta">
          Analyzed on ${formattedDate} • 
          Processing time: ${report.processingTime || '< 1 second'} • 
          Document pages: ${report.pageCount || 1}
        </div>
        
        ${this.generateSkillsSection(report.matchedSkills, report.missingSkills)}
      </div>
      
      ${this.generateSuggestionsSection(report.suggestions)}
      
      ${dashboardStats ? `
        ${this.createDivider()}
        
        ${this.createSectionTitle('Your Progress Overview')}
        
        ${this.generateStatsGrid(dashboardStats)}
      ` : ''}
      
      ${this.createDivider()}
      
      <div style="text-align: center; margin: 40px 0;">
        ${this.createButton('View Detailed Analysis', `${this.config.frontendUrl}/results/${report.id || report._id}`, 'primary')}
      </div>
      
      ${this.createAlert('Regular analysis helps track your optimization progress and improves your chances of passing ATS systems successfully.', 'info')}
    `;

    return this.generateTemplate(content, {
      title: `Analysis Complete - ${report.fileName}`,
      footerMessage: 'Keep optimizing your resume for better ATS compatibility and increased job opportunities.',
      preheader: `Your resume "${report.fileName}" scored ${report.score}% - View your detailed analysis and optimization suggestions.`,
      additionalStyles: this.getScoreStyles()
    });
  }

  /**
   * Override base template to include additional styles
   */
  generateTemplate(content, options = {}) {
    const template = super.generateTemplate(content, options);
    
    if (options.additionalStyles) {
      return template.replace('</head>', `${options.additionalStyles}</head>`);
    }
    
    return template;
  }
}

module.exports = ReportEmailTemplate;
