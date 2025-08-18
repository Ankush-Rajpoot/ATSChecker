const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authMiddleware = require('../middleware/auth');
const { extractText, validateExtractedText } = require('../utils/fileProcessor');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${extension}`);
  }
});

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

// @desc    Upload and process resume file
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
    
    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    
    console.log(`Processing file: ${originalname} (${mimetype})`);
    
    // Extract text from the uploaded file
    const extractedText = await extractText(filePath, mimetype);
    
    // Validate extracted text
    const validatedText = validateExtractedText(extractedText);
    
    // File processing successful
    res.json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        fileId: filename,
        originalName: originalname,
        fileName: filename,
        fileSize: size,
        fileType: mimetype,
        extractedText: validatedText,
        textLength: validatedText.length,
        uploadedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up the uploaded file if processing failed
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    
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
    
    res.status(500).json({
      success: false,
      message: 'Error processing uploaded file'
    });
  }
});

// @desc    Get upload status
// @route   GET /api/upload/status/:fileId
// @access  Private
router.get('/status/:fileId', authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(__dirname, '../uploads', fileId);
    
    try {
      const stats = await fs.stat(filePath);
      res.json({
        success: true,
        data: {
          fileId,
          exists: true,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        }
      });
    } catch (error) {
      res.json({
        success: true,
        data: {
          fileId,
          exists: false
        }
      });
    }
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking file status'
    });
  }
});

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:fileId
// @access  Private
router.delete('/:fileId', authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(__dirname, '../uploads', fileId);
    
    try {
      await fs.unlink(filePath);
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
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
      maxFileSizeFormatted: '10 MB'
    }
  });
});

module.exports = router;
