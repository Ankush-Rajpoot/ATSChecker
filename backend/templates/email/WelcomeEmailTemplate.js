const EmailTemplate = require('./EmailTemplate');

/**
 * Welcome Email Template
 * Template for new user onboarding emails
 */
class WelcomeEmailTemplate extends EmailTemplate {
  constructor(config = {}) {
    super(config);
  }

  /**
   * Generate welcome email specific styles
   */
  getWelcomeStyles() {
    return `
      <style>
        .welcome-hero {
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
          padding: 40px 24px;
          text-align: center;
          border-radius: 12px;
          margin: 20px 0;
          color: white;
        }
        
        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .welcome-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 24px 0;
        }
        
        .feature-card {
          background: linear-gradient(135deg, #171717 0%, #0A0A0A 100%);
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
          transition: border-color 0.3s ease;
        }
        
        .feature-card:hover {
          border-color: #22C55E;
        }
        
        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
        
        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        
        .feature-description {
          font-size: 14px;
          color: #A3A3A3;
          line-height: 1.4;
        }
        
        .steps-list {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        
        .step-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #1A1A1A;
        }
        
        .step-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .step-number {
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          margin-right: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .step-content {
          flex: 1;
        }
        
        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        
        .step-description {
          font-size: 13px;
          color: #A3A3A3;
          line-height: 1.4;
        }
        
        .tips-section {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        
        .tips-title {
          font-size: 16px;
          font-weight: 600;
          color: #3B82F6;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        
        .tips-title::before {
          content: "💡";
          margin-right: 8px;
        }
        
        .tip-item {
          color: #A3A3A3;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 8px;
          padding-left: 16px;
          position: relative;
        }
        
        .tip-item::before {
          content: "•";
          color: #3B82F6;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .tip-item:last-child {
          margin-bottom: 0;
        }
        
        .cta-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 32px 24px;
          text-align: center;
          margin: 32px 0;
        }
        
        .cta-title {
          font-size: 18px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        
        .cta-subtitle {
          color: #A3A3A3;
          margin-bottom: 24px;
          font-size: 14px;
        }
        
        @media (max-width: 600px) {
          .welcome-hero {
            padding: 30px 20px;
          }
          
          .welcome-title {
            font-size: 20px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .feature-card {
            padding: 20px 16px;
          }
          
          .cta-section {
            padding: 24px 20px;
          }
        }
      </style>
    `;
  }

  /**
   * Generate features section
   */
  generateFeatures() {
    const features = [
      {
        icon: '🎯',
        title: 'ATS Score Analysis',
        description: 'Get detailed compatibility scores and understand how ATS systems evaluate your resume.'
      },
      {
        icon: '🔍',
        title: 'Keyword Optimization',
        description: 'Discover missing keywords and skills that matter for your target job positions.'
      },
      {
        icon: '📊',
        title: 'Progress Tracking',
        description: 'Monitor your improvement over time with comprehensive analytics and insights.'
      },
      {
        icon: '💼',
        title: 'Professional Reports',
        description: 'Generate detailed PDF reports to track your optimization journey and share with advisors.'
      }
    ];

    const featuresHtml = features.map(feature => `
      <div class="feature-card">
        <span class="feature-icon">${feature.icon}</span>
        <div class="feature-title">${feature.title}</div>
        <div class="feature-description">${feature.description}</div>
      </div>
    `).join('');

    return `
      <div class="features-grid">
        ${featuresHtml}
      </div>
    `;
  }

  /**
   * Generate getting started steps
   */
  generateGettingStartedSteps() {
    const steps = [
      {
        title: 'Upload Your Resume',
        description: 'Start by uploading your current resume in PDF or Word format. Our system supports all major file types.'
      },
      {
        title: 'Add Job Description',
        description: 'Paste the job description you\'re targeting to get personalized optimization suggestions.'
      },
      {
        title: 'Get Your ATS Score',
        description: 'Receive instant analysis with detailed scoring and specific recommendations for improvement.'
      },
      {
        title: 'Optimize & Improve',
        description: 'Apply the suggestions and re-analyze to track your progress and achieve higher scores.'
      }
    ];

    const stepsHtml = steps.map((step, index) => `
      <div class="step-item">
        <div class="step-number">${index + 1}</div>
        <div class="step-content">
          <div class="step-title">${step.title}</div>
          <div class="step-description">${step.description}</div>
        </div>
      </div>
    `).join('');

    return `
      <div class="steps-list">
        ${stepsHtml}
      </div>
    `;
  }

  /**
   * Generate pro tips section
   */
  generateProTips() {
    const tips = [
      'Use industry-specific keywords from the job posting in your resume',
      'Keep your resume format clean and ATS-friendly (avoid complex tables or graphics)',
      'Include quantifiable achievements with specific numbers and results',
      'Analyze multiple versions to see how different approaches affect your score',
      'Update your resume regularly as you gain new skills and experiences'
    ];

    const tipsHtml = tips.map(tip => `
      <div class="tip-item">${tip}</div>
    `).join('');

    return `
      <div class="tips-section">
        <div class="tips-title">Pro Tips for Success</div>
        ${tipsHtml}
      </div>
    `;
  }

  /**
   * Generate complete welcome email
   */
  generate(user) {
    const content = `
      <div class="welcome-hero">
        <div class="welcome-title">Welcome to ${this.config.brandName}! 🎉</div>
        <div class="welcome-subtitle">You're now equipped with AI-powered resume optimization tools</div>
      </div>
      
      <div class="greeting">Hi ${this.escapeHtml(user.name)}!</div>
      
      <div class="message">
        Thank you for joining <strong>${this.config.brandName}</strong>! You've just taken a crucial step toward optimizing your resume for Applicant Tracking Systems (ATS) and improving your job search success.
      </div>
      
      <div class="message">
        <strong>What makes us different?</strong><br>
        Our AI-powered platform analyzes your resume against real ATS systems used by top companies, giving you actionable insights to improve your chances of getting noticed by recruiters.
      </div>
      
      ${this.generateFeatures()}
      
      ${this.createDivider()}
      
      <div class="message">
        <strong>🚀 Getting Started is Easy:</strong>
      </div>
      
      ${this.generateGettingStartedSteps()}
      
      ${this.generateProTips()}
      
      <div class="cta-section">
        <div class="cta-title">Ready to Get Started?</div>
        <div class="cta-subtitle">Upload your first resume and see how it performs against ATS systems</div>
        ${this.createButton('Start Your First Analysis →', `${this.config.frontendUrl}/dashboard`, 'primary')}
      </div>
      
      ${this.createAlert('🎯 Quick Start: Have a job posting ready? Copy and paste it during analysis for personalized optimization suggestions!', 'info')}
      
      <div class="message" style="margin-top: 32px;">
        If you have any questions or need assistance, our support team is here to help. Simply reply to this email or visit our help center.
      </div>
      
      <div class="message">
        Welcome aboard, and here's to your job search success! 🌟
      </div>
    `;

    return this.generateTemplate(content, {
      title: `🎯 Welcome to ${this.config.brandName} - Start Optimizing Your Resume!`,
      footerMessage: 'We\'re excited to be part of your career journey. Let\'s optimize for success!',
      preheader: `Welcome to ${this.config.brandName}! Start your resume optimization journey with AI-powered ATS analysis.`,
      additionalStyles: this.getWelcomeStyles()
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

module.exports = WelcomeEmailTemplate;
