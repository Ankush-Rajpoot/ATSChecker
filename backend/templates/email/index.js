/**
 * Email Template Factory
 * Central factory for creating email templates
 */

const EmailTemplate = require('./EmailTemplate');
const ReportEmailTemplate = require('./ReportEmailTemplate');
const DashboardEmailTemplate = require('./DashboardEmailTemplate');
const WelcomeEmailTemplate = require('./WelcomeEmailTemplate');
const NotificationEmailTemplate = require('./NotificationEmailTemplate');

class EmailTemplateFactory {
  constructor(config = {}) {
    this.config = {
      brandName: 'ATS Checker',
      tagline: 'AI-Powered Resume Optimization',
      primaryColor: '#FFFFFF',
      secondaryColor: '#A3A3A3',
      accentColor: '#22C55E',
      backgroundColor: '#0A0A0A',
      cardBackground: '#171717',
      borderColor: '#262626',
      fontFamily: 'Inter',
      frontendUrl: process.env.FRONTEND_URL || 'https://atschecker.com',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@atschecker.com',
      ...config
    };
  }

  /**
   * Create report email template
   */
  createReportTemplate() {
    return new ReportEmailTemplate(this.config);
  }

  /**
   * Create dashboard email template
   */
  createDashboardTemplate() {
    return new DashboardEmailTemplate(this.config);
  }

  /**
   * Create welcome email template
   */
  createWelcomeTemplate() {
    return new WelcomeEmailTemplate(this.config);
  }

  /**
   * Create notification email template
   */
  createNotificationTemplate() {
    return new NotificationEmailTemplate(this.config);
  }

  /**
   * Create base email template
   */
  createBaseTemplate() {
    return new EmailTemplate(this.config);
  }

  /**
   * Get template by type
   */
  getTemplate(type) {
    switch (type.toLowerCase()) {
      case 'report':
      case 'analysis':
        return this.createReportTemplate();
      
      case 'dashboard':
      case 'summary':
        return this.createDashboardTemplate();
      
      case 'welcome':
      case 'onboarding':
        return this.createWelcomeTemplate();
      
      case 'notification':
      case 'alert':
      case 'test':
        return this.createNotificationTemplate();
      
      case 'base':
      case 'generic':
      default:
        return this.createBaseTemplate();
    }
  }

  /**
   * Generate email by type with data
   */
  generateEmail(type, data = {}) {
    const template = this.getTemplate(type);
    
    switch (type.toLowerCase()) {
      case 'report':
      case 'analysis':
        return template.generate(data.user, data.report, data.dashboardStats);
      
      case 'dashboard':
      case 'summary':
        return template.generate(data.user, data.dashboardData);
      
      case 'welcome':
      case 'onboarding':
        return template.generate(data.user);
      
      case 'test':
        return template.generateTestEmail(data.userEmail, data.additionalInfo);
      
      case 'maintenance':
        return template.generateMaintenanceNotification(data.maintenanceInfo);
      
      case 'error':
        return template.generateErrorNotification(data.errorInfo);
      
      case 'notification':
      case 'custom':
        return template.generateCustomNotification(data.notificationData);
      
      default:
        return template.generateTemplate(data.content || 'No content provided', data.options);
    }
  }

  /**
   * Validate email data
   */
  validateEmailData(type, data) {
    const errors = [];

    // Common validations
    if (!data.user && ['report', 'dashboard', 'welcome'].includes(type)) {
      errors.push('User data is required');
    }

    if (data.user && !data.user.email) {
      errors.push('User email is required');
    }

    if (data.user && !data.user.name) {
      errors.push('User name is required');
    }

    // Type-specific validations
    switch (type.toLowerCase()) {
      case 'report':
      case 'analysis':
        if (!data.report) {
          errors.push('Report data is required');
        } else {
          if (!data.report.fileName) errors.push('Report filename is required');
          if (data.report.score === undefined || data.report.score === null) {
            errors.push('Report score is required');
          }
          if (data.report.score < 0 || data.report.score > 100) {
            errors.push('Report score must be between 0 and 100');
          }
        }
        break;
      
      case 'dashboard':
      case 'summary':
        if (!data.dashboardData) {
          errors.push('Dashboard data is required');
        } else {
          if (data.dashboardData.totalReports === undefined) {
            errors.push('Total reports count is required');
          }
          if (data.dashboardData.averageScore === undefined) {
            errors.push('Average score is required');
          }
        }
        break;
      
      case 'test':
        if (!data.userEmail) {
          errors.push('User email is required for test emails');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Safe email generation with validation
   */
  safeGenerateEmail(type, data = {}) {
    try {
      // Validate data
      const validation = this.validateEmailData(type, data);
      if (!validation.isValid) {
        throw new Error(`Email validation failed: ${validation.errors.join(', ')}`);
      }

      // Generate email
      const emailHtml = this.generateEmail(type, data);
      
      return {
        success: true,
        html: emailHtml,
        type: type
      };
    } catch (error) {
      console.error('Email generation error:', error);
      return {
        success: false,
        error: error.message,
        type: type
      };
    }
  }

  /**
   * Get available template types
   */
  getAvailableTypes() {
    return [
      'report',
      'analysis',
      'dashboard',
      'summary',
      'welcome',
      'onboarding',
      'notification',
      'alert',
      'test',
      'maintenance',
      'error',
      'custom',
      'base',
      'generic'
    ];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
}

// Export singleton instance
const emailTemplateFactory = new EmailTemplateFactory();

module.exports = {
  EmailTemplateFactory,
  emailTemplateFactory,
  EmailTemplate,
  ReportEmailTemplate,
  DashboardEmailTemplate,
  WelcomeEmailTemplate,
  NotificationEmailTemplate
};
