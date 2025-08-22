/**
 * Email Template Configuration
 * Centralized configuration for all email templates
 */

const emailConfig = {
  // Brand Configuration
  brand: {
    name: process.env.BRAND_NAME || 'ATS Checker',
    tagline: process.env.BRAND_TAGLINE || 'AI-Powered Resume Optimization',
    logo: process.env.BRAND_LOGO_URL || null,
    website: process.env.FRONTEND_URL || 'https://atschecker.com',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@atschecker.com'
  },

  // Theme Configuration
  theme: {
    colors: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
      accent: '#22C55E',
      background: '#0A0A0A',
      cardBackground: '#171717',
      border: '#262626',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      info: '#3B82F6'
    },
    
    typography: {
      fontFamily: 'Inter',
      fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '18px',
        heading: '24px'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },

    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px',
      xlarge: '32px'
    },

    borderRadius: {
      small: '6px',
      medium: '8px',
      large: '12px',
      xlarge: '16px'
    }
  },

  // Template-specific configurations
  templates: {
    report: {
      showSkillsAnalysis: true,
      showSuggestions: true,
      maxSkillsToShow: 10,
      maxSuggestionsToShow: 5,
      includeProgressStats: true
    },

    dashboard: {
      showRecentReports: true,
      maxRecentReports: 5,
      showAchievements: true,
      showInsights: true,
      includeTrends: true
    },

    welcome: {
      showGettingStarted: true,
      showFeatures: true,
      showProTips: true,
      includeQuickStart: true
    },

    notification: {
      includeTimestamp: true,
      showSystemInfo: true,
      enableRichFormatting: true
    }
  },

  // Feature flags
  features: {
    darkMode: true,
    responsiveDesign: true,
    advancedAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    customBranding: process.env.ENABLE_CUSTOM_BRANDING === 'true',
    previewMode: process.env.NODE_ENV === 'development'
  },

  // Default email settings
  defaults: {
    fromName: process.env.EMAIL_FROM_NAME || 'ATS Checker',
    replyTo: process.env.EMAIL_REPLY_TO || process.env.SUPPORT_EMAIL || 'noreply@atschecker.com',
    timezone: process.env.TIMEZONE || 'UTC',
    dateFormat: 'MMMM DD, YYYY',
    timeFormat: 'h:mm A'
  },

  // Social links (optional)
  social: {
    twitter: process.env.SOCIAL_TWITTER || null,
    linkedin: process.env.SOCIAL_LINKEDIN || null,
    facebook: process.env.SOCIAL_FACEBOOK || null,
    github: process.env.SOCIAL_GITHUB || null
  },

  // Legal links
  legal: {
    privacy: `${process.env.FRONTEND_URL || 'https://atschecker.com'}/privacy`,
    terms: `${process.env.FRONTEND_URL || 'https://atschecker.com'}/terms`,
    unsubscribe: `${process.env.FRONTEND_URL || 'https://atschecker.com'}/unsubscribe`
  },

  // Performance settings
  performance: {
    enableCaching: process.env.ENABLE_TEMPLATE_CACHING === 'true',
    cacheTimeout: parseInt(process.env.TEMPLATE_CACHE_TIMEOUT) || 3600, // 1 hour
    enableMinification: process.env.NODE_ENV === 'production',
    enableGzip: process.env.NODE_ENV === 'production'
  }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  emailConfig.brand.name = `[DEV] ${emailConfig.brand.name}`;
  emailConfig.features.previewMode = true;
}

if (process.env.NODE_ENV === 'test') {
  emailConfig.brand.name = `[TEST] ${emailConfig.brand.name}`;
  emailConfig.defaults.fromName = `[TEST] ${emailConfig.defaults.fromName}`;
}

// Validation function
function validateConfig() {
  const errors = [];

  if (!emailConfig.brand.name) {
    errors.push('Brand name is required');
  }

  if (!emailConfig.brand.website) {
    errors.push('Brand website is required');
  }

  if (!emailConfig.brand.supportEmail) {
    errors.push('Support email is required');
  }

  if (errors.length > 0) {
    throw new Error(`Email configuration validation failed: ${errors.join(', ')}`);
  }

  return true;
}

// Helper functions
function getConfig(path) {
  return path.split('.').reduce((obj, key) => obj && obj[key], emailConfig);
}

function updateConfig(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => {
    if (!obj[key]) obj[key] = {};
    return obj[key];
  }, emailConfig);
  
  target[lastKey] = value;
}

// Export configuration and utilities
module.exports = {
  emailConfig,
  validateConfig,
  getConfig,
  updateConfig
};
