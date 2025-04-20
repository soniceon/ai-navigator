// This script helps merge duplicate AI tool pages between /pages/tools and /pages/tools/output
// It identifies duplicates and helps organize them properly

const fs = require('fs');
const path = require('path');

// Function to create directories if they don't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

// Paths
const toolsDir = path.join(__dirname, '../pages/tools');
const outputDir = path.join(__dirname, '../pages/tools/output');

// Ensure the output directory exists
ensureDirectoryExists(outputDir);

// Backup the output directory first
const backupDir = path.join(__dirname, '../pages/tools/output_backup');
if (fs.existsSync(backupDir)) {
  // Remove existing backup directory
  fs.rmdirSync(backupDir, { recursive: true });
}
fs.mkdirSync(backupDir, { recursive: true });

// Copy all files from output directory to backup
if (fs.existsSync(outputDir)) {
  const outputFiles = fs.readdirSync(outputDir);
  outputFiles.forEach(file => {
    if (file.endsWith('.html')) {
      const sourcePath = path.join(outputDir, file);
      const targetPath = path.join(backupDir, file);
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
  console.log(`Created backup of output directory at: ${backupDir}`);
}

// Get list of all tool files
const toolFiles = fs.readdirSync(toolsDir).filter(file => 
  file.endsWith('.html') && 
  file !== 'all-tools.html' && 
  !fs.statSync(path.join(toolsDir, file)).isDirectory()
);

const outputToolFiles = fs.existsSync(outputDir) ? 
  fs.readdirSync(outputDir).filter(file => file.endsWith('.html')) : [];

console.log('=== AI Tools Merger ===');
console.log(`Found ${toolFiles.length} tools in /pages/tools`);
console.log(`Found ${outputToolFiles.length} tools in /pages/tools/output`);

// Find duplicates (files with same name in both directories)
const duplicateFiles = toolFiles.filter(file => outputToolFiles.includes(file));
console.log(`Found ${duplicateFiles.length} duplicate files`);

// Process each file
console.log('\nProcessing files...');

// First, handle duplicates by keeping the newer version
duplicateFiles.forEach(file => {
  const toolPath = path.join(toolsDir, file);
  const outputPath = path.join(outputDir, file);
  
  const toolStat = fs.statSync(toolPath);
  const outputStat = fs.existsSync(outputPath) ? fs.statSync(outputPath) : { mtime: new Date(0) };
  
  // If the file in tools directory is newer, copy it to the output directory
  if (toolStat.mtime > outputStat.mtime) {
    fs.copyFileSync(toolPath, outputPath);
    console.log(`Updated: ${file} (used newer version from /pages/tools)`);
  } else {
    console.log(`Kept: ${file} (output version is newer or same)`);
  }
});

// Then, copy unique files from tools directory to output
const uniqueToolFiles = toolFiles.filter(file => !duplicateFiles.includes(file));

uniqueToolFiles.forEach(file => {
  const sourcePath = path.join(toolsDir, file);
  const targetPath = path.join(outputDir, file);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied unique tool: ${file} to output directory`);
});

console.log('\n=== Summary ===');
console.log(`Total files in output directory: ${fs.readdirSync(outputDir).filter(file => file.endsWith('.html')).length}`);
console.log('Done!');

console.log('\n=== Next Steps ===');
console.log('1. All tool pages are now in /pages/tools/output');
console.log('2. A backup of the original output directory is in /pages/tools/output_backup');
console.log('3. Update any references in your code to point to /pages/tools/output'); 