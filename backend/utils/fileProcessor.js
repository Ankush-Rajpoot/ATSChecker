const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

/**
 * Extract text from various file types
 * @param {string} filePath - Path to the file
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (filePath, fileType) => {
  try {
    switch (fileType) {
      case 'application/pdf':
        return await extractFromPDF(filePath);
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractFromWord(filePath);
      
      case 'text/plain':
        return await extractFromText(filePath);
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};

/**
 * Extract text from PDF files
 */
const extractFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No readable text found in PDF');
    }
    
    return cleanText(data.text);
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from Word documents
 */
const extractFromWord = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No readable text found in Word document');
    }
    
    return cleanText(result.value);
  } catch (error) {
    throw new Error(`Word document extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from plain text files
 */
const extractFromText = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    
    if (!text || text.trim().length === 0) {
      throw new Error('Text file is empty');
    }
    
    return cleanText(text);
  } catch (error) {
    throw new Error(`Text file extraction failed: ${error.message}`);
  }
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
    /objective/i
  ];
  
  const foundSections = commonSections.filter(pattern => pattern.test(cleanedText));
  
  if (foundSections.length < 2) {
    console.warn('Warning: Text may not be a resume format');
  }
  
  return cleanedText;
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

module.exports = {
  extractText,
  validateExtractedText,
  getFileMetadata,
  formatFileSize,
  cleanText
};
