const { sendEmail } = require('../config/email');
const { generateReportEmailHTML, generateDashboardEmailHTML } = require('../utils/emailTemplates');

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

      console.log('📧 Generating email HTML...');
      const emailHtml = generateReportEmailHTML(user, report, dashboardStats);
      console.log('📧 Email HTML generated, length:', emailHtml.length);
      
      const emailOptions = {
        to: user.email,
        subject: `🎯 ATS Analysis Complete: ${report.fileName} (${report.score}% Score)`,
        html: emailHtml
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
          previewUrl: result.previewUrl
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
      if (!process.env.ENABLE_EMAIL_NOTIFICATIONS || process.env.ENABLE_EMAIL_NOTIFICATIONS === 'false') {
        console.log('📧 Email notifications disabled');
        return { success: false, message: 'Email notifications disabled' };
      }

      const emailHtml = generateDashboardEmailHTML(user, dashboardData);
      
      const emailOptions = {
        to: user.email,
        subject: `📊 Your ATS Dashboard Summary - ${dashboardData.totalReports} Reports Analyzed`,
        html: emailHtml
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`📧 Dashboard email sent to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl
        };
      } else {
        console.error('Failed to send dashboard email:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error sending dashboard email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email for new users
  static async sendWelcomeEmail(user) {
    try {
      if (!process.env.ENABLE_EMAIL_NOTIFICATIONS || process.env.ENABLE_EMAIL_NOTIFICATIONS === 'false') {
        return { success: false, message: 'Email notifications disabled' };
      }

      const welcomeEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ATS Checker</title>
          <style>
            body { font-family: 'Inter', sans-serif; background-color: #0A0A0A; color: #A3A3A3; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #171717; border-radius: 16px; overflow: hidden; border: 1px solid #262626; }
            .header { background: linear-gradient(135deg, #373737 0%, #262626 100%); padding: 40px 32px; text-align: center; }
            .logo { font-size: 32px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; }
            .content { padding: 32px; }
            .greeting { font-size: 20px; font-weight: 600; color: #FFFFFF; margin-bottom: 16px; }
            .message { color: #A3A3A3; line-height: 1.6; margin-bottom: 24px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #373737 0%, #262626 100%); color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; border: 1px solid #404040; }
            .footer { background: #262626; padding: 24px; text-align: center; color: #737373; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 ATS Checker</div>
              <div style="color: #737373;">Welcome to the future of resume optimization</div>
            </div>
            <div class="content">
              <div class="greeting">Welcome aboard, ${user.name}! 🚀</div>
              <div class="message">
                Thank you for joining ATS Checker! You're now equipped with powerful AI-driven tools to optimize your resume for Applicant Tracking Systems.
                <br><br>
                <strong>What you can do:</strong><br>
                • Analyze resume compatibility with job descriptions<br>
                • Get detailed ATS optimization suggestions<br>
                • Track your improvement progress<br>
                • Export professional reports<br>
                <br>
                Ready to get started?
              </div>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">Start Your First Analysis →</a>
              </div>
            </div>
            <div class="footer">
              Need help? Contact us at support@atschecker.com
            </div>
          </div>
        </body>
        </html>
      `;

      const emailOptions = {
        to: user.email,
        subject: '🎯 Welcome to ATS Checker - Start Optimizing Your Resume!',
        html: welcomeEmailHtml
      };

      const result = await sendEmail(emailOptions);
      
      if (result.success) {
        console.log(`📧 Welcome email sent to ${user.email}`);
        return {
          success: true,
          messageId: result.messageId,
          previewUrl: result.previewUrl
        };
      } else {
        console.error('Failed to send welcome email:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Test email functionality
  static async sendTestEmail(userEmail) {
    try {
      const testEmailHtml = `
        <div style="font-family: Inter, sans-serif; background: #0A0A0A; color: #A3A3A3; padding: 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: #171717; padding: 32px; border-radius: 12px; border: 1px solid #262626;">
            <h2 style="color: #FFFFFF; margin-bottom: 16px;">📧 Email Test Successful!</h2>
            <p>Your ATS Checker email configuration is working correctly.</p>
            <p style="color: #737373; font-size: 14px; margin-top: 24px;">
              Sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `;

      const emailOptions = {
        to: userEmail,
        subject: '✅ ATS Checker Email Test',
        html: testEmailHtml
      };

      return await sendEmail(emailOptions);
    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
