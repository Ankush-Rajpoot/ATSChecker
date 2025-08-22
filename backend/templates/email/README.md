# Email Template System

A production-grade email template system for ATS Checker that provides consistent, professional, and responsive email templates.

## Features

- 🎨 **Professional Design**: Dark theme with modern styling
- 📱 **Responsive**: Mobile-friendly layouts
- 🔧 **Modular**: Separate templates for different email types
- ✅ **Validation**: Built-in data validation and error handling
- 🎯 **Type Safety**: Clear interfaces and documentation
- 🔄 **Reusable**: Component-based architecture
- ⚡ **Performance**: Optimized HTML and CSS

## Template Types

### 1. Report Email Template (`ReportEmailTemplate`)
Used for ATS analysis completion emails.

```javascript
const emailService = require('./services/emailService');

await emailService.sendReportEmail(user, report, dashboardStats);
```

**Features:**
- Score visualization with color coding
- Skills analysis (matched/missing)
- Optimization suggestions
- Progress tracking integration
- Professional report card design

### 2. Dashboard Email Template (`DashboardEmailTemplate`)
Used for periodic dashboard summaries.

```javascript
await emailService.sendDashboardEmail(user, dashboardData);
```

**Features:**
- Performance statistics grid
- Recent reports overview
- Achievement highlights
- Personalized insights
- Trend analysis

### 3. Welcome Email Template (`WelcomeEmailTemplate`)
Used for new user onboarding.

```javascript
await emailService.sendWelcomeEmail(user);
```

**Features:**
- Feature highlights
- Getting started guide
- Pro tips section
- Clear call-to-action
- Professional welcome design

### 4. Notification Email Template (`NotificationEmailTemplate`)
Used for system notifications, alerts, and test emails.

```javascript
// Test email
await emailService.sendTestEmail(userEmail);

// Maintenance notification
await emailService.sendMaintenanceNotification(user, maintenanceInfo);

// Error notification
await emailService.sendErrorNotification(user, errorInfo);

// Custom notification
await emailService.sendCustomNotification(user, notificationData);
```

**Features:**
- Multiple notification types (success, warning, error, info)
- System information display
- Timestamp tracking
- Status badges
- Flexible content structure

## Usage

### Basic Usage

```javascript
const { emailTemplateFactory } = require('./templates/email');

// Generate email HTML
const emailResult = emailTemplateFactory.safeGenerateEmail('report', {
  user: { name: 'John Doe', email: 'john@example.com' },
  report: { fileName: 'resume.pdf', score: 85, ... },
  dashboardStats: { totalReports: 5, averageScore: 78, ... }
});

if (emailResult.success) {
  // Send email using your email service
  await sendEmail({
    to: user.email,
    subject: 'Analysis Complete',
    html: emailResult.html
  });
}
```

### Using Email Service

```javascript
const EmailService = require('./services/emailService');

// Send different types of emails
await EmailService.sendReportEmail(user, report, dashboardStats);
await EmailService.sendDashboardEmail(user, dashboardData);
await EmailService.sendWelcomeEmail(user);
await EmailService.sendTestEmail(userEmail);
```

### Advanced Usage

```javascript
const { EmailTemplateFactory } = require('./templates/email');

// Create factory with custom configuration
const factory = new EmailTemplateFactory({
  brandName: 'Custom Brand',
  accentColor: '#FF6B6B',
  frontendUrl: 'https://custom-domain.com'
});

// Generate custom email
const template = factory.getTemplate('notification');
const html = template.generateCustomNotification({
  type: 'success',
  title: 'Account Verified',
  message: 'Your account has been successfully verified!',
  actionUrl: 'https://app.example.com/dashboard',
  actionText: 'Go to Dashboard'
});
```

## Configuration

Templates can be configured through the `config.js` file:

```javascript
const { emailConfig, updateConfig } = require('./templates/email/config');

// Update brand configuration
updateConfig('brand.name', 'My Custom Brand');
updateConfig('theme.colors.accent', '#FF6B6B');

// Access configuration
const brandName = getConfig('brand.name');
const accentColor = getConfig('theme.colors.accent');
```

### Environment Variables

```bash
# Brand Configuration
BRAND_NAME="ATS Checker"
BRAND_TAGLINE="AI-Powered Resume Optimization"
FRONTEND_URL="https://atschecker.com"
SUPPORT_EMAIL="support@atschecker.com"

# Email Configuration
EMAIL_FROM_NAME="ATS Checker"
EMAIL_REPLY_TO="noreply@atschecker.com"
ENABLE_EMAIL_NOTIFICATIONS="true"

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_CUSTOM_BRANDING="false"
ENABLE_TEMPLATE_CACHING="true"
```

## Data Validation

The system includes built-in validation for all email types:

```javascript
const validation = emailTemplateFactory.validateEmailData('report', {
  user: { name: 'John', email: 'john@example.com' },
  report: { fileName: 'resume.pdf', score: 85 }
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## Error Handling

All email generation includes comprehensive error handling:

```javascript
const result = emailTemplateFactory.safeGenerateEmail('report', data);

if (!result.success) {
  console.error('Email generation failed:', result.error);
  // Handle error appropriately
} else {
  // Use result.html for email content
  console.log('Email generated successfully');
}
```

## Template Structure

```
templates/
├── email/
│   ├── EmailTemplate.js          # Base template class
│   ├── ReportEmailTemplate.js    # Report completion emails
│   ├── DashboardEmailTemplate.js # Dashboard summary emails
│   ├── WelcomeEmailTemplate.js   # User onboarding emails
│   ├── NotificationEmailTemplate.js # System notifications
│   ├── config.js                 # Configuration file
│   ├── index.js                  # Factory and exports
│   └── README.md                 # This documentation
```

## Best Practices

1. **Always validate data** before generating emails
2. **Use the factory pattern** for consistent template creation
3. **Handle errors gracefully** with proper fallbacks
4. **Test email templates** in different clients
5. **Keep templates responsive** for mobile compatibility
6. **Use semantic HTML** for better accessibility
7. **Optimize images** and minimize CSS for performance

## Testing

Test emails can be sent using the notification template:

```javascript
await EmailService.sendTestEmail('test@example.com');
```

This will send a comprehensive test email that verifies:
- Template rendering
- Email configuration
- SMTP connectivity
- Responsive design

## Migration from Old System

If migrating from the old `emailTemplates.js` system:

1. **Replace imports**:
   ```javascript
   // Old
   const { generateReportEmailHTML } = require('../utils/emailTemplates');
   
   // New
   const { emailTemplateFactory } = require('../templates/email');
   ```

2. **Update function calls**:
   ```javascript
   // Old
   const html = generateReportEmailHTML(user, report, stats);
   
   // New
   const result = emailTemplateFactory.safeGenerateEmail('report', {
     user, report, dashboardStats: stats
   });
   const html = result.success ? result.html : null;
   ```

3. **Add error handling**:
   ```javascript
   if (!result.success) {
     console.error('Email generation failed:', result.error);
     return { success: false, error: result.error };
   }
   ```

## Performance Considerations

- Templates are optimized for fast rendering
- CSS is inlined for email client compatibility
- Images should be hosted externally
- Consider caching for high-volume scenarios
- Monitor email size (keep under 100KB)

## Browser/Email Client Support

Tested and optimized for:
- Gmail (web, mobile, desktop)
- Outlook (web, desktop, mobile)
- Apple Mail (macOS, iOS)
- Yahoo Mail
- Mozilla Thunderbird
- Samsung Email
- Default Android Email

## Contributing

When adding new templates:

1. Extend the base `EmailTemplate` class
2. Add template-specific styles
3. Include validation logic
4. Update the factory class
5. Add tests and documentation
6. Follow existing naming conventions
