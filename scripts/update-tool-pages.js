// This script updates all tool pages to follow the template structure
// and automatically downloads tool icons to local storage

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Paths
const toolsDir = path.join(__dirname, '../pages/tools');
const toolsJsonPath = path.join(toolsDir, 'tools.json');
const templatePath = path.join(__dirname, '../templates/template.html');
const iconsDir = path.join(__dirname, '../images/tools');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log(`Created icons directory: ${iconsDir}`);
}

// Load tools data
let toolsData;
try {
  const jsonData = fs.readFileSync(toolsJsonPath, 'utf8');
  toolsData = JSON.parse(jsonData);
  console.log(`Loaded ${toolsData.tools.length} tools from tools.json`);
} catch (error) {
  console.error('Error loading tools.json:', error);
  process.exit(1);
}

// Load template
let template;
try {
  template = fs.readFileSync(templatePath, 'utf8');
  console.log('Loaded template file');
} catch (error) {
  console.error('Error loading template:', error);
  process.exit(1);
}

// Function to download file
async function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    // Choose http or https based on URL
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, targetPath)
          .then(resolve)
          .catch(reject);
      }
      
      // Check for error response
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
      }
      
      // Write file
      const fileStream = fs.createWriteStream(targetPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(targetPath, () => {}); // Clean up
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Function to update a tool page
async function updateToolPage(tool) {
  const toolPagePath = path.join(toolsDir, `${tool.id}.html`);
  
  // Download icon if needed
  const iconPath = path.join(iconsDir, `${tool.id}.png`);
  const iconExists = fs.existsSync(iconPath);
  const iconRelativePath = `../../images/tools/${tool.id}.png`;
  
  if (!iconExists && tool.logo_url) {
    try {
      console.log(`Downloading icon for ${tool.id}...`);
      await downloadFile(tool.logo_url, iconPath);
      console.log(`Downloaded icon to ${iconPath}`);
    } catch (error) {
      console.error(`Error downloading icon for ${tool.id}:`, error.message);
      // Create placeholder if download fails
      if (!fs.existsSync(iconPath)) {
        const placeholderPath = path.join(iconsDir, 'placeholder.svg');
        if (!fs.existsSync(placeholderPath)) {
          // Create a simple SVG placeholder
          const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#f0f0f0"/>
            <text x="50" y="50" font-family="Arial" font-size="12" fill="#666" text-anchor="middle" dominant-baseline="middle">${tool.id}</text>
          </svg>`;
          fs.writeFileSync(placeholderPath, placeholderSvg);
        }
        fs.copyFileSync(placeholderPath, iconPath);
      }
    }
  }
  
  // Create content for the page based on the template
  // Replace template variables with tool data
  let content = template;
  
  // Basic replacements
  content = content.replace(/{{ title }}/g, tool.title);
  content = content.replace(/{{ description }}/g, tool.description);
  content = content.replace(/{{ keywords }}/g, tool.keywords || '');
  content = content.replace(/{{ logo_url }}/g, iconRelativePath);
  content = content.replace(/{{ category }}/g, tool.category);
  content = content.replace(/{{ category_icon }}/g, tool.category_icon);
  content = content.replace(/{{ rating }}/g, tool.rating);
  content = content.replace(/{{ views }}/g, tool.views || '0');
  
  // Generate rating stars and replace all instances
  const ratingStars = '★'.repeat(Math.round(tool.rating));
  content = content.replace(/{{ rating_stars\|safe }}/g, ratingStars);
  content = content.replace(/{{ rating_stars }}/g, ratingStars);
  
  content = content.replace(/{{ website_url }}/g, tool.website_url);
  content = content.replace(/{{ website }}/g, tool.website || '');
  content = content.replace(/{{ overview }}/g, tool.overview || '');
  content = content.replace(/{{ company }}/g, tool.company || '');
  content = content.replace(/{{ user_count }}/g, tool.user_count || '');
  content = content.replace(/{{ launch_date }}/g, tool.launch_date || '');
  content = content.replace(/{{ review_count }}/g, tool.review_count || '0');
  content = content.replace(/{{ share_text }}/g, tool.share_text || `Check out ${tool.title}`);
  
  // Apply consistent tool logo styles to match dalle-3.html
  const logoStyleRegex = /\.tool-logo\s*{[^}]*}/;
  const dalleLogoStyle = `.tool-logo {
    width: 120px;
    height: 120px;
    border-radius: 1.5rem;
    object-fit: cover;
    background: #fff;
    padding: 1rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}`;
  
  // Replace the tool-logo CSS with dalle-3's style
  content = content.replace(logoStyleRegex, dalleLogoStyle);
  
  // Also handle inline styles on img elements with tool-logo class
  const imgTagRegex = /<img[^>]*class="tool-logo"[^>]*>/g;
  content = content.replace(imgTagRegex, (match) => {
    // Remove any width, height, or style attributes
    let newTag = match
      .replace(/\s+width="[^"]*"/g, '')
      .replace(/\s+height="[^"]*"/g, '')
      .replace(/\s+style="[^"]*"/g, '');
    
    // If the closing bracket was removed, add it back
    if (!newTag.endsWith('>')) {
      newTag += '>';
    }
    
    return newTag;
  });
  
  // Complex replacements
  // For capabilities (array)
  if (tool.capabilities && tool.capabilities.length) {
    const capabilitiesHtml = tool.capabilities.map(cap => `<li>${cap}</li>`).join('\n');
    content = content.replace(/{% if capabilities %}([\s\S]*?){% endif %}/g, (match, inner) => {
      return inner.replace(/{% for capability in capabilities %}([\s\S]*?){% endfor %}/g, 
        () => capabilitiesHtml);
    });
  } else {
    content = content.replace(/{% if capabilities %}[\s\S]*?{% endif %}/g, '');
  }
  
  // For pricing plans (array of objects)
  if (tool.pricing_plans && tool.pricing_plans.length) {
    const plansHtml = tool.pricing_plans.map(plan => {
      const featuresHtml = plan.features.map(feature => `<li>${feature}</li>`).join('\n');
      return `<div class="pricing-card ${plan.is_popular ? 'popular' : ''}">
        <h3>${plan.name}</h3>
        <div class="price">${plan.price}</div>
        <ul>${featuresHtml}</ul>
        <a href="${plan.action_url}" class="btn" target="_blank" rel="noopener noreferrer">${plan.action_text}</a>
      </div>`;
    }).join('\n');
    
    // Find and replace the entire pricing cards section
    content = content.replace(/<div class="pricing-cards">[\s\S]*?<\/div>\s*<\/section>/m, 
      `<div class="pricing-cards">${plansHtml}</div></section>`);
  }
  
  // For extra info (object)
  if (tool.extra_info) {
    let extraInfoHtml = '';
    
    // Handle both object format and label/value format
    if (typeof tool.extra_info === 'object') {
      if (tool.extra_info.label && tool.extra_info.value) {
        // It's in label/value format
        extraInfoHtml = `<li class="info-item">
          <i class="fas fa-info-circle"></i>
          <span>${tool.extra_info.label}: ${tool.extra_info.value}</span>
        </li>`;
      } else {
        // It's a regular object with multiple keys
        extraInfoHtml = Object.entries(tool.extra_info).map(([key, value]) => 
          `<li class="info-item">
            <i class="fas fa-info-circle"></i>
            <span>${key}: ${value}</span>
          </li>`
        ).join('\n');
      }
    }
    
    // Find and replace the extra_info section
    const extraInfoPattern = /<li class="info-item"><i class="fas fa-info-circle"><\/i><span>[^<]*<\/span><\/li>\s*<li class="info-item"><i class="fas fa-info-circle"><\/i><span>[^<]*<\/span><\/li>/;
    if (extraInfoPattern.test(content)) {
      content = content.replace(extraInfoPattern, extraInfoHtml);
    } else {
      // Try to add before the end of the info list
      content = content.replace(/<\/ul>\s*<\/div>\s*<div class="info-card">/m, 
        `${extraInfoHtml}</ul></div><div class="info-card">`);
    }
  }
  
  // Clean up any remaining template tags
  content = content.replace(/{{.*?}}/g, '');
  content = content.replace(/{%.*?%}/g, '');
  
  // Write the file
  fs.writeFileSync(toolPagePath, content);
  console.log(`Updated page for ${tool.id}`);
}

// Process all tools
async function processAllTools() {
  console.log('=== Updating Tool Pages ===');
  
  // Process each tool
  for (const tool of toolsData.tools) {
    try {
      await updateToolPage(tool);
    } catch (error) {
      console.error(`Error processing ${tool.id}:`, error);
    }
  }
  
  console.log('\n=== Update Complete ===');
  console.log(`Updated ${toolsData.tools.length} tool pages`);
  console.log('All pages now follow the template structure and use local icons');
}

// Start processing
processAllTools().catch(console.error); 