@echo off
REM Script to unify all tool icons to match the DALL-E 3 style

echo Starting icon unification process...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

REM Path to the JavaScript file
set "SCRIPT_PATH=%~dp0unify-icons.js"

REM Check if the script exists
if not exist "%SCRIPT_PATH%" (
    echo Error: Script not found at %SCRIPT_PATH%
    exit /b 1
)

REM Run the JavaScript script
node "%SCRIPT_PATH%"

echo Script execution completed. 