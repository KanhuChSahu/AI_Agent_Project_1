@echo off
echo Starting Google Sheets to Video AI Portal...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists, if not run npm install
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to install dependencies.
        pause
        exit /b 1
    )
)

REM Check if demo data exists, if not generate it
if not exist demo\sample-sheet-data.json (
    echo Generating demo data...
    if not exist demo mkdir demo
    node scripts/demo-data.js
)

REM Start the application
echo Starting server...
echo.
echo Once the server is running, open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop the server.
echo.
npm start