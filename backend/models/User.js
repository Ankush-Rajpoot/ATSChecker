const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required if using Google auth
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  avatar: {
    type: String,
    default: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  usage: {
    reportsGenerated: {
      type: Number,
      default: 0
    },
    monthlyLimit: {
      type: Number,
      default: 5 // Free plan limit
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Skip password hashing if password is not modified or user is using Google auth
  if (!this.isModified('password') || this.googleId) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Reset monthly usage if needed
userSchema.methods.checkAndResetMonthlyUsage = function() {
  const now = new Date();
  const lastReset = new Date(this.usage.lastResetDate);
  
  // If it's been more than 30 days, reset usage
  if (now.getTime() - lastReset.getTime() > 30 * 24 * 60 * 60 * 1000) {
    this.usage.reportsGenerated = 0;
    this.usage.lastResetDate = now;
    return true;
  }
  return false;
};

// Check if user can generate more reports
userSchema.methods.canGenerateReport = function() {
  this.checkAndResetMonthlyUsage();
  return this.usage.reportsGenerated < this.usage.monthlyLimit;
};

// Update plan limits
userSchema.methods.updatePlanLimits = function() {
  switch (this.plan) {
    case 'free':
      this.usage.monthlyLimit = 5;
      break;
    case 'premium':
      this.usage.monthlyLimit = 50;
      break;
    case 'enterprise':
      this.usage.monthlyLimit = 1000;
      break;
  }
};

module.exports = mongoose.model('User', userSchema);
