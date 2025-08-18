@echo off
echo Starting ATS Checker Full Stack Application...
echo.

echo Starting Backend...
start cmd /k "cd /d backend && npm install && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start cmd /k "npm install && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
pause
