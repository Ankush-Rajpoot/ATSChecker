const EmailTemplate = require('./EmailTemplate');

/**
 * Notification Email Template
 * Template for system notifications, test emails, and alerts
 */
class NotificationEmailTemplate extends EmailTemplate {
  constructor(config = {}) {
    super(config);
  }

  /**
   * Generate notification-specific styles
   */
  getNotificationStyles() {
    return `
      <style>
        .notification-header {
          padding: 20px 24px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .notification-success {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #22C55E;
        }
        
        .notification-error {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }
        
        .notification-warning {
          background: linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.1) 100%);
          border: 1px solid rgba(234, 179, 8, 0.2);
          color: #EAB308;
        }
        
        .notification-info {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }
        
        .notification-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        .notification-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .notification-subtitle {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .timestamp {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #262626;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          color: #737373;
          text-align: center;
          margin: 16px 0;
        }
        
        .system-info {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }
        
        .system-info-title {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        
        .system-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 13px;
          color: #A3A3A3;
          border-bottom: 1px solid #1A1A1A;
        }
        
        .system-info-item:last-child {
          border-bottom: none;
        }
        
        .system-info-label {
          font-weight: 500;
        }
        
        .system-info-value {
          color: #FFFFFF;
          font-family: monospace;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-online {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .status-offline {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .status-maintenance {
          background: rgba(234, 179, 8, 0.1);
          color: #EAB308;
          border: 1px solid rgba(234, 179, 8, 0.2);
        }
        
        .code-block {
          background: #0A0A0A;
          border: 1px solid #262626;
          border-radius: 6px;
          padding: 12px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: #A3A3A3;
          overflow-x: auto;
          margin: 12px 0;
        }
        
        .highlight {
          background: rgba(234, 179, 8, 0.1);
          color: #EAB308;
          padding: 2px 4px;
          border-radius: 3px;
          font-weight: 500;
        }
      </style>
    `;
  }

  /**
   * Generate test email
   */
  generateTestEmail(userEmail, additionalInfo = {}) {
    const timestamp = this.formatTime(new Date());
    const testId = `test_${Date.now()}`;
    
    const content = `
      <div class="notification-header notification-success">
        <div class="notification-icon">✅</div>
        <div class="notification-title">Email Test Successful!</div>
        <div class="notification-subtitle">Your email configuration is working correctly</div>
      </div>
      
      <div class="message">
        Great news! Your <strong>${this.config.brandName}</strong> email system is configured properly and functioning as expected.
      </div>
      
      <div class="timestamp">
        Test completed at: ${timestamp}
      </div>
      
      <div class="system-info">
        <div class="system-info-title">📋 Test Details</div>
        <div class="system-info-item">
          <span class="system-info-label">Test ID:</span>
          <span class="system-info-value">${testId}</span>
        </div>
        <div class="system-info-item">
          <span class="system-info-label">Recipient:</span>
          <span class="system-info-value">${userEmail}</span>
        </div>
        <div class="system-info-item">
          <span class="system-info-label">Template:</span>
          <span class="system-info-value">NotificationEmailTemplate</span>
        </div>
        <div class="system-info-item">
          <span class="system-info-label">Status:</span>
          <span class="status-badge status-online">Online</span>
        </div>
        ${additionalInfo.environment ? `
          <div class="system-info-item">
            <span class="system-info-label">Environment:</span>
            <span class="system-info-value">${additionalInfo.environment}</span>
          </div>
        ` : ''}
      </div>
      
      ${this.createAlert('🎉 Email notifications are now active for your account. You\'ll receive updates about your ATS analysis reports and important account activities.', 'success')}
      
      <div class="message">
        <strong>What happens next?</strong><br>
        You'll receive email notifications for:
        <ul style="margin: 12px 0 0 20px; color: #A3A3A3;">
          <li>ATS analysis completion</li>
          <li>Dashboard summaries</li>
          <li>Important account updates</li>
          <li>System maintenance notifications</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        ${this.createButton('Go to Dashboard →', `${this.config.frontendUrl}/dashboard`, 'primary')}
      </div>
    `;

    return this.generateTemplate(content, {
      title: `${this.config.brandName} Email Test`,
      footerMessage: 'Email system is operational and ready to serve you!',
      preheader: 'Your email configuration test was successful.',
      additionalStyles: this.getNotificationStyles()
    });
  }

  /**
   * Generate system maintenance notification
   */
  generateMaintenanceNotification(maintenanceInfo = {}) {
    const {
      startTime,
      endTime,
      duration = '2 hours',
      reason = 'Scheduled system upgrades',
      affectedServices = ['Resume Analysis', 'Dashboard'],
      urgency = 'normal'
    } = maintenanceInfo;

    const urgencyClass = urgency === 'urgent' ? 'notification-error' : 'notification-warning';
    const icon = urgency === 'urgent' ? '🚨' : '🔧';
    
    const content = `
      <div class="notification-header ${urgencyClass}">
        <div class="notification-icon">${icon}</div>
        <div class="notification-title">Scheduled Maintenance Notice</div>
        <div class="notification-subtitle">Temporary service interruption</div>
      </div>
      
      <div class="message">
        We'll be performing <span class="highlight">${reason.toLowerCase()}</span> to improve your experience with ${this.config.brandName}. 
        During this time, some services may be temporarily unavailable.
      </div>
      
      <div class="system-info">
        <div class="system-info-title">📅 Maintenance Schedule</div>
        ${startTime ? `
          <div class="system-info-item">
            <span class="system-info-label">Start Time:</span>
            <span class="system-info-value">${this.formatTime(startTime)}</span>
          </div>
        ` : ''}
        ${endTime ? `
          <div class="system-info-item">
            <span class="system-info-label">End Time:</span>
            <span class="system-info-value">${this.formatTime(endTime)}</span>
          </div>
        ` : ''}
        <div class="system-info-item">
          <span class="system-info-label">Duration:</span>
          <span class="system-info-value">${duration}</span>
        </div>
        <div class="system-info-item">
          <span class="system-info-label">Status:</span>
          <span class="status-badge status-maintenance">Maintenance</span>
        </div>
      </div>
      
      <div class="message">
        <strong>Affected Services:</strong>
        <ul style="margin: 12px 0 0 20px; color: #A3A3A3;">
          ${affectedServices.map(service => `<li>${service}</li>`).join('')}
        </ul>
      </div>
      
      ${this.createAlert('💡 We recommend completing any pending analyses before the maintenance window. Your data and account settings will remain secure during this process.', 'info')}
      
      <div class="message">
        We apologize for any inconvenience and appreciate your patience as we work to improve our platform.
      </div>
    `;

    return this.generateTemplate(content, {
      title: 'Scheduled Maintenance Notice',
      footerMessage: 'Thank you for your understanding. We\'ll be back soon with improvements!',
      preheader: `Maintenance scheduled: ${duration} - ${reason}`,
      additionalStyles: this.getNotificationStyles()
    });
  }

  /**
   * Generate error notification
   */
  generateErrorNotification(errorInfo = {}) {
    const {
      errorType = 'System Error',
      errorCode = 'ERR_500',
      message = 'An unexpected error occurred',
      resolution = 'Our team has been notified and is working on a fix',
      timestamp = new Date()
    } = errorInfo;

    const content = `
      <div class="notification-header notification-error">
        <div class="notification-icon">❌</div>
        <div class="notification-title">Service Alert</div>
        <div class="notification-subtitle">${errorType} detected</div>
      </div>
      
      <div class="message">
        We've detected an issue with our service that may affect your experience. Our technical team has been automatically notified and is working to resolve this immediately.
      </div>
      
      <div class="system-info">
        <div class="system-info-title">🔍 Error Details</div>
        <div class="system-info-item">
          <span class="system-info-label">Error Code:</span>
          <span class="system-info-value">${errorCode}</span>
        </div>
        <div class="system-info-item">
          <span class="system-info-label">Time:</span>
          <span class="system-info-value">${this.formatTime(timestamp)}</span>
        </div>
        <div class="system-info-item">
          <span class="system-info-label">Status:</span>
          <span class="status-badge status-offline">Investigating</span>
        </div>
      </div>
      
      <div class="alert alert-error">
        <strong>Issue:</strong> ${message}
      </div>
      
      <div class="alert alert-info">
        <strong>Resolution:</strong> ${resolution}
      </div>
      
      <div class="message">
        <strong>What you can do:</strong>
        <ul style="margin: 12px 0 0 20px; color: #A3A3A3;">
          <li>Try refreshing the page or logging in again</li>
          <li>Check our status page for updates</li>
          <li>Contact support if the issue persists</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        ${this.createButton('Check Status Page →', `${this.config.frontendUrl}/status`, 'default')}
        ${this.createButton('Contact Support →', `mailto:${this.config.supportEmail}`, 'primary')}
      </div>
    `;

    return this.generateTemplate(content, {
      title: 'Service Alert - Issue Detected',
      footerMessage: 'We apologize for the inconvenience and are working to resolve this quickly.',
      preheader: `${errorType}: ${message}`,
      additionalStyles: this.getNotificationStyles()
    });
  }

  /**
   * Generate custom notification
   */
  generateCustomNotification(notificationData = {}) {
    const {
      type = 'info',
      title = 'Notification',
      subtitle = '',
      message = '',
      actionUrl = null,
      actionText = 'Learn More',
      timestamp = new Date()
    } = notificationData;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const content = `
      <div class="notification-header notification-${type}">
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-title">${title}</div>
        ${subtitle ? `<div class="notification-subtitle">${subtitle}</div>` : ''}
      </div>
      
      <div class="message">
        ${message}
      </div>
      
      <div class="timestamp">
        ${this.formatTime(timestamp)}
      </div>
      
      ${actionUrl ? `
        <div style="text-align: center; margin: 32px 0;">
          ${this.createButton(actionText, actionUrl, 'primary')}
        </div>
      ` : ''}
    `;

    return this.generateTemplate(content, {
      title: title,
      footerMessage: 'Stay updated with the latest from ' + this.config.brandName,
      preheader: subtitle || message.substring(0, 100),
      additionalStyles: this.getNotificationStyles()
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

module.exports = NotificationEmailTemplate;
