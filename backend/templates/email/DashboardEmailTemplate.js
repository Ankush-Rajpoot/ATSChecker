const EmailTemplate = require('./EmailTemplate');

/**
 * Dashboard Email Template
 * Template for dashboard summary and analytics emails
 */
class DashboardEmailTemplate extends EmailTemplate {
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
   * Generate dashboard-specific styles
   */
  getDashboardStyles() {
    return `
      <style>
        .score-excellent { color: #22C55E; }
        .score-good { color: #3B82F6; }
        .score-average { color: #EAB308; }
        .score-poor { color: #EF4444; }
        
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }
        
        .dashboard-card {
          background: linear-gradient(135deg, #171717 0%, #0A0A0A 100%);
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #22C55E, #3B82F6, #EAB308);
        }
        
        .dashboard-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
          line-height: 1;
        }
        
        .dashboard-label {
          font-size: 12px;
          color: #737373;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        
        .dashboard-trend {
          font-size: 10px;
          margin-top: 4px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .trend-positive {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }
        
        .trend-negative {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }
        
        .trend-neutral {
          background: rgba(163, 163, 163, 0.1);
          color: #A3A3A3;
        }
        
        .recent-reports {
          margin: 24px 0;
        }
        
        .report-item {
          background: linear-gradient(135deg, #171717 0%, #0A0A0A 100%);
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 16px;
          margin: 12px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.3s ease;
        }
        
        .report-item:hover {
          border-color: #404040;
        }
        
        .report-info {
          flex: 1;
        }
        
        .report-name {
          font-weight: 600;
          color: #FFFFFF;
          font-size: 14px;
          margin-bottom: 4px;
          word-break: break-word;
        }
        
        .report-details {
          color: #737373;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .report-score-badge {
          font-size: 14px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #404040;
          min-width: 50px;
          text-align: center;
          margin-left: 12px;
        }
        
        .achievements {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        
        .achievement-title {
          font-size: 16px;
          font-weight: 600;
          color: #22C55E;
          margin-bottom: 8px;
        }
        
        .achievement-text {
          color: #A3A3A3;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }
        
        .insight-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 16px;
        }
        
        .insight-icon {
          font-size: 20px;
          margin-bottom: 8px;
        }
        
        .insight-title {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        
        .insight-text {
          font-size: 12px;
          color: #A3A3A3;
          line-height: 1.4;
        }
        
        @media (max-width: 600px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .dashboard-value {
            font-size: 24px;
          }
          
          .report-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .report-score-badge {
            margin-left: 0;
            align-self: flex-end;
          }
          
          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
  }

  /**
   * Generate dashboard stats grid
   */
  generateDashboardStats(dashboardData) {
    const {
      totalReports = 0,
      averageScore = 0,
      highestScore = 0,
      improvementTrend = 0,
      totalAnalysisTime = 0,
      successfulOptimizations = 0
    } = dashboardData;

    return `
      <div class="dashboard-stats">
        <div class="dashboard-card">
          <div class="dashboard-value">${totalReports}</div>
          <div class="dashboard-label">Total Reports</div>
          ${totalReports > 0 ? `<div class="dashboard-trend trend-positive">+${Math.min(totalReports, 5)} this week</div>` : ''}
        </div>
        
        <div class="dashboard-card">
          <div class="dashboard-value ${this.getScoreClass(averageScore)}">${averageScore}%</div>
          <div class="dashboard-label">Average Score</div>
          ${improvementTrend !== 0 ? `
            <div class="dashboard-trend ${improvementTrend > 0 ? 'trend-positive' : 'trend-negative'}">
              ${improvementTrend > 0 ? '+' : ''}${improvementTrend}% vs last week
            </div>
          ` : ''}
        </div>
        
        <div class="dashboard-card">
          <div class="dashboard-value ${this.getScoreClass(highestScore)}">${highestScore}%</div>
          <div class="dashboard-label">Best Score</div>
          ${highestScore >= 80 ? '<div class="dashboard-trend trend-positive">Excellent!</div>' : ''}
        </div>
        
        <div class="dashboard-card">
          <div class="dashboard-value">${Math.round(totalAnalysisTime || totalReports * 2.5)}h</div>
          <div class="dashboard-label">Time Saved</div>
          <div class="dashboard-trend trend-positive">vs manual analysis</div>
        </div>
      </div>
    `;
  }

  /**
   * Generate recent reports section
   */
  generateRecentReports(recentReports = []) {
    if (!recentReports || recentReports.length === 0) {
      return `
        <div class="recent-reports">
          <div style="text-align: center; color: #737373; padding: 20px;">
            No recent reports to display. Start your first analysis!
          </div>
        </div>
      `;
    }

    const reportsHtml = recentReports.slice(0, 5).map(report => {
      const scoreClass = this.getScoreClass(report.score);
      const date = this.formatDate(report.analyzedAt || report.createdAt, { month: 'short', day: 'numeric' });
      
      return `
        <div class="report-item">
          <div class="report-info">
            <div class="report-name">${this.escapeHtml(report.fileName)}</div>
            <div class="report-details">
              ${date} • ${report.matchedSkills?.length || 0} skills matched • ${report.suggestions?.length || 0} suggestions
            </div>
          </div>
          <div class="report-score-badge ${scoreClass}">${report.score}%</div>
        </div>
      `;
    }).join('');

    return `
      <div class="recent-reports">
        <div class="message">
          <strong>📋 Recent Analysis Reports:</strong>
        </div>
        ${reportsHtml}
      </div>
    `;
  }

  /**
   * Generate achievements section
   */
  generateAchievements(dashboardData) {
    const { totalReports, highestScore, averageScore, improvementTrend } = dashboardData;
    
    let achievement = null;
    
    if (highestScore >= 90) {
      achievement = {
        title: '🏆 ATS Master Achieved!',
        text: 'Congratulations! You\'ve achieved a 90%+ ATS score. Your resume is optimized for success!'
      };
    } else if (totalReports >= 10) {
      achievement = {
        title: '🎯 Analysis Expert',
        text: `You've completed ${totalReports} analyses! Your dedication to optimization is paying off.`
      };
    } else if (improvementTrend > 10) {
      achievement = {
        title: '📈 Rising Star',
        text: `Amazing! Your scores improved by ${improvementTrend}% this week. Keep up the great work!`
      };
    } else if (averageScore >= 70) {
      achievement = {
        title: '⭐ Quality Optimizer',
        text: 'Your average score of ' + averageScore + '% shows excellent optimization skills!'
      };
    }
    
    if (!achievement) return '';
    
    return `
      <div class="achievements">
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-text">${achievement.text}</div>
      </div>
    `;
  }

  /**
   * Generate insights section
   */
  generateInsights(dashboardData) {
    const insights = [];
    
    // Performance insight
    if (dashboardData.averageScore >= 70) {
      insights.push({
        icon: '🎯',
        title: 'Strong Performance',
        text: 'Your resumes consistently score well. Focus on minor tweaks for perfection.'
      });
    } else if (dashboardData.averageScore >= 50) {
      insights.push({
        icon: '📈',
        title: 'Good Progress',
        text: 'You\'re on the right track. Focus on adding more relevant keywords.'
      });
    } else {
      insights.push({
        icon: '🔧',
        title: 'Optimization Needed',
        text: 'Consider restructuring your resume format and adding industry keywords.'
      });
    }
    
    // Activity insight
    if (dashboardData.totalReports >= 5) {
      insights.push({
        icon: '⚡',
        title: 'Active Optimizer',
        text: 'Great job staying active! Regular analysis leads to better results.'
      });
    }
    
    // Skills insight
    if (dashboardData.mostMatchedSkills && dashboardData.mostMatchedSkills.length > 0) {
      insights.push({
        icon: '🛠️',
        title: 'Skill Strength',
        text: `Your "${dashboardData.mostMatchedSkills[0]}" skills are consistently recognized.`
      });
    }
    
    if (insights.length === 0) return '';
    
    const insightsHtml = insights.map(insight => `
      <div class="insight-card">
        <div class="insight-icon">${insight.icon}</div>
        <div class="insight-title">${insight.title}</div>
        <div class="insight-text">${insight.text}</div>
      </div>
    `).join('');
    
    return `
      <div class="insights-grid">
        ${insightsHtml}
      </div>
    `;
  }

  /**
   * Generate complete dashboard email
   */
  generate(user, dashboardData) {
    const period = dashboardData.period || 'week';
    const achievements = this.generateAchievements(dashboardData);
    
    const content = `
      <div class="greeting">Hi ${this.escapeHtml(user.name)}! 📊</div>
      
      <div class="message">
        Here's your ${period}ly ATS optimization summary. You're making excellent progress on your resume optimization journey!
      </div>
      
      ${this.generateDashboardStats(dashboardData)}
      
      ${achievements}
      
      ${this.generateRecentReports(dashboardData.recentReports)}
      
      ${this.createDivider()}
      
      <div class="message">
        <strong>💡 Personalized Insights:</strong>
      </div>
      
      ${this.generateInsights(dashboardData)}
      
      ${this.createDivider()}
      
      <div style="text-align: center; margin: 32px 0;">
        ${this.createButton('View Full Dashboard →', `${this.config.frontendUrl}/dashboard`, 'primary')}
      </div>
      
      ${this.createAlert('🚀 Pro Tip: Upload different resume versions to see how formatting and content changes affect your ATS scores!', 'info')}
    `;

    return this.generateTemplate(content, {
      title: `📊 Your ${period.charAt(0).toUpperCase() + period.slice(1)}ly Dashboard Summary`,
      footerMessage: 'Keep up the great work! Regular optimization leads to better job opportunities.',
      preheader: `Your ATS summary: ${dashboardData.totalReports} reports analyzed, ${dashboardData.averageScore}% average score.`,
      additionalStyles: this.getDashboardStyles()
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

module.exports = DashboardEmailTemplate;
