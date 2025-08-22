/**
 * Base Email Template Class
 * Production-grade email template system for ATS Checker
 */

class EmailTemplate {
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
   * Generate CSS styles for email templates
   */
  getEmailStyles() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=${this.config.fontFamily}:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: '${this.config.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: ${this.config.backgroundColor};
          color: ${this.config.secondaryColor};
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${this.config.backgroundColor};
          border: 1px solid ${this.config.borderColor};
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .header {
          background: linear-gradient(135deg, ${this.config.cardBackground} 0%, #1A1A1A 100%);
          padding: 40px 32px;
          text-align: center;
          border-bottom: 1px solid ${this.config.borderColor};
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, ${this.config.accentColor} 0%, #1EA853 50%, ${this.config.accentColor} 100%);
        }
        
        .logo {
          font-size: 32px;
          font-weight: 700;
          color: ${this.config.primaryColor};
          margin-bottom: 12px;
          text-decoration: none;
          letter-spacing: -0.5px;
        }
        
        .tagline {
          color: #9CA3AF;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .content {
          padding: 40px 32px;
          background-color: ${this.config.backgroundColor};
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: ${this.config.primaryColor};
          margin-bottom: 20px;
          line-height: 1.3;
        }
        
        .message {
          color: ${this.config.secondaryColor};
          margin-bottom: 28px;
          line-height: 1.7;
          font-size: 15px;
        }
        
        .message strong {
          color: ${this.config.primaryColor};
          font-weight: 600;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: ${this.config.primaryColor};
          margin: 32px 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid ${this.config.borderColor};
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #374151 0%, #1F2937 100%);
          color: ${this.config.primaryColor};
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          border: 1px solid #4B5563;
          transition: all 0.3s ease;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .cta-button:hover {
          background: linear-gradient(135deg, #4B5563 0%, #374151 100%);
          border-color: #6B7280;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .cta-button-primary {
          background: linear-gradient(135deg, ${this.config.accentColor} 0%, #16A34A 100%);
          border-color: ${this.config.accentColor};
          color: #000000;
          font-weight: 700;
        }
        
        .cta-button-primary:hover {
          background: linear-gradient(135deg, #16A34A 0%, #15803D 100%);
          border-color: #16A34A;
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${this.config.borderColor} 30%, ${this.config.borderColor} 70%, transparent 100%);
          margin: 32px 0;
        }
        
        .footer {
          background: linear-gradient(135deg, ${this.config.cardBackground} 0%, #111111 100%);
          padding: 32px 24px;
          text-align: center;
          border-top: 1px solid ${this.config.borderColor};
        }
        
        .footer-text {
          color: #9CA3AF;
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .footer-links {
          color: ${this.config.secondaryColor};
          font-size: 12px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .footer-links a {
          color: ${this.config.secondaryColor};
          text-decoration: none;
          margin: 0 12px;
          transition: color 0.3s ease;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .footer-links a:hover {
          color: ${this.config.accentColor};
          background: rgba(34, 197, 94, 0.1);
        }
        
        .footer-social {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #1F1F1F;
        }
        
        .footer-social a {
          display: inline-block;
          margin: 0 8px;
          color: #9CA3AF;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
        }
        
        .alert {
          padding: 20px;
          border-radius: 8px;
          margin: 24px 0;
          border-left: 4px solid;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid;
        }
        
        .alert-success {
          background: rgba(34, 197, 94, 0.08);
          border-color: ${this.config.accentColor};
          color: #4ADE80;
          border-left-color: ${this.config.accentColor};
        }
        
        .alert-warning {
          background: rgba(234, 179, 8, 0.08);
          border-color: #FBBF24;
          color: #FBBF24;
          border-left-color: #FBBF24;
        }
        
        .alert-error {
          background: rgba(239, 68, 68, 0.08);
          border-color: #F87171;
          color: #F87171;
          border-left-color: #F87171;
        }
        
        .alert-info {
          background: rgba(59, 130, 246, 0.08);
          border-color: #60A5FA;
          color: #60A5FA;
          border-left-color: #60A5FA;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 8px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .header {
            padding: 32px 20px;
          }
          
          .content,
          .footer {
            padding: 24px 20px;
          }
          
          .logo {
            font-size: 28px;
          }
          
          .greeting {
            font-size: 18px;
          }
          
          .cta-button {
            display: block;
            text-align: center;
            margin: 20px 0;
            padding: 18px 24px;
          }
          
          .section-title {
            font-size: 15px;
          }
          
          .message {
            font-size: 14px;
          }
        }
      </style>
    `;
  }

  /**
   * Generate email header
   */
  generateHeader(title = null) {
    return `
      <div class="header">
        <div class="logo">${this.config.brandName}</div>
        <div class="tagline">${title || this.config.tagline}</div>
      </div>
    `;
  }

  /**
   * Generate email footer
   */
  generateFooter(customMessage = null) {
    return `
      <div class="footer">
        <div class="footer-text">
          ${customMessage || 'Thank you for using ' + this.config.brandName + '!'}
        </div>
        <div class="footer-links">
          <a href="${this.config.frontendUrl}/dashboard">Dashboard</a> •
          <a href="${this.config.frontendUrl}/profile">Settings</a> •
          <a href="${this.config.frontendUrl}/help">Help</a> •
          <a href="${this.config.frontendUrl}/privacy">Privacy</a>
        </div>
        <div class="footer-social">
          <a href="mailto:${this.config.supportEmail}">Contact Support</a>
        </div>
      </div>
    `;
  }

  /**
   * Generate complete email template
   */
  generateTemplate(content, options = {}) {
    const {
      title = this.config.tagline,
      footerMessage = null,
      preheader = null
    } = options;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title}</title>
        ${preheader ? `<meta name="description" content="${preheader}">` : ''}
        ${this.getEmailStyles()}
      </head>
      <body>
        ${preheader ? `
          <div style="display: none; font-size: 1px; color: transparent; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
            ${preheader}
          </div>
        ` : ''}
        
        <div class="email-container">
          ${this.generateHeader(title)}
          
          <div class="content">
            ${content}
          </div>
          
          ${this.generateFooter(footerMessage)}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Utility methods for common email components
   */
  createButton(text, url, type = 'default') {
    const buttonClass = type === 'primary' ? 'cta-button cta-button-primary' : 'cta-button';
    return `<a href="${url}" class="${buttonClass}">${text}</a>`;
  }

  createAlert(message, type = 'info') {
    return `<div class="alert alert-${type}">${message}</div>`;
  }

  createDivider() {
    return '<div class="divider"></div>';
  }

  createSectionTitle(title) {
    return `<div class="section-title">${this.escapeHtml(title)}</div>`;
  }

  createInfoCard(title, content, backgroundColor = 'rgba(255, 255, 255, 0.02)') {
    return `
      <div style="background: ${backgroundColor}; border: 1px solid #262626; border-radius: 8px; padding: 20px; margin: 16px 0;">
        ${title ? `<div style="font-weight: 600; color: #FFFFFF; font-size: 16px; margin-bottom: 12px;">${this.escapeHtml(title)}</div>` : ''}
        <div style="color: #A3A3A3; line-height: 1.6;">${content}</div>
      </div>
    `;
  }

  createStatsTable(stats) {
    const rows = stats.map(stat => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1F1F1F; color: #A3A3A3; font-size: 14px;">
          ${this.escapeHtml(stat.label)}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1F1F1F; color: #FFFFFF; font-weight: 600; text-align: right; font-size: 14px;">
          ${this.escapeHtml(stat.value)}
        </td>
      </tr>
    `).join('');

    return `
      <table style="width: 100%; border-collapse: collapse; background: rgba(255, 255, 255, 0.02); border: 1px solid #262626; border-radius: 8px; overflow: hidden; margin: 16px 0;">
        ${rows}
      </table>
    `;
  }

  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  }

  formatTime(date) {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  escapeHtml(text) {
    // Handle non-string values
    if (text === null || text === undefined) return '';
    if (typeof text !== 'string') {
      text = String(text);
    }
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  truncateText(text, length = 100) {
    // Handle non-string values
    if (text === null || text === undefined) return '';
    if (typeof text !== 'string') {
      text = String(text);
    }
    
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
}

module.exports = EmailTemplate;
