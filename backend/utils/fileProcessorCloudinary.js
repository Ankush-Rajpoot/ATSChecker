const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const https = require('https');
const http = require('http');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Extract text from various file types
 * @param {string|Buffer} source - File path, URL, or buffer
 * @param {string} fileType - MIME type of the file
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} - Extracted text and metadata
 */
const extractText = async (source, fileType, options = {}) => {
  try {
    let buffer;
    let metadata = {
      source: typeof source === 'string' ? 'file' : 'buffer',
      type: fileType,
      processedAt: new Date().toISOString()
    };

    // Handle different source types
    if (typeof source === 'string') {
      if (source.startsWith('http')) {
        // URL source
        buffer = await downloadFile(source);
        metadata.source = 'url';
        metadata.url = source;
      } else {
        // File path source
        buffer = await fs.readFile(source);
        metadata.filePath = source;
      }
    } else {
      // Buffer source
      buffer = source;
    }

    let extractedText;
    let additionalMetadata = {};

    switch (fileType) {
      case 'application/pdf':
        const pdfResult = await extractFromPDF(buffer);
        extractedText = pdfResult.text;
        additionalMetadata = {
          pageCount: pdfResult.numpages,
          info: pdfResult.info,
          metadata: pdfResult.metadata
        };
        break;
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const wordResult = await extractFromWord(buffer);
        extractedText = wordResult.text;
        additionalMetadata = {
          messages: wordResult.messages,
          styleMap: wordResult.styleMap
        };
        break;
      
      case 'text/plain':
        extractedText = buffer.toString('utf8');
        break;
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    const cleanedText = cleanText(extractedText);
    const validatedText = validateExtractedText(cleanedText);

    return {
      text: validatedText,
      metadata: {
        ...metadata,
        ...additionalMetadata,
        originalLength: extractedText.length,
        cleanedLength: validatedText.length,
        wordCount: validatedText.split(/\s+/).length,
        estimatedReadingTime: Math.ceil(validatedText.split(/\s+/).length / 200) // 200 WPM
      }
    };

  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};

/**
 * Extract text from PDF files
 */
const extractFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer, {
      // PDF parsing options
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No readable text found in PDF');
    }
    
    return {
      text: data.text,
      numpages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from Word documents
 */
const extractFromWord = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No readable text found in Word document');
    }
    
    return {
      text: result.value,
      messages: result.messages,
      styleMap: result.styleMap
    };
  } catch (error) {
    throw new Error(`Word document extraction failed: ${error.message}`);
  }
};

/**
 * Download file from URL
 */
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
};

/**
 * Clean and normalize extracted text
 */
const cleanText = (text) => {
  return text
    // Remove extra whitespace and normalize line breaks
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    // Remove special characters that might cause issues
    .replace(/[^\w\s\n\-.,;:()\[\]{}@#$%&*+=<>?/\\|~`'"]/g, '')
    // Remove multiple consecutive spaces
    .replace(/\s{2,}/g, ' ')
    // Trim whitespace
    .trim();
};

/**
 * Validate extracted text
 */
const validateExtractedText = (text) => {
  const minLength = 100; // Minimum expected resume length
  const maxLength = 50000; // Maximum reasonable resume length
  
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text content');
  }
  
  const cleanedText = text.trim();
  
  if (cleanedText.length < minLength) {
    throw new Error(`Resume content too short (minimum ${minLength} characters required)`);
  }
  
  if (cleanedText.length > maxLength) {
    throw new Error(`Resume content too long (maximum ${maxLength} characters allowed)`);
  }
  
  // Check for common resume sections to validate it's actually a resume
  const commonSections = [
    /experience/i,
    /education/i,
    /skills/i,
    /work/i,
    /employment/i,
    /qualification/i,
    /summary/i,
    /objective/i,
    /contact/i,
    /phone/i,
    /email/i
  ];
  
  const foundSections = commonSections.filter(pattern => pattern.test(cleanedText));
  
  if (foundSections.length < 2) {
    console.warn('Warning: Text may not be a resume format - found sections:', foundSections.length);
  }
  
  return cleanedText;
};

/**
 * Process and upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {Object} fileMetadata - File metadata
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} - Processing result with Cloudinary URL
 */
const processAndUploadFile = async (fileBuffer, fileMetadata, options = {}) => {
  try {
    const { originalname, mimetype, size } = fileMetadata;
    
    // Extract text first
    const extractionResult = await extractText(fileBuffer, mimetype);
    
    // Upload to Cloudinary
    const uploadOptions = {
      public_id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resource_type: 'auto',
      folder: process.env.CLOUDINARY_FOLDER || 'ats-checker/resumes',
      context: {
        original_name: originalname,
        file_size: size.toString(),
        mime_type: mimetype,
        processed_at: new Date().toISOString(),
        word_count: extractionResult.metadata.wordCount.toString()
      },
      ...options.uploadOptions
    };
    
    const uploadResult = await uploadToCloudinary(fileBuffer, uploadOptions);
    
    return {
      success: true,
      extractedText: extractionResult.text,
      textMetadata: extractionResult.metadata,
      cloudinary: {
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        url: uploadResult.url,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
        bytes: uploadResult.bytes,
        createdAt: uploadResult.created_at,
        etag: uploadResult.etag,
        version: uploadResult.version
      },
      fileMetadata: {
        originalName: originalname,
        size: size,
        type: mimetype,
        processedAt: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('File processing and upload error:', error);
    throw new Error(`Failed to process and upload file: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
const deleteUploadedFile = async (publicId) => {
  try {
    const result = await deleteFromCloudinary(publicId);
    return {
      success: true,
      publicId,
      result
    };
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get file metadata for analysis
 */
const getFileMetadata = (filePath, fileType, fileSize) => {
  return {
    path: filePath,
    type: fileType,
    size: fileSize,
    sizeFormatted: formatFileSize(fileSize),
    extractedAt: new Date().toISOString()
  };
};

/**
 * Format file size for display
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file before processing
 */
const validateFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
  
  const errors = [];
  
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.');
  }
  
  if (file.size > maxSize) {
    errors.push(`File size too large. Maximum size allowed is ${formatFileSize(maxSize)}.`);
  }
  
  if (!file.originalname || file.originalname.trim() === '') {
    errors.push('File must have a valid name.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Extract keywords from text for better analysis
 */
const extractKeywords = (text) => {
  try {
    // Basic keyword extraction - can be enhanced with NLP libraries
    const words = text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !/^\d+$/.test(word)) // Remove pure numbers
      .filter(word => !/^[^\w\s]/.test(word)); // Remove words starting with symbols
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Sort by frequency and return top keywords
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50) // Top 50 keywords
      .map(([word, count]) => ({ word, count }));
    
    return sortedWords;
  } catch (error) {
    console.error('Keyword extraction error:', error);
    return [];
  }
};

module.exports = {
  extractText,
  processAndUploadFile,
  deleteUploadedFile,
  validateExtractedText,
  getFileMetadata,
  formatFileSize,
  cleanText,
  validateFile,
  extractKeywords
};
