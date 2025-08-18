const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    console.log('🔍 Validation - Request body:', JSON.stringify(req.body, null, 2));
    
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      console.error('❌ Validation failed:', errorMessage);
      console.error('❌ Error details:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    console.log('✅ Validation passed');
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    avatar: Joi.string().uri().optional(),
    currentPassword: Joi.string().min(6).optional(),
    newPassword: Joi.string().min(6).optional()
  }).with('newPassword', 'currentPassword'),

  analyzeResume: Joi.object({
    jobDescription: Joi.string().min(50).required().messages({
      'string.empty': 'Job description is required',
      'string.min': 'Job description must be at least 50 characters'
    }),
    fileId: Joi.string().optional(),
    fileName: Joi.string().optional(),
    extractedText: Joi.string().min(100).required().messages({
      'string.empty': 'Extracted text is required',
      'string.min': 'Resume text must be at least 100 characters'
    }),
    cloudinaryPublicId: Joi.string().optional(),
    cloudinaryUrl: Joi.string().uri().optional(),
    fileSize: Joi.number().optional(),
    fileType: Joi.string().optional()
  })
};

module.exports = {
  validate,
  schemas
};
