// This script simplifies the project structure by moving all tool pages to /pages/tools
// and removes unnecessary backup directories

const fs = require('fs');
const path = require('path');

// Paths
const toolsDir = path.join(__dirname, '../pages/tools');
const outputDir = path.join(__dirname, '../pages/tools/output');
const outputBackupDir = path.join(__dirname, '../pages/tools/output_backup');
const toolsBackupDir = path.join(__dirname, '../pages/tools/tools_backup');

console.log('=== Project Structure Simplification ===');

// 1. Move all tool pages from output to the main tools directory
console.log('Moving tool pages from output directory to main tools directory...');

if (fs.existsSync(outputDir)) {
  const outputFiles = fs.readdirSync(outputDir).filter(file => 
    file.endsWith('.html') && !fs.statSync(path.join(outputDir, file)).isDirectory()
  );
  
  console.log(`Found ${outputFiles.length} tool pages to move`);
  
  // Move each file
  outputFiles.forEach(file => {
    const sourcePath = path.join(outputDir, file);
    const targetPath = path.join(toolsDir, file);
    
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Moved: ${file}`);
  });
}

// 2. Update all-tools.html to point to the main directory instead of output
console.log('\nUpdating all-tools.html links...');
const allToolsPath = path.join(toolsDir, 'all-tools.html');

if (fs.existsSync(allToolsPath)) {
  let content = fs.readFileSync(allToolsPath, 'utf8');
  content = content.replace(/href="output\//g, 'href="');
  fs.writeFileSync(allToolsPath, content);
  console.log('Updated link references in all-tools.html');
}

// 3. Remove backup directories
console.log('\nRemoving unnecessary directories...');

const dirsToRemove = [outputDir, outputBackupDir, toolsBackupDir];

dirsToRemove.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
    console.log(`Removed: ${dir}`);
  }
});

console.log('\n=== Simplification Complete ===');
console.log('All tool pages are now in the main /pages/tools directory');
console.log('Unnecessary directories have been removed');
console.log('Done!'); 