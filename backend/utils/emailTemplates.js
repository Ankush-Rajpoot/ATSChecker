// Dark theme email templates for ATS Checker

const getEmailStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0A0A0A;
      color: #A3A3A3;
      line-height: 1.6;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0A0A0A;
      border: 1px solid #171717;
      border-radius: 16px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #171717 0%, #262626 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid #262626;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    
    .tagline {
      color: #737373;
      font-size: 14px;
    }
    
    .content {
      padding: 32px 24px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    
    .message {
      color: #A3A3A3;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #171717 0%, #0A0A0A 100%);
      border: 1px solid #262626;
      border-radius: 12px;
      padding: 20px 16px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #737373;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .score-excellent { color: #22C55E; }
    .score-good { color: #3B82F6; }
    .score-average { color: #EAB308; }
    .score-poor { color: #EF4444; }
    
    .report-card {
      background: linear-gradient(135deg, #171717 0%, #0A0A0A 100%);
      border: 1px solid #262626;
      border-radius: 12px;
      padding: 20px;
      margin: 16px 0;
    }
    
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .report-title {
      font-weight: 600;
      color: #FFFFFF;
      font-size: 16px;
    }
    
    .report-score {
      font-size: 18px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid #404040;
    }
    
    .report-meta {
      color: #737373;
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    .skills-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .skill-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .skill-matched {
      background: rgba(34, 197, 94, 0.1);
      color: #22C55E;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .skill-missing {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #373737 0%, #262626 100%);
      color: #FFFFFF;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      border: 1px solid #404040;
      transition: all 0.3s ease;
    }
    
    .cta-button:hover {
      background: linear-gradient(135deg, #404040 0%, #373737 100%);
      border-color: #525252;
    }
    
    .footer {
      background: #171717;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #262626;
    }
    
    .footer-text {
      color: #737373;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .footer-links {
      color: #A3A3A3;
      font-size: 12px;
    }
    
    .footer-links a {
      color: #A3A3A3;
      text-decoration: none;
      margin: 0 8px;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #262626 50%, transparent 100%);
      margin: 24px 0;
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      
      .header,
      .content,
      .footer {
        padding: 20px 16px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .report-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  </style>
`;

const generateReportEmailHTML = (user, report, dashboardStats) => {
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-poor';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ATS Analysis Complete - ${report.fileName}</title>
      ${getEmailStyles()}
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">ATS Checker</div>
          <div class="tagline">Resume Analysis Complete</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Hi ${user.name}! 👋</div>
          
          <div class="message">
            Your resume analysis for <strong>${report.fileName}</strong> has been completed. 
            Here's a comprehensive breakdown of your ATS compatibility score and optimization suggestions.
          </div>
          
          <!-- Report Card -->
          <div class="report-card">
            <div class="report-header">
              <div class="report-title">${report.fileName}</div>
              <div class="report-score ${getScoreClass(report.score)}">${report.score}%</div>
            </div>
            
            <div class="report-meta">
              Analyzed on ${formatDate(report.analyzedAt)} • 
              Processing time: ${report.processingTime || '< 1s'}
            </div>
            
            <div class="divider"></div>
            
            <div class="skills-row">
              ${report.matchedSkills?.slice(0, 5).map(skill => 
                `<span class="skill-badge skill-matched">✓ ${skill.skill || skill}</span>`
              ).join('') || ''}
              ${report.missingSkills?.slice(0, 3).map(skill => 
                `<span class="skill-badge skill-missing">✗ ${skill.skill || skill}</span>`
              ).join('') || ''}
            </div>
          </div>
          
          <!-- Dashboard Stats -->
          <div class="divider"></div>
          
          <div class="message">
            <strong>Your Progress Overview:</strong>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${dashboardStats?.totalReports || 0}</div>
              <div class="stat-label">Total Reports</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${getScoreClass(dashboardStats?.averageScore || 0)}">${dashboardStats?.averageScore || 0}%</div>
              <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${getScoreClass(dashboardStats?.highestScore || 0)}">${dashboardStats?.highestScore || 0}%</div>
              <div class="stat-label">Best Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${report.suggestions?.length || 0}</div>
              <div class="stat-label">Suggestions</div>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL}/results/${report.id}" class="cta-button">
              View Full Analysis →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-text">
            Keep optimizing your resume for better ATS compatibility!
          </div>
          <div class="footer-links">
            <a href="${process.env.FRONTEND_URL}/dashboard">Dashboard</a> •
            <a href="${process.env.FRONTEND_URL}/profile">Settings</a> •
            <a href="${process.env.FRONTEND_URL}/help">Help</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateDashboardEmailHTML = (user, dashboardData) => {
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-poor';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your ATS Dashboard Summary</title>
      ${getEmailStyles()}
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">ATS Checker</div>
          <div class="tagline">Weekly Dashboard Summary</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Hi ${user.name}! 📊</div>
          
          <div class="message">
            Here's your weekly ATS optimization summary. You're making great progress on your resume optimization journey!
          </div>
          
          <!-- Stats Overview -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${dashboardData.totalReports}</div>
              <div class="stat-label">Total Reports</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${getScoreClass(dashboardData.averageScore)}">${dashboardData.averageScore}%</div>
              <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${getScoreClass(dashboardData.highestScore)}">${dashboardData.highestScore}%</div>
              <div class="stat-label">Best Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${dashboardData.totalReports * 2.5}h</div>
              <div class="stat-label">Time Saved</div>
            </div>
          </div>
          
          <!-- Recent Reports -->
          ${dashboardData.recentReports?.length > 0 ? `
            <div class="divider"></div>
            
            <div class="message">
              <strong>Recent Analysis Reports:</strong>
            </div>
            
            ${dashboardData.recentReports.slice(0, 3).map(report => `
              <div class="report-card">
                <div class="report-header">
                  <div class="report-title">${report.fileName}</div>
                  <div class="report-score ${getScoreClass(report.score)}">${report.score}%</div>
                </div>
                <div class="report-meta">
                  ${formatDate(report.analyzedAt)} • 
                  ${report.matchedSkills?.length || 0} skills matched • 
                  ${report.suggestions?.length || 0} suggestions
                </div>
              </div>
            `).join('')}
          ` : ''}
          
          <div class="divider"></div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">
              View Full Dashboard →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-text">
            Keep up the great work! Regular optimization leads to better job opportunities.
          </div>
          <div class="footer-links">
            <a href="${process.env.FRONTEND_URL}/dashboard">Dashboard</a> •
            <a href="${process.env.FRONTEND_URL}/profile">Settings</a> •
            <a href="${process.env.FRONTEND_URL}/help">Help</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateReportEmailHTML,
  generateDashboardEmailHTML
};
