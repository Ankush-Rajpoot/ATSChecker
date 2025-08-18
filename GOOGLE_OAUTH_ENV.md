# Environment Variables Required for Google OAuth

Add these variables to your .env file in the backend directory:

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (for redirects after OAuth)
FRONTEND_URL=http://localhost:5173

# Session Secret (for passport sessions)
SESSION_SECRET=your_very_secure_session_secret_here

# Instructions to get Google OAuth credentials:

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" > "OAuth 2.0 Client IDs"
6. Choose "Web application"
7. Add authorized redirect URIs:
   - For development: http://localhost:5000/api/auth/google/callback
   - For production: https://yourdomain.com/api/auth/google/callback
8. Copy the Client ID and Client Secret to your .env file

# Example .env entries:
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=super-secure-session-secret-change-this-in-production
