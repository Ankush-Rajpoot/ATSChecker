const nodemailer = require('nodemailer');

// Email configuration
const createEmailTransporter = () => {
  const config = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  // For development, use Ethereal Email (fake SMTP)
  if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
    console.log('⚠️  Email credentials not configured, using Ethereal Email for development');
    return null; // Will be handled by createTestAccount
  }

  return nodemailer.createTransport(config);
};

// Create test account for development
const createTestTransporter = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    console.log('📧 Using Ethereal Email for testing:');
    console.log('   User:', testAccount.user);
    console.log('   Pass:', testAccount.pass);

    return transporter;
  } catch (error) {
    console.error('Failed to create test email account:', error);
    return null;
  }
};

// Get email transporter
const getEmailTransporter = async () => {
  const transporter = createEmailTransporter();
  
  if (!transporter) {
    return await createTestTransporter();
  }

  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
    return transporter;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    console.log('📧 Falling back to Ethereal Email for testing...');
    return await createTestTransporter();
  }
};

// Send email utility
const sendEmail = async (options) => {
  try {
    console.log('📧 === SEND EMAIL FUNCTION CALLED ===');
    console.log('📧 Email options:', {
      to: options.to,
      subject: options.subject,
      htmlLength: options.html ? options.html.length : 0,
      attachments: options.attachments ? options.attachments.length : 0
    });

    console.log('📧 Getting email transporter...');
    const transporter = await getEmailTransporter();
    
    if (!transporter) {
      console.error('❌ No email transporter available');
      return { success: false, error: 'Email service not available' };
    }

    console.log('✅ Email transporter obtained successfully');

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ATS Checker <noreply@atschecker.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || []
    };

    console.log('📧 Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    console.log('📧 Sending email via transporter...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    
    // For Ethereal Email, log the preview URL
    if (process.env.NODE_ENV === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Email preview URL:', previewUrl);
      }
    }

    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return { success: false, error: error.message };
  }
};

// Validate email configuration
const validateEmailConfig = () => {
  const requiredVars = ['EMAIL_USER', 'EMAIL_PASS'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  Missing email configuration:', missing.join(', '));
    return false;
  }
  
  return true;
};

module.exports = {
  sendEmail,
  validateEmailConfig,
  getEmailTransporter
};
