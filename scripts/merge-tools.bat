@echo off
echo === AI Tools Merger ===
echo This script will merge AI tool pages into a single directory

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js first.
  exit /b 1
)

:: Check if tools.json exists
if not exist pages\tools\tools.json (
  echo Error: tools.json not found in pages/tools directory.
  exit /b 1
)

echo Starting merge process...
echo A backup of the original output directory will be created at /pages/tools/output_backup

:: Run the merge script
echo Running merge script...
node scripts/merge-tools.js

:: Check if the script was successful
if %ERRORLEVEL% NEQ 0 (
  echo Error: Merge script failed.
  exit /b 1
)

echo.
echo === Merge Complete ===
echo All AI tool pages have been merged into the /pages/tools/output directory.
echo Original files have been backed up to /pages/tools/output_backup.
echo The all-tools.html page has been updated to point to the output directory.

echo.
echo Process completed successfully! 