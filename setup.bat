@echo off
REM Quick setup script for Windows
REM Run this from the project root directory

echo.
echo ==================================================
echo Neon Credit AI - Quick Setup Script
echo ==================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [✓] Python and Node.js found
echo.

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo [Creating] Python virtual environment...
    python -m venv .venv
    echo [✓] Virtual environment created
) else (
    echo [✓] Virtual environment already exists
)

REM Activate virtual environment and install backend dependencies
echo.
echo [Installing] Backend dependencies...
call .venv\Scripts\activate.bat
pip install -r Model\requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [✓] Backend dependencies installed
deactivate

REM Install frontend dependencies
echo.
echo [Installing] Frontend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [✓] Frontend dependencies installed

echo.
echo ==================================================
echo Setup Complete!
echo ==================================================
echo.
echo Next steps:
echo.
echo Terminal 1 - Start the Backend:
echo   .venv\Scripts\activate
echo   python Model\api_server.py
echo.
echo Terminal 2 - Start the Frontend:
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo For more info, see: INTEGRATION_GUIDE.md
echo.
pause
