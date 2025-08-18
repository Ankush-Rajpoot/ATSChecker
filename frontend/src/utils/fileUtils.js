// File processing utilities
export const ALLOWED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  TXT: 'text/plain',
};

export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB

export const validateFile = (file) => {
  const errors = [];
  
  // Check file type
  const allowedTypes = Object.values(ALLOWED_FILE_TYPES);
  if (!allowedTypes.includes(file.type)) {
    errors.push('Please upload a PDF, DOC, DOCX, or TXT file');
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
  }
  
  // Check file name
  if (!file.name || file.name.trim() === '') {
    errors.push('File must have a valid name');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType) => {
  switch (fileType) {
    case ALLOWED_FILE_TYPES.PDF:
      return '📄';
    case ALLOWED_FILE_TYPES.DOCX:
    case ALLOWED_FILE_TYPES.DOC:
      return '📝';
    case ALLOWED_FILE_TYPES.TXT:
      return '📃';
    default:
      return '📁';
  }
};

export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (file.type === ALLOWED_FILE_TYPES.TXT) {
          resolve(event.target.result);
        } else {
          // For PDF/DOC files, in a real app you'd use libraries like pdf-parse
          // For demo purposes, we'll simulate text extraction
          setTimeout(() => {
            resolve('Sample extracted text from document...');
          }, 1000);
        }
      } catch (error) {
        reject(new Error('Failed to extract text from file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.type === ALLOWED_FILE_TYPES.TXT) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

// Generate mock resume text based on file name for demo
export const generateMockResumeText = (fileName) => {
  return `
JOHN SMITH
Software Engineer | Full Stack Developer
Email: john.smith@email.com | Phone: (555) 123-4567
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in JavaScript, React, Node.js, and MongoDB. 
Proven track record of building scalable web applications and leading development teams. 
Strong problem-solving skills and passion for clean, efficient code.

TECHNICAL SKILLS
• Frontend: JavaScript, React, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Python, RESTful APIs
• Databases: MongoDB, PostgreSQL, MySQL
• Tools: Git, Docker, AWS, Webpack, Jest
• Methodologies: Agile, Scrum, TDD

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc | 2021-Present
• Led development of customer-facing web applications serving 100K+ users
• Implemented microservices architecture reducing system load by 40%
• Mentored junior developers and conducted code reviews
• Collaborated with product managers to define technical requirements

Software Developer | StartupXYZ | 2019-2021
• Built responsive web applications using React and Node.js
• Designed and implemented RESTful APIs handling 10M+ requests daily
• Optimized database queries resulting in 50% performance improvement
• Participated in agile development process and sprint planning

EDUCATION
Bachelor of Science in Computer Science | University of California | 2019
• Relevant Coursework: Data Structures, Algorithms, Database Systems
• GPA: 3.8/4.0

PROJECTS
E-commerce Platform | React, Node.js, MongoDB
• Built full-stack e-commerce application with payment integration
• Implemented user authentication and order management system

Task Management App | Vue.js, Express, PostgreSQL
• Developed collaborative task management tool for teams
• Features include real-time updates, file sharing, and progress tracking
  `;
};