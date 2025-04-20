/**
 * Check URL-Tool Name Consistency Script
 * 
 * This script checks if the tool page's website URL is consistent with the tool name
 * and identifies pages that might be using incorrect or unrelated URLs.
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

console.log("Starting URL-tool name consistency check...");

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

// Known domain mappings for tools (some tools might have different domains than their names)
const knownDomainMappings = {
  'github-copilot': ['github.com'],
  'microsoft-copilot': ['microsoft.com', 'copilot.microsoft.com'],
  'chatgpt': ['openai.com', 'chat.openai.com'],
  'dall-e': ['openai.com', 'labs.openai.com'],
  'stable-diffusion': ['stability.ai', 'stablediffusionweb.com'],
  'anthropic-claude': ['anthropic.com', 'claude.ai'],
  'claude': ['anthropic.com', 'claude.ai'],
  'claude-2': ['anthropic.com', 'claude.ai'],
  'jenni-ai': ['jenni.ai'],
  'copy-ai': ['copy.ai'],
  'perplexity-ai': ['perplexity.ai'],
  'beautiful-ai': ['beautiful.ai'],
};

// Normalize text for comparison
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '') // Remove special chars except dots and hyphens
    .trim();
}

// Check if the domain is related to the tool name
function isDomainRelated(domain, toolName) {
  const normalizedDomain = normalizeText(domain);
  const normalizedToolName = normalizeText(toolName);
  
  // Check known mappings first
  if (knownDomainMappings[toolName]) {
    return knownDomainMappings[toolName].some(knownDomain => 
      normalizedDomain.includes(normalizeText(knownDomain))
    );
  }
  
  // Check if tool name parts are in the domain
  const toolParts = normalizedToolName.split('-').filter(part => part.length > 2);
  return toolParts.some(part => normalizedDomain.includes(part));
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return url; // Return as is if not a valid URL
  }
}

// Process each file
async function processFiles() {
  const inconsistentUrls = [];
  const correctUrls = [];
  
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
    
    // Extract title for reference
    const titleMatch = content.match(/<h1 class="tool-title">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : toolName;
    
    // Extract URLs from the page
    let primaryUrl = null;
    let urlsFound = [];
    
    // Try different patterns to find URLs
    
    // 1. Visit Website button
    const visitWebsiteMatch = content.match(/href="(https?:\/\/[^"]*?)"[^>]*>(?:\s*<[^>]*>\s*)*Visit Website/);
    if (visitWebsiteMatch) {
      primaryUrl = visitWebsiteMatch[1];
      urlsFound.push({ type: 'Visit Website button', url: primaryUrl });
    }
    
    // 2. Quick info section - Website
    const websiteInfoMatch = content.match(/Website:\s*<\/span>\s*<span>([^<]+)<\/span>/);
    if (websiteInfoMatch) {
      const websiteInfo = websiteInfoMatch[1].trim();
      if (websiteInfo.startsWith('http')) {
        urlsFound.push({ type: 'Info section', url: websiteInfo });
      } else {
        urlsFound.push({ type: 'Info section', url: `https://${websiteInfo}` });
      }
    }
    
    // 3. Pricing card Get Started buttons
    const pricingCardMatches = content.matchAll(/href="(https?:\/\/[^"]*?)"[^>]*>(?:\s*<[^>]*>\s*)*Get Started/g);
    for (const match of pricingCardMatches) {
      urlsFound.push({ type: 'Pricing card', url: match[1] });
    }
    
    // If we didn't find a primary URL yet, use the first one found
    if (!primaryUrl && urlsFound.length > 0) {
      primaryUrl = urlsFound[0].url;
    }
    
    if (!primaryUrl) {
      console.log(`  ⚠️ No URLs found in ${file}`);
      inconsistentUrls.push({ 
        file, 
        title, 
        issue: 'No URLs found', 
        suggestedUrl: `https://${toolName.replace(/-/g, '')}.com` 
      });
      continue;
    }
    
    // Check if the URL is related to the tool name
    const domain = extractDomain(primaryUrl);
    console.log(`  Primary URL: ${primaryUrl} (domain: ${domain})`);
    
    const isRelated = isDomainRelated(domain, toolName);
    
    if (!isRelated) {
      console.log(`  ❌ INCONSISTENT: URL domain "${domain}" doesn't seem related to tool "${toolName}"`);
      
      // Suggest the most appropriate URL based on the tool name
      let suggestedUrl;
      if (toolName.includes('-ai')) {
        suggestedUrl = `https://${toolName.replace(/-ai$/, '.ai')}`;
      } else {
        suggestedUrl = `https://${toolName.replace(/-/g, '')}.com`;
      }
      
      inconsistentUrls.push({ file, title, url: primaryUrl, domain, suggestedUrl });
    } else {
      console.log(`  ✓ CONSISTENT: URL domain "${domain}" matches tool "${toolName}"`);
      correctUrls.push({ file, title, url: primaryUrl, domain });
    }
  }
  
  // Output summary
  console.log("\n=== URL-Tool Name Consistency Summary ===");
  console.log(`Total files checked: ${files.length - specialPages.length}`);
  console.log(`Files with consistent URLs: ${correctUrls.length}`);
  console.log(`Files with inconsistent URLs: ${inconsistentUrls.length}`);
  
  if (inconsistentUrls.length > 0) {
    console.log("\n=== Files with Inconsistent URLs ===");
    inconsistentUrls.forEach((item, index) => {
      if (item.url) {
        console.log(`${index + 1}. "${item.file}" (${item.title})`);
        console.log(`   Current URL: ${item.url}`);
        console.log(`   Suggested URL: ${item.suggestedUrl}`);
      } else {
        console.log(`${index + 1}. "${item.file}" (${item.title}): ${item.issue}`);
        console.log(`   Suggested URL: ${item.suggestedUrl}`);
      }
    });
    
    console.log("\nTo fix these URLs, edit the corresponding HTML files.");
    
    // Create a report file if --report flag is provided
    if (process.argv.includes('--report')) {
      const reportPath = path.join(rootDir, 'url_inconsistencies_report.json');
      fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
          totalChecked: files.length - specialPages.length,
          consistentCount: correctUrls.length,
          inconsistentCount: inconsistentUrls.length
        },
        inconsistentFiles: inconsistentUrls,
        consistentFiles: correctUrls
      }, null, 2));
      console.log(`\nDetailed report saved to: ${reportPath}`);
    }
  }
}

// Run the script
processFiles().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 