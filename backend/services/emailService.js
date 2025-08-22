const { sendEmail } = require('../config/email');
const { emailTemplateFactory } = require('../templates/email');

class EmailService {
  // Send report completion email
  static async sendReportEmail(user, report, dashboardStats) {
    try {
      console.log('📧 === SENDING REPORT EMAIL ===');
      console.log('📧 User:', { id: user._id, email: user.email, name: user.name });
      console.log('📧 Report:', { id: report._id, fileName: report.fileName, score: report.score });
      console.log('📧 Dashboard Stats:', dashboardStats);
      console.log('📧 Email notifications enabled:', process.env.ENABLE_EMAIL_NOTIFICATIONS);

      if (!process.env.ENABLE_EMAIL_NOTIFICATIONS || process.env.ENABLE_EMAIL_NOTIFICATIONS === 'false') {
        console.log('📧 Email notifications disabled');
        return { success: false, message: 'Email notifications disabled' };
      }

      console.log('📧 Generating email HTML using template factory...');
      
      // Use the new template system
      const emailResult = emailTemplateFactory.safeGenerateEmail('report', {
        user: {
          name: user.name,
          email: user.email,
          id: user._id
        },
        report: {
          id: report._id,
          fileName: report.fileName,
          score: report.score,
          analyzedAt: report.analyzedAt || report.createdAt,
          processingTime: report.processingTime,
          pageCount: report.pageCount,
          matchedSkills: report.matchedSkills,
          missingSkills: report.missingSkills,
          suggestions: report.suggestions
        },
        dashboardStats: dashboardStats ? {
          totalReports: dashboardStats.totalReports,
          averageScore: dashboardStats.averageScore,
          highestScore: dashboardStats.highestScore,
          improvementTrend: dashboardStats.improvementTrend
        } : null
      });

      if (!emailResult.success) {
        console.error('❌ Email template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      console.log('📧 Email HTML generated successfully, length:', emailResult.html.length);
      
      const emailOptions = {
        to: user.email,
        subject: `🎯 ATS Analysis Complete: ${report.fileName} (${report.score}% Score)`,
        html: emailResult.html
      };

      console.log('📧 Email options:', {
        to: emailOptions.to,
        subject: emailOptions.subject,
        htmlLength: emailOptions.html.length
      });

      console.log('📧 Calling sendEmail function...');
      const result = await sendEmail(emailOptions);
      console.log('📧 sendEmail result:', result);
      
      if (result.success) {
        console.log(`✅ Report email sent successfully to ${user.email} for report ${report.id}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'report'
        };
      } else {
        console.error('❌ Failed to send report email:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending report email:', error);
      console.error('❌ Error stack:', error.stack);
      return { success: false, error: error.message };
    }
  }

  // Send dashboard summary email
  static async sendDashboardEmail(user, dashboardData) {
    try {
      console.log('📧 === SENDING DASHBOARD EMAIL ===');
      console.log('📧 User:', { id: user._id, email: user.email, name: user.name });
      console.log('📧 Dashboard Data:', dashboardData);

      if (!process.env.ENABLE_EMAIL_NOTIFICATIONS || process.env.ENABLE_EMAIL_NOTIFICATIONS === 'false') {
        console.log('📧 Email notifications disabled');
        return { success: false, message: 'Email notifications disabled' };
      }

      console.log('📧 Generating dashboard email HTML using template factory...');

      // Use the new template system
      const emailResult = emailTemplateFactory.safeGenerateEmail('dashboard', {
        user: {
          name: user.name,
          email: user.email,
          id: user._id
        },
        dashboardData: {
          totalReports: dashboardData.totalReports || 0,
          averageScore: dashboardData.averageScore || 0,
          highestScore: dashboardData.highestScore || 0,
          improvementTrend: dashboardData.improvementTrend || 0,
          recentReports: dashboardData.recentReports || [],
          period: dashboardData.period || 'week',
          totalAnalysisTime: dashboardData.totalAnalysisTime,
          mostMatchedSkills: dashboardData.mostMatchedSkills,
          successfulOptimizations: dashboardData.successfulOptimizations
        }
      });

      if (!emailResult.success) {
        console.error('❌ Dashboard email template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      console.log('📧 Dashboard email HTML generated successfully, length:', emailResult.html.length);
      
      const emailOptions = {
        to: user.email,
        subject: `📊 Your ATS Dashboard Summary - ${dashboardData.totalReports || 0} Reports Analyzed`,
        html: emailResult.html
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`✅ Dashboard email sent successfully to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'dashboard'
        };
      } else {
        console.error('❌ Failed to send dashboard email:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending dashboard email:', error);
      console.error('❌ Error stack:', error.stack);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email for new users
  static async sendWelcomeEmail(user) {
    try {
      console.log('📧 === SENDING WELCOME EMAIL ===');
      console.log('📧 User:', { id: user._id, email: user.email, name: user.name });

      if (!process.env.ENABLE_EMAIL_NOTIFICATIONS || process.env.ENABLE_EMAIL_NOTIFICATIONS === 'false') {
        console.log('📧 Email notifications disabled');
        return { success: false, message: 'Email notifications disabled' };
      }

      console.log('📧 Generating welcome email HTML using template factory...');

      // Use the new template system
      const emailResult = emailTemplateFactory.safeGenerateEmail('welcome', {
        user: {
          name: user.name,
          email: user.email,
          id: user._id
        }
      });

      if (!emailResult.success) {
        console.error('❌ Welcome email template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      console.log('📧 Welcome email HTML generated successfully, length:', emailResult.html.length);

      const emailOptions = {
        to: user.email,
        subject: '🎯 Welcome to ATS Checker - Start Optimizing Your Resume!',
        html: emailResult.html
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`✅ Welcome email sent successfully to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'welcome'
        };
      } else {
        console.error('❌ Failed to send welcome email:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      console.error('❌ Error stack:', error.stack);
      return { success: false, error: error.message };
    }
  }

  // Test email functionality
  static async sendTestEmail(userEmail) {
    try {
      console.log('📧 === SENDING TEST EMAIL ===');
      console.log('📧 Email:', userEmail);

      // Use the new template system
      const emailResult = emailTemplateFactory.safeGenerateEmail('test', {
        userEmail: userEmail,
        additionalInfo: {
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        }
      });

      if (!emailResult.success) {
        console.error('❌ Test email template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      console.log('📧 Test email HTML generated successfully, length:', emailResult.html.length);

      const emailOptions = {
        to: userEmail,
        subject: '✅ ATS Checker Email Test - Configuration Successful',
        html: emailResult.html
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`✅ Test email sent successfully to ${userEmail}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'test'
        };
      } else {
        console.error('❌ Failed to send test email:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      console.error('❌ Error stack:', error.stack);
      return { success: false, error: error.message };
    }
  }

  // Send maintenance notification email
  static async sendMaintenanceNotification(user, maintenanceInfo) {
    try {
      console.log('📧 === SENDING MAINTENANCE NOTIFICATION ===');
      console.log('📧 User:', { email: user.email, name: user.name });
      console.log('📧 Maintenance Info:', maintenanceInfo);

      const emailResult = emailTemplateFactory.safeGenerateEmail('maintenance', {
        user: {
          name: user.name,
          email: user.email
        },
        maintenanceInfo: maintenanceInfo
      });

      if (!emailResult.success) {
        console.error('❌ Maintenance email template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      const emailOptions = {
        to: user.email,
        subject: '🔧 Scheduled Maintenance Notice - ATS Checker',
        html: emailResult.html
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`✅ Maintenance notification sent to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'maintenance'
        };
      } else {
        console.error('❌ Failed to send maintenance notification:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending maintenance notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send error notification email
  static async sendErrorNotification(user, errorInfo) {
    try {
      console.log('📧 === SENDING ERROR NOTIFICATION ===');
      console.log('📧 User:', { email: user.email, name: user.name });
      console.log('📧 Error Info:', errorInfo);

      const emailResult = emailTemplateFactory.safeGenerateEmail('error', {
        user: {
          name: user.name,
          email: user.email
        },
        errorInfo: errorInfo
      });

      if (!emailResult.success) {
        console.error('❌ Error email template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      const emailOptions = {
        to: user.email,
        subject: '❌ Service Alert - ATS Checker',
        html: emailResult.html
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`✅ Error notification sent to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'error'
        };
      } else {
        console.error('❌ Failed to send error notification:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending error notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send custom notification email
  static async sendCustomNotification(user, notificationData) {
    try {
      console.log('📧 === SENDING CUSTOM NOTIFICATION ===');
      console.log('📧 User:', { email: user.email, name: user.name });
      console.log('📧 Notification Data:', notificationData);

      const emailResult = emailTemplateFactory.safeGenerateEmail('notification', {
        user: {
          name: user.name,
          email: user.email
        },
        notificationData: notificationData
      });

      if (!emailResult.success) {
        console.error('❌ Custom notification template generation failed:', emailResult.error);
        return { success: false, error: emailResult.error };
      }

      const emailOptions = {
        to: user.email,
        subject: notificationData.subject || 'Notification from ATS Checker',
        html: emailResult.html
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`✅ Custom notification sent to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl,
          templateType: 'custom'
        };
      } else {
        console.error('❌ Failed to send custom notification:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending custom notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available email template types
  static getAvailableTemplateTypes() {
    return emailTemplateFactory.getAvailableTypes();
  }

  // Validate email data before sending
  static validateEmailData(type, data) {
    return emailTemplateFactory.validateEmailData(type, data);
  }
}

module.exports = EmailService;
