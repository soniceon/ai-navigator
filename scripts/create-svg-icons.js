/**
 * Create SVG Icons Script
 * 
 * This script generates SVG icons for all tool pages
 * that currently don't have proper icons.
 */

const fs = require('fs');
const path = require('path');

console.log("Starting SVG icon creation process...");

// Get the root directory
const rootDir = path.join(__dirname, '..');
// Get all HTML files in the tools directory
const toolsDir = path.join(rootDir, 'pages/tools');
const imagesDir = path.join(rootDir, 'images/tools');

console.log(`Tools directory: ${toolsDir}`);
console.log(`Images directory: ${imagesDir}`);

// Verify the directories exist
if (!fs.existsSync(toolsDir)) {
  console.error(`Error: Tools directory not found at ${toolsDir}`);
  process.exit(1);
}

if (!fs.existsSync(imagesDir)) {
  console.log(`Creating images/tools directory...`);
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Get all HTML files
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));
console.log(`Found ${files.length} tool pages to create icons for`);

// Generate a random color from a list of professional colors
function getRandomColor() {
  const colors = [
    '#007BFF', // Blue
    '#28A745', // Green
    '#DC3545', // Red
    '#FFC107', // Yellow
    '#17A2B8', // Cyan
    '#6610F2', // Indigo
    '#6F42C1', // Purple
    '#E83E8C', // Pink
    '#FD7E14', // Orange
    '#20C997', // Teal
    '#6C757D'  // Gray
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Process each file
let createdCount = 0;
let skippedCount = 0;
files.forEach((file, index) => {
  const toolName = file.replace('.html', '');
  const svgPath = path.join(imagesDir, `${toolName}.svg`);
  
  // Skip if SVG already exists and has content
  if (fs.existsSync(svgPath) && fs.statSync(svgPath).size > 100) {
    console.log(`Skipping ${toolName}.svg (already exists)`);
    skippedCount++;
    return;
  }
  
  // Read the HTML file to extract the tool title
  const filePath = path.join(toolsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the tool title
  const titleMatch = content.match(/<h1 class="tool-title">(.*?)<\/h1>/);
  const toolTitle = titleMatch ? titleMatch[1].trim() : toolName.replace(/-/g, ' ');
  
  // Get initials (up to 3 characters)
  const initials = toolTitle.split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();
  
  // Create a random color
  const backgroundColor = getRandomColor();
  
  // Create the SVG content
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="15" fill="${backgroundColor}"/>
  <text x="50" y="55" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${initials}</text>
</svg>`;
  
  // Write the SVG file
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created ${toolName}.svg with initials ${initials}`);
  createdCount++;
  
  // Update the HTML file to use the SVG icon
  const updatedContent = content.replace(
    /<div class="tool-logo">[\s\S]*?<\/div>/,
    `<div class="tool-logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            <rect width="100" height="100" rx="15" fill="${backgroundColor}"/>
            <text x="50" y="55" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${initials}</text>
        </svg>
    </div>`
  );
  
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Updated ${file} to use SVG icon`);
});

console.log(`\nSummary:`);
console.log(`Created ${createdCount} SVG icons`);
console.log(`Skipped ${skippedCount} existing icons`);
console.log('Process completed successfully!'); 