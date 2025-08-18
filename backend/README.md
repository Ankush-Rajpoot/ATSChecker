# ATS Checker Backend

A comprehensive Node.js/Express backend for the ATS Resume Checker application.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Profile management
  - Plan-based usage limits

- **File Processing**
  - Support for PDF, DOC, DOCX, and TXT files
  - Text extraction from documents
  - File validation and security

- **ATS Analysis Engine**
  - Advanced resume analysis using NLP
  - Keyword matching and scoring
  - Skills analysis and gap identification
  - Section-by-section breakdown
  - Improvement suggestions

- **Report Management**
  - Detailed analysis reports
  - Report history and statistics
  - Export capabilities
  - User dashboard analytics

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret
   - File upload settings
   - CORS origins

3. **Start MongoDB:**
   Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### File Upload
- `POST /api/upload` - Upload and process resume file
- `GET /api/upload/status/:fileId` - Check file processing status
- `DELETE /api/upload/:fileId` - Delete uploaded file
- `GET /api/upload/supported-types` - Get supported file types

### ATS Analysis
- `POST /api/ats/analyze` - Analyze resume against job description
- `GET /api/ats/reports` - Get user's analysis reports
- `GET /api/ats/reports/:id` - Get specific report
- `PUT /api/ats/reports/:id` - Update report (notes, tags)
- `DELETE /api/ats/reports/:id` - Delete report
- `GET /api/ats/stats` - Get user statistics

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/usage` - Get usage statistics
- `POST /api/user/upgrade` - Upgrade user plan
- `DELETE /api/user/account` - Delete user account
- `GET /api/user/dashboard` - Get dashboard data

## Analysis Features

### Resume Analysis
- **Keyword Matching**: TF-IDF based keyword extraction and matching
- **Skills Analysis**: Technical and soft skills identification
- **Section Analysis**: Formatting, experience, education, skills evaluation
- **ATS Compatibility**: Readability and ATS-friendly format scoring

### Scoring Algorithm
The overall score is calculated using weighted components:
- Keywords (30%): Matching job description keywords
- Skills (25%): Technical and soft skills alignment
- Sections (45%): Individual section quality scores

### Suggestions Engine
Provides actionable improvement suggestions based on:
- Missing keywords from job description
- Skill gaps analysis
- Section-specific improvements
- Formatting recommendations

## Database Schema

### User Model
- Personal information (name, email, avatar)
- Authentication data (password hash)
- Plan and usage tracking
- Account status and verification

### Report Model
- File information and extracted text
- Job description and analysis parameters
- Comprehensive analysis results
- Scoring and suggestions
- Processing metadata

## Security Features

- **Authentication**: JWT with secure token management
- **Authorization**: Route-level access control
- **Rate Limiting**: API request throttling
- **File Validation**: Type and size restrictions
- **Input Sanitization**: XSS and injection prevention
- **CORS**: Configurable cross-origin policies

## Performance Optimizations

- **Text Processing**: Efficient NLP algorithms
- **Database Indexing**: Optimized query performance
- **File Handling**: Streaming for large files
- **Caching**: Analysis result caching
- **Compression**: Response compression

## Monitoring & Logging

- **Request Logging**: Morgan middleware for HTTP logs
- **Error Handling**: Centralized error management
- **Health Checks**: Application status endpoints
- **Performance Metrics**: Processing time tracking

## Development

### Project Structure
```
backend/
├── config/          # Database and configuration
├── middleware/      # Authentication, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API route handlers
├── utils/           # Utility functions (file processing, analysis)
├── uploads/         # File upload directory
├── server.js        # Main application entry point
└── package.json     # Dependencies and scripts
```

### Adding New Features

1. **New Routes**: Add to appropriate route file in `/routes`
2. **Database Changes**: Update models in `/models`
3. **Business Logic**: Add utilities in `/utils`
4. **Middleware**: Add reusable middleware in `/middleware`

### Testing

```bash
npm test
```

## Deployment

1. **Environment Setup**:
   - Set production environment variables
   - Configure MongoDB connection
   - Set up file storage (local or cloud)

2. **Build and Deploy**:
   ```bash
   npm install --production
   npm start
   ```

3. **Process Management**:
   Use PM2 or similar for production process management:
   ```bash
   pm2 start server.js --name ats-backend
   ```

## API Usage Examples

### Authentication
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
```

### File Upload and Analysis
```javascript
// Upload file
const formData = new FormData();
formData.append('file', resumeFile);

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

// Analyze resume
const analysisResponse = await fetch('/api/ats/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    extractedText: uploadResponse.data.extractedText,
    jobDescription: 'Job description text...',
    fileName: uploadResponse.data.fileName
  })
});
```

## License

MIT License - see LICENSE file for details.
