const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/User');
const { validate, schemas } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');
const EmailService = require('../services/emailService');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authLimiter, validate(schemas.register), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Update plan limits and save
    user.updatePlanLimits();
    await user.save();

    // Generate token
    const token = generateToken(user._id);
    
    // Send welcome email (async, don't wait for completion)
    setTimeout(async () => {
      try {
        const emailResult = await EmailService.sendWelcomeEmail(user);
        if (emailResult.success) {
          console.log('📧 Welcome email sent to:', user.email);
          if (emailResult.previewUrl) {
            console.log('📧 Email preview:', emailResult.previewUrl);
          }
        } else {
          console.log('📧 Welcome email failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('📧 Welcome email error:', emailError);
      }
    }, 100);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          avatar: user.avatar,
          joinedAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for duplicate key error (user already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authLimiter, validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          avatar: user.avatar,
          joinedAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login'
    });
  }
});

// @desc    Logout user (client-side token invalidation)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  // In a more complex setup, you might maintain a blacklist of tokens
  // For now, we rely on client-side token removal
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    // Generate new token
    const newToken = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

// @desc    Get current user (verify token)
// @route   GET /api/auth/me
// @access  Private
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          avatar: user.avatar,
          joinedAt: user.createdAt,
          lastLogin: user.lastLogin,
          usage: user.usage
        }
      }
    });
    
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user information'
    });
  }
});

// @desc    Google OAuth - Initiate
// @route   GET /api/auth/google
// @access  Public
// @desc    Google OAuth - Initiate
// @route   GET /api/auth/google
// @access  Public
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured on this server'
    });
  }
  
  // Log the OAuth initiation for debugging
  console.log('🔐 Initiating Google OAuth flow...');
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// @desc    Google OAuth - Callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendURL}/login?error=oauth_not_configured`);
  }

  passport.authenticate('google', { session: false }, async (err, userData) => {
    try {
      if (err || !userData) {
        console.error('Google OAuth callback error:', err);
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendURL}/login?error=oauth_failed`);
      }

      const { user, isNewUser } = userData;
      console.log('🔐 Google OAuth callback - User:', user.email, 'New user:', isNewUser);

      // Update last login
      user.lastLogin = new Date();
      user.updatePlanLimits();
      await user.save();

      // Send welcome email for new Google users (async, don't wait for completion)
      if (isNewUser) {
        setTimeout(async () => {
          try {
            console.log('📧 Sending welcome email to new Google user:', user.email);
            const emailResult = await EmailService.sendWelcomeEmail(user);
            if (emailResult.success) {
              console.log('✅ Welcome email sent to Google user:', user.email);
              if (emailResult.previewUrl) {
                console.log('📧 Email preview:', emailResult.previewUrl);
              }
            } else {
              console.log('❌ Welcome email failed for Google user:', emailResult.error);
            }
          } catch (emailError) {
            console.error('❌ Welcome email error for Google user:', emailError);
          }
        }, 100);
      }

      // Generate token
      const token = generateToken(user._id);

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendURL}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatar: user.avatar,
        joinedAt: user.createdAt,
        isNewUser
      }))}`);

    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendURL}/login?error=oauth_failed`);
    }
  })(req, res, next);
});

module.exports = router;
