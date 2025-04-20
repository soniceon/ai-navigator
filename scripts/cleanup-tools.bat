@echo off
echo === AI Tools Cleanup ===
echo This script will remove HTML files from /pages/tools that have been merged into /pages/tools/output

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js first.
  exit /b 1
)

echo Creating backup and removing duplicate HTML files...
echo A backup will be created in /pages/tools/tools_backup.

:: Run the cleanup script
node scripts/cleanup-tools.js

:: Check if the script was successful
if %ERRORLEVEL% NEQ 0 (
  echo Error: Cleanup script failed.
  exit /b 1
)

echo.
echo === Cleanup Complete ===
echo All duplicate tool pages have been removed from /pages/tools.
echo Only the files in /pages/tools/output remain.
echo The removed files have been backed up to /pages/tools/tools_backup.

echo.
echo Process completed successfully! 