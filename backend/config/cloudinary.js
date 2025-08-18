const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload file to Cloudinary
 * @param {Buffer|string} fileBuffer - File buffer or file path
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    const defaultOptions = {
      folder: process.env.CLOUDINARY_FOLDER || 'ats-checker/resumes',
      resource_type: 'auto',
      format: 'pdf', // For document files
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...options
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
};

/**
 * Upload file from URL to Cloudinary
 * @param {string} url - File URL
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadFromUrl = async (url, options = {}) => {
  try {
    const defaultOptions = {
      folder: process.env.CLOUDINARY_FOLDER || 'ats-checker/resumes',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...options
    };

    const result = await cloudinary.uploader.upload(url, defaultOptions);
    return result;

  } catch (error) {
    console.error('Cloudinary URL upload error:', error);
    throw new Error('Failed to upload file from URL to cloud storage');
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw, auto)
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
};

/**
 * Get file details from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type
 * @returns {Promise<Object>} - File details
 */
const getFileDetails = async (publicId, resourceType = 'auto') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary get details error:', error);
    throw new Error('Failed to get file details from cloud storage');
  }
};

/**
 * Generate signed URL for secure access
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation and access options
 * @returns {string} - Signed URL
 */
const generateSignedUrl = (publicId, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      ...options
    };

    return cloudinary.utils.private_download_url(publicId, 'pdf', defaultOptions);
  } catch (error) {
    console.error('Cloudinary signed URL error:', error);
    throw new Error('Failed to generate secure access URL');
  }
};

/**
 * Get optimized URL for file delivery
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Image/document transformations
 * @returns {string} - Optimized URL
 */
const getOptimizedUrl = (publicId, transformations = {}) => {
  try {
    return cloudinary.url(publicId, {
      secure: true,
      resource_type: 'auto',
      fetch_format: 'auto',
      quality: 'auto',
      ...transformations
    });
  } catch (error) {
    console.error('Cloudinary optimized URL error:', error);
    throw new Error('Failed to generate optimized URL');
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file buffers with metadata
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleFiles = async (files, options = {}) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileOptions = {
        ...options,
        public_id: `${options.public_id_prefix || 'file'}_${index}_${Date.now()}`,
        ...file.options
      };
      
      return uploadToCloudinary(file.buffer, fileOptions);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple files upload error:', error);
    throw new Error('Failed to upload multiple files');
  }
};

/**
 * Create archive of multiple files
 * @param {Array} publicIds - Array of Cloudinary public IDs
 * @param {Object} options - Archive options
 * @returns {Promise<Object>} - Archive creation result
 */
const createArchive = async (publicIds, options = {}) => {
  try {
    const defaultOptions = {
      type: 'upload',
      target_format: 'zip',
      flatten_folders: true,
      ...options
    };

    const result = await cloudinary.utils.archive_url({
      resource_type: 'auto',
      public_ids: publicIds,
      ...defaultOptions
    });

    return result;
  } catch (error) {
    console.error('Create archive error:', error);
    throw new Error('Failed to create file archive');
  }
};

/**
 * Validate Cloudinary configuration
 * @returns {boolean} - Configuration validity
 */
const validateConfig = () => {
  const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      return false;
    }
  }
  
  return true;
};

/**
 * Test Cloudinary connection
 * @returns {Promise<boolean>} - Connection test result
 */
const testConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadFromUrl,
  deleteFromCloudinary,
  getFileDetails,
  generateSignedUrl,
  getOptimizedUrl,
  uploadMultipleFiles,
  createArchive,
  validateConfig,
  testConnection
};
