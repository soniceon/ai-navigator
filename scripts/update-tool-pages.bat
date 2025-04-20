@echo off
echo === Tool Pages Update Tool ===
echo This script will update all tool pages to follow the template structure
echo and automatically download tool icons to local storage

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js first.
  exit /b 1
)

:: Check if template and tools.json exist
if not exist templates\template.html (
  echo Error: templates/template.html not found.
  exit /b 1
)

if not exist pages\tools\tools.json (
  echo Error: pages/tools/tools.json not found.
  exit /b 1
)

echo Starting update process...
echo This will update all tool pages to match the template and download missing icons.

:: Run the update script
node scripts/update-tool-pages.js

:: Check if the script was successful
if %ERRORLEVEL% NEQ 0 (
  echo Error: Update script failed.
  exit /b 1
)

echo.
echo === Update Complete ===
echo All tool pages have been updated to follow the template structure.
echo Tool icons have been downloaded to /images/tools directory.

echo.
echo Process completed successfully! 