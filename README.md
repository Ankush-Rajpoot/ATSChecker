# ATS Resume Checker

A comprehensive full-stack application that analyzes resumes against job descriptions to provide ATS (Applicant Tracking System) compatibility scores and improvement suggestions.

## 🚀 Features

### Core Functionality
- **Resume Analysis**: Upload resumes in PDF, DOC, DOCX, or TXT format
- **ATS Compatibility Scoring**: Get detailed scores on how well your resume matches job requirements
- **Keyword Matching**: Analyze keyword density and relevance
- **Skills Gap Analysis**: Identify missing skills and highlight matched ones
- **Format Analysis**: Check resume structure and ATS-friendly formatting
- **Improvement Suggestions**: Get actionable recommendations to improve your resume

### Backend Features
- **Cloudinary Integration**: Secure cloud storage for uploaded files
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Report Management**: Save and retrieve analysis reports
- **Rate Limiting**: API protection against abuse
- **File Processing**: Support for multiple document formats
- **Database Integration**: MongoDB with Mongoose ODM

### Frontend Features
- **Modern React UI**: Built with React 18 and TypeScript
- **Responsive Design**: TailwindCSS for mobile-first design
- **Interactive Dashboard**: View analysis history and statistics
- **Real-time Feedback**: Live analysis progress indicators
- **Drag & Drop Upload**: Intuitive file upload experience

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Cloudinary** for file storage
- **JWT** for authentication
- **Natural** & **Compromise** for NLP
- **PDF-Parse** & **Mammoth** for file processing
- **Helmet** & **CORS** for security

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or Atlas cloud)
- **Cloudinary** account (for file storage)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ATSChecker
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ats-checker
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ats-checker

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Get Cloudinary Credentials
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

### 3. Frontend Setup

#### Install Dependencies
```bash
# From project root
npm install
```

#### Environment Configuration
Create a `.env` file in the project root:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ATS Checker
VITE_MAX_FILE_SIZE=10485760
```

### 4. Database Setup

#### For Local MongoDB:
```bash
# Start MongoDB service
mongod

# Create database (optional - will be created automatically)
mongo
use ats-checker
```

#### For MongoDB Atlas:
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## 🚀 Running the Application

### Option 1: Run Both Servers (Recommended)
Use the provided batch script (Windows):
```bash
# Double-click or run in terminal
start-both.bat
```

### Option 2: Run Servers Separately

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will be available at: http://localhost:5000

#### Start Frontend Server
```bash
# From project root
npm run dev
```
Frontend will be available at: http://localhost:5173

### Option 3: Production Build
```bash
# Build frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### ATS Analysis
- `POST /api/ats/analyze` - Analyze resume (requires file upload)
- `GET /api/ats/reports` - Get user's analysis reports
- `GET /api/ats/reports/:id` - Get specific report
- `DELETE /api/ats/reports/:id` - Delete report

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `GET /api/user/usage` - Get usage statistics

## 🗂️ Project Structure

```
ATSChecker/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   └── server.js        # Main server file
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── store/          # State management
│   ├── utils/          # Frontend utilities
│   └── assets/         # Static assets
├── public/             # Public assets
└── start-*.bat        # Quick start scripts
```

## 🔧 Configuration Options

### File Upload Limits
- Maximum file size: 10MB (configurable)
- Supported formats: PDF, DOC, DOCX, TXT
- Storage: Cloudinary cloud storage

### Analysis Features
- Keyword extraction and matching
- Skills identification (1000+ technical and soft skills)
- Format compatibility checking
- Readability scoring
- ATS compatibility assessment

### Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation with Joi
- Helmet security headers

## 🤝 Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Resume**: Drag & drop or select your resume file
3. **Add Job Description**: Paste the target job description
4. **Analyze**: Click "Analyze Resume" button
5. **Review Results**: Get detailed scores and suggestions
6. **Save Reports**: Access your analysis history
7. **Improve**: Apply suggestions and re-analyze

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Ensure port 5000 is available

**File upload fails:**
- Check Cloudinary credentials
- Verify file size limits
- Ensure file format is supported

**Frontend can't connect to backend:**
- Check API URL in frontend `.env`
- Ensure backend is running on correct port
- Verify CORS settings

**Database connection issues:**
- Check MongoDB URI format
- Ensure database is running
- Verify network connectivity

### Logs
- Backend logs: Check terminal where backend is running
- Frontend logs: Check browser developer console
- Database logs: Check MongoDB logs

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy backend first
4. Update frontend API URL

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy `dist` folder
3. Set environment variables
4. Configure redirects for SPA

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions:
- Check the troubleshooting section
- Review API documentation
- Check environment configuration
- Verify all dependencies are installed

---

**Happy Job Hunting! 🎯**
