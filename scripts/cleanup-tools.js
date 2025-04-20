/**
 * Cleanup Tools Script
 * 
 * This script detects and removes AI tool pages that refer to tools
 * that don't exist or have invalid/incomplete information.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log("Starting tool cleanup process...");

// Get the root directory
const rootDir = path.join(__dirname, '..');
// Get all HTML files in the tools directory
const toolsDir = path.join(rootDir, 'pages/tools');
const imagesDir = path.join(rootDir, 'images/tools');

console.log(`Tools directory: ${toolsDir}`);

// Verify the tools directory exists
if (!fs.existsSync(toolsDir)) {
  console.error(`Error: Tools directory not found at ${toolsDir}`);
  process.exit(1);
}

// Get all HTML files
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));
console.log(`Found ${files.length} tool pages to check`);

// Create a backup directory
const backupDir = path.join(rootDir, 'backups', `tools_backup_${new Date().toISOString().replace(/:/g, '-')}`);
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// List of known AI tools
const knownAiTools = [
  'adobe-firefly',
  'anthropic-claude',
  'anthropic',
  'canva-ai',
  'character-ai',
  'chatgpt',
  'claude-2',
  'claude',
  'copilot',
  'copy-ai',
  'd-id',
  'dall-e',
  'dalle-3',
  'datadog',
  'deepcode',
  'descript',
  'elevenlabs',
  'figma-ai',
  'gemini',
  'gitguardian',
  'github-copilot',
  'grammarly-ai',
  'grammarly',
  'huggingface',
  'jasper',
  'leonardo-ai',
  'midjourney',
  'notion-ai',
  'perplexity-ai',
  'perplexity',
  'replicate',
  'runway',
  'stability-ai',
  'stable-diffusion',
  'synthesia',
  'tabnine',
];

// List of fake or non-existent AI tools - add any you know are fake
const fakeAiTools = [
  'nonexistent-ai',
  'fake-gpt',
  'dummy-ai',
  // Add more fake tools here as you identify them
];

// Function to check if a URL exists (returns a status code)
async function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 5000 }, (res) => {
      resolve(res.statusCode);
    });
    
    req.on('error', () => {
      resolve(0); // URL doesn't exist or has errors
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(0); // Timeout, consider URL as not existing
    });
  });
}

// Process each file
async function processFiles() {
  let removedCount = 0;
  let keptCount = 0;
  const problemTools = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(toolsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const toolName = file.replace('.html', '');
    
    console.log(`Checking ${i+1}/${files.length}: ${file}`);
    
    // Check if this is a special page like "all-tools" or "ranking"
    const specialPages = ['all-tools.html', 'ranking.html', 'categories.html'];
    if (specialPages.includes(file)) {
      console.log(`  ${file} is a special page, skipping checks`);
      keptCount++;
      continue;
    }
    
    // Check if this is a known fake AI tool
    if (fakeAiTools.includes(toolName)) {
      console.log(`  ${toolName} is known to be a fake/non-existent AI tool`);
      problemTools.push({ file, reason: 'Known fake/non-existent AI tool' });
      continue;
    }
    
    // Extract key information to determine if the tool is valid
    const titleMatch = content.match(/<h1 class="tool-title">(.*?)<\/h1>/);
    const descMatch = content.match(/<p class="tool-description">(.*?)<\/p>/);
    
    // Check for missing crucial information
    if (!titleMatch || !descMatch) {
      console.log(`  Missing title or description in ${file}`);
      problemTools.push({ file, reason: 'Missing title or description' });
      continue;
    }
    
    // Extract all URLs from the page
    const urlMatches = content.match(/href="(https?:\/\/[^"]*?)"/g);
    if (!urlMatches || urlMatches.length === 0) {
      console.log(`  No external URLs found in ${file}`);
      problemTools.push({ file, reason: 'No external URLs found' });
      continue;
    }
    
    // Extract website domains from multiple places
    let websiteDomain = "";
    
    // Try from the "Visit Website" button
    const visitWebsiteMatch = content.match(/href="(https?:\/\/[^"]*?)"[^>]*>(?:\s*<[^>]*>\s*)*Visit Website/);
    
    // Try from the quick info section
    const quickInfoMatch = content.match(/Website:\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    
    // Try from pricing card links
    const pricingCardMatch = content.match(/href="(https?:\/\/[^"]*?)"[^>]*>(?:\s*<[^>]*>\s*)*Get Started/);
    
    if (visitWebsiteMatch) {
      websiteDomain = new URL(visitWebsiteMatch[1]).hostname;
    } else if (quickInfoMatch) {
      websiteDomain = quickInfoMatch[1];
    } else if (pricingCardMatch) {
      websiteDomain = new URL(pricingCardMatch[1]).hostname;
    }
    
    if (!websiteDomain) {
      console.log(`  Could not determine website domain for ${file}`);
      problemTools.push({ file, reason: 'Could not determine website domain' });
      continue;
    }
    
    // Check if this tool refers to a domain known for a different tool
    // For example, if tool "fake-openai.html" refers to openai.com, it's likely fake
    const isDomainMatch = (domain, toolName) => {
      const toolParts = toolName.split('-');
      return toolParts.some(part => domain.includes(part));
    };
    
    if (!isDomainMatch(websiteDomain, toolName) && !knownAiTools.includes(toolName)) {
      console.log(`  Domain ${websiteDomain} doesn't match tool name ${toolName}`);
      problemTools.push({ file, reason: `Domain ${websiteDomain} doesn't match tool name` });
      continue;
    }
    
    // Check if the tool has complete pricing information
    const pricingMatch = content.match(/<div class="pricing-cards">([\s\S]*?)<\/div>\s*<\/section>/);
    if (!pricingMatch || pricingMatch[1].trim().length < 50) {
      console.log(`  Incomplete pricing information in ${file}`);
      problemTools.push({ file, reason: 'Incomplete pricing information' });
      continue;
    }
    
    // If we got here, the tool seems valid
    console.log(`  ${file} appears to be a valid tool`);
    keptCount++;
  }
  
  // Ask for confirmation before deleting
  console.log(`\nFound ${problemTools.length} problematic tool pages:`);
  problemTools.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.file} - ${tool.reason}`);
  });
  
  console.log(`\nTo delete these files, run this script with --delete flag`);
  
  // Delete if --delete flag is specified
  if (process.argv.includes('--delete')) {
    console.log(`\nDeleting ${problemTools.length} problematic tool pages...`);
    
    problemTools.forEach(tool => {
      const filePath = path.join(toolsDir, tool.file);
      const backupPath = path.join(backupDir, tool.file);
      
      // Backup the file first
      fs.copyFileSync(filePath, backupPath);
      
      // Delete HTML file
      fs.unlinkSync(filePath);
      
      // Delete corresponding SVG if it exists
      const svgPath = path.join(imagesDir, tool.file.replace('.html', '.svg'));
      if (fs.existsSync(svgPath)) {
        fs.unlinkSync(svgPath);
      }
      
      // Delete corresponding PNG if it exists
      const pngPath = path.join(imagesDir, tool.file.replace('.html', '.png'));
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
      
      console.log(`  Deleted ${tool.file} and its assets`);
      removedCount++;
    });
  }
  
  console.log(`\nSummary:`);
  console.log(`Kept ${keptCount} valid tool pages`);
  console.log(`Found ${problemTools.length} problematic tool pages`);
  if (process.argv.includes('--delete')) {
    console.log(`Removed ${removedCount} problematic tool pages`);
    console.log(`Backup created at ${backupDir}`);
  } else {
    console.log(`Run again with --delete flag to remove problematic tool pages`);
  }
  console.log('Process completed successfully!');
}

// Run the tool
processFiles().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 