/**
 * Check Filename-Content Consistency Script
 * 
 * This script checks if the tool page filenames match their actual content (title, description)
 * and identifies inconsistencies that could indicate wrong naming or copied content.
 */

const fs = require('fs');
const path = require('path');

console.log("Starting filename-content consistency check...");

// Get the root directory
const rootDir = path.join(__dirname, '..');
// Get all HTML files in the tools directory
const toolsDir = path.join(rootDir, 'pages/tools');

console.log(`Tools directory: ${toolsDir}`);

// Verify the tools directory exists
if (!fs.existsSync(toolsDir)) {
  console.error(`Error: Tools directory not found at ${toolsDir}`);
  process.exit(1);
}

// Get all HTML files
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));
console.log(`Found ${files.length} tool pages to check`);

// Special pages that shouldn't be included in the check
const specialPages = ['all-tools.html', 'ranking.html', 'categories.html'];

// Normalize text for comparison (lowercase, remove special chars, etc.)
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric chars
    .trim();
}

// Check if a filename reasonably matches the title
function filenameMatchesTitle(filename, title) {
  const normalizedFilename = normalizeText(filename.replace('.html', ''));
  const normalizedTitle = normalizeText(title);
  
  // Direct contains check
  if (normalizedTitle.includes(normalizedFilename) || normalizedFilename.includes(normalizedTitle)) {
    return true;
  }
  
  // Check parts match (for names like "microsoft-copilot" vs "Microsoft Copilot")
  const filenameParts = normalizedFilename.split('-');
  const titleParts = normalizedTitle.split(' ');
  
  // Check if at least half of the parts match
  const matchingParts = filenameParts.filter(part => 
    part.length > 1 && titleParts.some(titlePart => titlePart.includes(part) || part.includes(titlePart))
  );
  
  return matchingParts.length >= Math.max(1, Math.floor(filenameParts.length / 2));
}

// Process each file
async function processFiles() {
  const mismatchedFiles = [];
  const correctFiles = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (specialPages.includes(file)) {
      console.log(`Skipping special page: ${file}`);
      continue;
    }
    
    const filePath = path.join(toolsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const toolName = file.replace('.html', '');
    
    console.log(`Checking ${i+1}/${files.length}: ${file}`);
    
    // Extract title and description
    const titleMatch = content.match(/<h1 class="tool-title">(.*?)<\/h1>/);
    if (!titleMatch) {
      console.log(`  No title found in ${file}, skipping...`);
      continue;
    }
    
    const title = titleMatch[1].trim();
    console.log(`  Title: "${title}"`);
    
    // Check if filename matches title
    const matches = filenameMatchesTitle(file, title);
    
    if (!matches) {
      console.log(`  ❌ MISMATCH: Filename "${file}" doesn't match title "${title}"`);
      mismatchedFiles.push({ file, title, suggestedFilename: title.toLowerCase().replace(/\s+/g, '-') + '.html' });
    } else {
      console.log(`  ✓ MATCH: Filename "${file}" matches title "${title}"`);
      correctFiles.push({ file, title });
    }
  }
  
  // Output summary
  console.log("\n=== Filename-Content Consistency Summary ===");
  console.log(`Total files checked: ${files.length - specialPages.length}`);
  console.log(`Files with correct naming: ${correctFiles.length}`);
  console.log(`Files with naming issues: ${mismatchedFiles.length}`);
  
  if (mismatchedFiles.length > 0) {
    console.log("\n=== Files with Naming Issues ===");
    mismatchedFiles.forEach((item, index) => {
      console.log(`${index + 1}. "${item.file}" → should be → "${item.suggestedFilename}" (based on title: "${item.title}")`);
    });
    
    console.log("\nTo rename these files automatically, run this script with the --fix flag");
    
    // Fix the issues if --fix flag is provided
    if (process.argv.includes('--fix')) {
      console.log("\n=== Renaming Files ===");
      
      // Create a backup directory
      const backupDir = path.join(rootDir, 'backups', `filename_fixes_${new Date().toISOString().replace(/:/g, '-')}`);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log(`Created backup directory: ${backupDir}`);
      }
      
      for (const item of mismatchedFiles) {
        const oldPath = path.join(toolsDir, item.file);
        const backupPath = path.join(backupDir, item.file);
        const newPath = path.join(toolsDir, item.suggestedFilename);
        
        // Backup the original file
        fs.copyFileSync(oldPath, backupPath);
        
        // Check if the target file already exists
        if (fs.existsSync(newPath)) {
          console.log(`  ⚠️ Cannot rename "${item.file}" → "${item.suggestedFilename}" (target file already exists)`);
          continue;
        }
        
        // Rename the file
        fs.renameSync(oldPath, newPath);
        console.log(`  ✓ Renamed "${item.file}" → "${item.suggestedFilename}"`);
        
        // Also rename related assets (images)
        const oldBasename = item.file.replace('.html', '');
        const newBasename = item.suggestedFilename.replace('.html', '');
        
        const imagesDir = path.join(rootDir, 'images/tools');
        if (fs.existsSync(imagesDir)) {
          // Check for SVG
          const oldSvgPath = path.join(imagesDir, `${oldBasename}.svg`);
          const newSvgPath = path.join(imagesDir, `${newBasename}.svg`);
          if (fs.existsSync(oldSvgPath) && !fs.existsSync(newSvgPath)) {
            fs.copyFileSync(oldSvgPath, newSvgPath);
            fs.unlinkSync(oldSvgPath);
            console.log(`    ✓ Renamed image: "${oldBasename}.svg" → "${newBasename}.svg"`);
          }
          
          // Check for PNG
          const oldPngPath = path.join(imagesDir, `${oldBasename}.png`);
          const newPngPath = path.join(imagesDir, `${newBasename}.png`);
          if (fs.existsSync(oldPngPath) && !fs.existsSync(newPngPath)) {
            fs.copyFileSync(oldPngPath, newPngPath);
            fs.unlinkSync(oldPngPath);
            console.log(`    ✓ Renamed image: "${oldBasename}.png" → "${newBasename}.png"`);
          }
        }
      }
      
      console.log("\n=== Renaming Completed ===");
      console.log(`Total files renamed: ${mismatchedFiles.length}`);
      console.log(`Backup created at: ${backupDir}`);
    }
  }
}

// Run the script
processFiles().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 