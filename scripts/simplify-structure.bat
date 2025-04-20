@echo off
echo === Project Structure Simplification ===
echo This script will simplify the project structure by moving all tool pages to /pages/tools

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js first.
  exit /b 1
)

echo Moving files and cleaning up directories...

:: Run the simplification script
node scripts/simplify-structure.js

:: Check if the script was successful
if %ERRORLEVEL% NEQ 0 (
  echo Error: Simplification script failed.
  exit /b 1
)

echo.
echo === Simplification Complete ===
echo All tool pages are now in the main /pages/tools directory.
echo All unnecessary subdirectories have been removed.

echo.
echo Process completed successfully! 