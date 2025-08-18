import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateFile, formatFileSize, getFileIcon } from '../../utils/fileUtils';

const FileUpload = ({ onFileSelect, accept = ".pdf,.doc,.docx,.txt", maxSize = 10485760, className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file) => {
    setError(null);
    
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setUploadedFile(file);
    onFileSelect(file);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    onFileSelect(null);
    // Reset input value
    const input = document.getElementById('file-input');
    if (input) input.value = '';
  };

  return (
    <div className={className}>
      {!uploadedFile ? (
        <motion.div
          className={`relative border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-accent-300 bg-dark-400/50' 
              : error 
                ? 'border-red-500 bg-red-900/20'
                : 'border-dark-500 hover:border-dark-600 hover:bg-dark-400/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              className={`mx-auto w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center ${
                dragActive ? 'bg-dark-500' : 'bg-dark-400'
              }`}
              animate={{ 
                scale: dragActive ? 1.1 : 1,
                rotate: dragActive ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Upload className={`w-6 sm:w-8 h-6 sm:h-8 ${dragActive ? 'text-accent-300' : 'text-dark-700'}`} />
            </motion.div>
            
            <div>
              <h3 className={`text-base sm:text-lg font-medium ${dragActive ? 'text-accent-400' : 'text-accent-400'}`}>
                {dragActive ? 'Drop your file here' : 'Upload your resume'}
              </h3>
              <p className="text-dark-700 mt-1 sm:mt-2 text-sm sm:text-base">
                <span className="hidden sm:inline">Drag and drop your file here, or click to browse</span>
                <span className="sm:hidden">Tap to select your resume file</span>
              </p>
              <p className="text-xs sm:text-sm text-dark-700 mt-1 sm:mt-2">
                Supports PDF, DOC, DOCX, TXT • Max {formatFileSize(maxSize)}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-400 bg-red-900/20 px-3 sm:px-4 py-2 rounded-lg border border-red-500/50"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{error}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-300 border border-dark-500 rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-dark-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">{getFileIcon(uploadedFile.type)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-accent-400 truncate text-sm sm:text-base">{uploadedFile.name}</h4>
                <p className="text-xs sm:text-sm text-dark-700">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
              <motion.button
                onClick={removeFile}
                className="p-1 text-dark-700 hover:text-red-400 transition-colors rounded-full hover:bg-dark-400"
                title="Remove file"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;