const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authMiddleware = require('../middleware/auth');
const { processAndUploadFile, deleteUploadedFile, validateFile, formatFileSize } = require('../utils/fileProcessorCloudinary');
const { validateConfig, testConnection } = require('../config/cloudinary');

const router = express.Router();

// Validate Cloudinary configuration on startup
if (!validateConfig()) {
  console.error('❌ Cloudinary configuration is incomplete');
}

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

// @desc    Upload and process resume file with Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const { originalname, buffer, size, mimetype } = req.file;
    
    console.log(`Processing file: ${originalname} (${mimetype}) - ${formatFileSize(size)}`);
    
    // Validate file
    const validation = validateFile(req.file);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        errors: validation.errors
      });
    }
    
    // Process file and upload to Cloudinary
    const result = await processAndUploadFile(buffer, {
      originalname,
      mimetype,
      size
    }, {
      uploadOptions: {
        context: {
          user_id: req.user._id.toString(),
          uploaded_by: req.user.email
        }
      }
    });
    
    // File processing successful
    res.json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        fileId: result.cloudinary.publicId,
        originalName: originalname,
        fileName: result.cloudinary.publicId,
        fileSize: size,
        fileType: mimetype,
        extractedText: result.extractedText,
        textLength: result.extractedText.length,
        wordCount: result.textMetadata.wordCount,
        estimatedReadingTime: result.textMetadata.estimatedReadingTime,
        cloudinaryUrl: result.cloudinary.secureUrl,
        cloudinaryPublicId: result.cloudinary.publicId,
        uploadedAt: new Date().toISOString(),
        processingMetadata: result.textMetadata
      }
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    
    // Return appropriate error message
    if (error.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the maximum limit of 10MB'
      });
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only'
      });
    }
    
    if (error.message.includes('No readable text')) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract readable text from the file. Please ensure the file contains text content'
      });
    }
    
    if (error.message.includes('too short')) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded file appears to be too short to be a valid resume'
      });
    }
    
    if (error.message.includes('Cloudinary') || error.message.includes('cloud storage')) {
      return res.status(503).json({
        success: false,
        message: 'File storage service temporarily unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error processing uploaded file'
    });
  }
});

// @desc    Get upload status from Cloudinary
// @route   GET /api/upload/status/:publicId
// @access  Private
router.get('/status/:publicId', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Try to get file details from Cloudinary
    const { getFileDetails } = require('../config/cloudinary');
    
    try {
      const fileDetails = await getFileDetails(publicId);
      res.json({
        success: true,
        data: {
          publicId,
          exists: true,
          url: fileDetails.secure_url,
          format: fileDetails.format,
          bytes: fileDetails.bytes,
          createdAt: fileDetails.created_at,
          version: fileDetails.version,
          context: fileDetails.context
        }
      });
    } catch (error) {
      if (error.http_code === 404) {
        res.json({
          success: true,
          data: {
            publicId,
            exists: false
          }
        });
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking file status'
    });
  }
});

// @desc    Delete uploaded file from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
router.delete('/:publicId', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    try {
      const result = await deleteUploadedFile(publicId);
      res.json({
        success: true,
        message: 'File deleted successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

// @desc    Test Cloudinary connection
// @route   GET /api/upload/test-connection
// @access  Private (Admin only - you might want to add admin middleware)
router.get('/test-connection', authMiddleware, async (req, res) => {
  try {
    const isConnected = await testConnection();
    
    res.json({
      success: true,
      data: {
        cloudinary: {
          connected: isConnected,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'Not configured',
          folder: process.env.CLOUDINARY_FOLDER || 'ats-checker/resumes'
        }
      }
    });
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing connection'
    });
  }
});

// @desc    Get supported file types
// @route   GET /api/upload/supported-types
// @access  Public
router.get('/supported-types', (req, res) => {
  res.json({
    success: true,
    data: {
      supportedTypes: [
        {
          type: 'application/pdf',
          extension: '.pdf',
          name: 'PDF Document'
        },
        {
          type: 'application/msword',
          extension: '.doc',
          name: 'Microsoft Word Document (Legacy)'
        },
        {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          extension: '.docx',
          name: 'Microsoft Word Document'
        },
        {
          type: 'text/plain',
          extension: '.txt',
          name: 'Plain Text File'
        }
      ],
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
      maxFileSizeFormatted: '10 MB',
      storage: {
        provider: 'Cloudinary',
        secure: true,
        cdn: true
      }
    }
  });
});

module.exports = router;
