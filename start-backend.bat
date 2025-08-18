@echo off
echo Starting ATS Checker Backend...
echo.

cd backend

echo Installing dependencies...
npm install

echo.
echo Starting development server...
npm run dev
