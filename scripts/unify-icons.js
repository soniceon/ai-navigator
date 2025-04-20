/**
 * Unify Icons Script
 * 
 * This script unifies all tool icons to match the DALL-E 3 style
 * by updating the CSS and removing inline styles.
 */

const fs = require('fs');
const path = require('path');

// Check if force update is requested
const forceUpdate = process.argv.includes('--force');
// Check if complete update is requested
const completeUpdate = process.argv.includes('--complete');

console.log("Starting icon unification process...");
if (forceUpdate) {
  console.log("Force update mode enabled - will update all files regardless of current structure");
}
if (completeUpdate) {
  console.log("Complete update mode enabled - will update entire page structure");
}

// Define the DALL-E 3 style CSS
const dalleLogoStyle = `.tool-logo {
  width: 120px;
  height: 120px;
  border-radius: 1.5rem;
  object-fit: cover;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}`;

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

// Get the dalle-3.html file content for reference
const dalle3FilePath = path.join(toolsDir, 'dalle-3.html');
let dalle3Structure = '';
let dalle3StyleContent = '';
let dalle3HeaderContent = '';
let dalle3FooterContent = '';
let dalle3FullContent = '';

if (fs.existsSync(dalle3FilePath)) {
  console.log(`Found DALL-E 3 reference file at ${dalle3FilePath}`);
  const dalle3Content = fs.readFileSync(dalle3FilePath, 'utf8');
  dalle3FullContent = dalle3Content;
  
  // Extract the style content
  const styleMatch = dalle3Content.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch && styleMatch[1]) {
    dalle3StyleContent = styleMatch[1].trim();
    console.log("Successfully extracted DALL-E 3 style content as reference");
  }
  
  // Extract the header structure
  const headerElementMatch = dalle3Content.match(/<header>([\s\S]*?)<\/header>/);
  if (headerElementMatch && headerElementMatch[1]) {
    dalle3HeaderContent = headerElementMatch[1].trim();
    console.log("Successfully extracted DALL-E 3 header element as reference");
  }
  
  // Extract the footer structure
  const footerElementMatch = dalle3Content.match(/<footer>([\s\S]*?)<\/footer>/);
  if (footerElementMatch && footerElementMatch[1]) {
    dalle3FooterContent = footerElementMatch[1].trim();
    console.log("Successfully extracted DALL-E 3 footer element as reference");
  }
  
  // Extract the tool-header structure
  const headerMatch = dalle3Content.match(/<div class="tool-header">([\s\S]*?)<\/div>\s*<div class="tool-content">/);
  if (headerMatch && headerMatch[1]) {
    dalle3Structure = headerMatch[1].trim();
    console.log("Successfully extracted DALL-E 3 header structure as reference");
  } else {
    console.log("Failed to extract DALL-E 3 header structure. Using default approach.");
  }
} else {
  console.log("DALL-E 3 reference file not found. Using default approach.");
}

// Get all HTML files
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html') && file !== 'dalle-3.html');
console.log(`Found ${files.length} tool pages to update`);

// Process each file
let updatedCount = 0;
let skippedCount = 0;
files.forEach((file, index) => {
  console.log(`Processing file ${index + 1}/${files.length}: ${file}`);
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // If complete update is enabled, use DALL-E 3 as a complete template
  if (completeUpdate && dalle3FullContent) {
    // Extract key information from the current file
    const metaDescriptionMatch = content.match(/<meta name="description" content="([^"]*)">/);
    const metaKeywordsMatch = content.match(/<meta name="keywords" content="([^"]*)">/);
    const titleMatch = content.match(/<title>([^<]*)<\/title>/);
    
    const toolTitleMatch = content.match(/<h1 class="tool-title">(.*?)<\/h1>/);
    const toolTitle = toolTitleMatch ? toolTitleMatch[1].trim() : file.replace('.html', '');
    
    // Extract logo (if any)
    let logoContent = '';
    const svgLogoMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    const imgLogoMatch = content.match(/<img[^>]*class="tool-logo"[^>]*>/);
    
    if (svgLogoMatch) {
      logoContent = svgLogoMatch[0];
    } else if (imgLogoMatch) {
      logoContent = imgLogoMatch[0];
    } else {
      // Create a placeholder SVG with the tool's initials
      const initials = toolTitle.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      
      logoContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="${randomColor}"/>
                <text x="50" y="50" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
            </svg>`;
    }
    
    // Extract category, rating, and views
    const categoryMatch = content.match(/<span class="tool-category">([\s\S]*?)<\/span>/);
    const categoryContent = categoryMatch ? categoryMatch[0] : '<span class="tool-category"><i class="fas fa-tools"></i> Tool</span>';
    
    const ratingMatch = content.match(/<span class="tool-rating">([\s\S]*?)<\/span>/);
    const ratingContent = ratingMatch ? ratingMatch[0] : '<span class="tool-rating"><i class="fas fa-star"></i> 4.5</span>';
    
    const viewsMatch = content.match(/<span class="tool-views">([\s\S]*?)<\/span>/);
    const viewsContent = viewsMatch ? viewsMatch[0] : '<span class="tool-views"><i class="fas fa-eye"></i> 100,000</span>';
    
    // Extract description
    const descriptionMatch = content.match(/<p class="tool-description">([\s\S]*?)<\/p>/);
    let descriptionContent = '';
    if (descriptionMatch) {
      descriptionContent = descriptionMatch[0];
    } else if (metaDescriptionMatch) {
      descriptionContent = `<p class="tool-description">${metaDescriptionMatch[1]}</p>`;
    } else {
      descriptionContent = `<p class="tool-description">${toolTitle} is an AI-powered tool for enhancing productivity.</p>`;
    }
    
    // Extract website URL
    const websiteUrlMatch = content.match(/href="(https?:\/\/[^"]*)"[^>]*>Visit Website<\/a>/);
    const websiteUrl = websiteUrlMatch ? websiteUrlMatch[1] : `https://${toolTitle.toLowerCase().replace(/\s+/g, '-')}.com`;
    
    // Extract overview section
    const overviewMatch = content.match(/<section class="section">[\s\S]*?<h2[^>]*>[\s\S]*?Overview[\s\S]*?<\/h2>[\s\S]*?<div class="section-content">([\s\S]*?)<\/div>[\s\S]*?<\/section>/);
    let overviewContent = '';
    if (overviewMatch && overviewMatch[1]) {
      overviewContent = overviewMatch[1].trim();
    } else if (metaDescriptionMatch) {
      overviewContent = `<p>${metaDescriptionMatch[1]}</p>`;
    } else {
      overviewContent = `<p>${toolTitle} provides advanced AI capabilities to help users with their tasks.</p>`;
    }
    
    // Extract pricing section
    const pricingMatch = content.match(/<section class="section">[\s\S]*?<h2[^>]*>[\s\S]*?Pricing[\s\S]*?<\/h2>[\s\S]*?<div class="pricing-cards">([\s\S]*?)<\/div>[\s\S]*?<\/section>/);
    const pricingContent = pricingMatch && pricingMatch[1].trim() ? pricingMatch[1].trim() : 
    `<div class="pricing-card">
        <h3>Free</h3>
        <div class="price">$0</div>
        <ul>
            <li>Basic features</li>
            <li>Limited usage</li>
            <li>Community support</li>
        </ul>
        <a href="${websiteUrl}" class="btn" target="_blank" rel="noopener noreferrer">Get Started</a>
    </div>
    <div class="pricing-card popular">
        <h3>Pro</h3>
        <div class="price">$19/month</div>
        <ul>
            <li>All features</li>
            <li>Unlimited usage</li>
            <li>Priority support</li>
            <li>Advanced options</li>
        </ul>
        <a href="${websiteUrl}/pricing" class="btn" target="_blank" rel="noopener noreferrer">Go Pro</a>
    </div>
    <div class="pricing-card">
        <h3>Enterprise</h3>
        <div class="price">Custom</div>
        <ul>
            <li>Custom solutions</li>
            <li>Dedicated support</li>
            <li>SLA guarantee</li>
            <li>Custom integrations</li>
        </ul>
        <a href="${websiteUrl}/enterprise" class="btn" target="_blank" rel="noopener noreferrer">Contact Sales</a>
    </div>`;
    
    // Extract ratings section
    const ratingsMatch = content.match(/<div class="rating-stars">([\s\S]*?)<\/div>[\s\S]*?<div class="rating-score">([\s\S]*?)<\/div>[\s\S]*?<div class="rating-count">([\s\S]*?)<\/div>/);
    const ratingStars = ratingsMatch && ratingsMatch[1] ? ratingsMatch[1].trim() : '★★★★★';
    const ratingScore = ratingsMatch && ratingsMatch[2] ? ratingsMatch[2].trim() : '4.7 out of 5';
    const ratingCount = ratingsMatch && ratingsMatch[3] ? ratingsMatch[3].trim() : 'Based on 1,000+ reviews';
    
    // Extract quick info
    const quickInfoMatch = content.match(/<div class="info-card">[\s\S]*?<h3[^>]*>[\s\S]*?Quick Info[\s\S]*?<\/h3>[\s\S]*?<ul class="info-list">([\s\S]*?)<\/ul>[\s\S]*?<\/div>/);
    const quickInfoContent = quickInfoMatch && quickInfoMatch[1].trim() ? quickInfoMatch[1].trim() : 
    `<li class="info-item">
        <i class="fas fa-calendar"></i>
        <span>Launched: 2023</span>
    </li>
    <li class="info-item">
        <i class="fas fa-building"></i>
        <span>Company: ${toolTitle} Inc.</span>
    </li>
    <li class="info-item">
        <i class="fas fa-globe"></i>
        <span>Website: ${websiteUrl.replace('https://', '')}</span>
    </li>
    <li class="info-item">
        <i class="fas fa-users"></i>
        <span>Users: 100K+</span>
    </li>
    <li class="info-item">
        <i class="fas fa-check-circle"></i>
        <span>Status: Active</span>
    </li>`;
    
    // Build the new content from the template
    content = dalle3FullContent
      // Update meta tags and title
      .replace(/<meta name="description" content="([^"]*)">/, metaDescriptionMatch ? metaDescriptionMatch[0] : `<meta name="description" content="${toolTitle} - AI-powered tool">`)
      .replace(/<meta name="keywords" content="([^"]*)">/, metaKeywordsMatch ? metaKeywordsMatch[0] : `<meta name="keywords" content="${toolTitle}, AI, tool">`)
      .replace(/<title>([^<]*)<\/title>/, titleMatch ? titleMatch[0] : `<title>${toolTitle} | SoniceAi</title>`)
      
      // Update tool header content
      .replace(/<h1 class="tool-title">([^<]*)<\/h1>/, `<h1 class="tool-title">${toolTitle}</h1>`)
      .replace(/<div class="tool-logo">[\s\S]*?<\/div>/, `<div class="tool-logo">${logoContent}</div>`)
      .replace(/<span class="tool-category">[\s\S]*?<\/span>/, categoryContent)
      .replace(/<span class="tool-rating">[\s\S]*?<\/span>/, ratingContent)
      .replace(/<span class="tool-views">[\s\S]*?<\/span>/, viewsContent)
      .replace(/<p class="tool-description">[\s\S]*?<\/p>/, descriptionContent)
      .replace(/href="https:\/\/openai.com\/dall-e-3"[^>]*>Visit Website<\/a>/, `href="${websiteUrl}" target="_blank" rel="noopener noreferrer">Visit Website</a>`)
      
      // Update main content
      .replace(/<div class="section-content">[\s\S]*?<\/div>/, `<div class="section-content">${overviewContent}</div>`)
      .replace(/<div class="pricing-cards">[\s\S]*?<\/div>(?=\s*<\/section>)/, `<div class="pricing-cards">${pricingContent}</div>`)
      
      // Update ratings
      .replace(/<div class="rating-stars">[\s\S]*?<\/div>/, `<div class="rating-stars">${ratingStars}</div>`)
      .replace(/<div class="rating-score">[\s\S]*?<\/div>/, `<div class="rating-score">${ratingScore}</div>`)
      .replace(/<div class="rating-count">[\s\S]*?<\/div>/, `<div class="rating-count">${ratingCount}</div>`)
      
      // Update quick info
      .replace(/<ul class="info-list">[\s\S]*?<\/ul>(?=\s*<\/div>)/, `<ul class="info-list">${quickInfoContent}</ul>`)
      
      // Update share links
      .replace(/https:\/\/twitter.com\/intent\/tweet\?[^"]*/, `https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(toolTitle)}%20-%20AI-powered%20tool&url=${encodeURIComponent(websiteUrl)}`)
      .replace(/https:\/\/www.facebook.com\/sharer\/sharer.php\?[^"]*/, `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`);
    
    console.log(`  Completely updated ${file} with DALL-E 3 template`);
  } else {
    // Otherwise, just update specific parts
    if (forceUpdate && dalle3StyleContent) {
      // If force update is enabled and we have dalle-3 style content, replace the entire style section
      const styleRegex = /<style>[\s\S]*?<\/style>/;
      if (styleRegex.test(content)) {
        console.log(`  Force updating entire style section in ${file}`);
        content = content.replace(styleRegex, `<style>${dalle3StyleContent}</style>`);
      }
    } else {
      // Just update the logo style as before
      const logoStyleRegex = /\.tool-logo\s*{[^}]*}/;
      if (logoStyleRegex.test(content)) {
        console.log(`  Found logo style in ${file}, updating to DALL-E 3 style`);
        content = content.replace(logoStyleRegex, dalleLogoStyle);
      } else {
        console.log(`  No existing logo style found in ${file}, will add it`);
        // Try to add the style to the end of the CSS section
        const styleEndRegex = /<\/style>/;
        if (styleEndRegex.test(content)) {
          content = content.replace(styleEndRegex, `${dalleLogoStyle}\n    </style>`);
        }
      }
    }
    
    // Update header if we have the reference and force update is enabled
    if (forceUpdate && dalle3HeaderContent) {
      const headerRegex = /<header>[\s\S]*?<\/header>/;
      if (headerRegex.test(content)) {
        console.log(`  Updating header in ${file}`);
        content = content.replace(headerRegex, `<header>${dalle3HeaderContent}</header>`);
      }
    }
    
    // Update footer if we have the reference and force update is enabled
    if (forceUpdate && dalle3FooterContent) {
      const footerRegex = /<footer>[\s\S]*?<\/footer>/;
      if (footerRegex.test(content)) {
        console.log(`  Updating footer in ${file}`);
        content = content.replace(footerRegex, `<footer>${dalle3FooterContent}</footer>`);
      }
    }

    // Then, clean up any inline styles on img elements
    const imgTagRegex = /<img[^>]*class="tool-logo"[^>]*>/g;
    let imgTagMatches = content.match(imgTagRegex);
    let logoImgTag = '';
    
    if (imgTagMatches && imgTagMatches.length > 0) {
      console.log(`  Found ${imgTagMatches.length} logo image tags in ${file}`);
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

        logoImgTag = newTag; // Save the cleaned logo tag
        return newTag;
      });
    } else {
      console.log(`  No logo image tags found in ${file}`);
    }

    // Now restructure the tool-header to match DALL-E 3's structure
    const toolHeaderRegex = /<div class="tool-header">([\s\S]*?)<\/div>\s*<div class="tool-content">/;
    const headerMatch = content.match(toolHeaderRegex);
    
    if (headerMatch) {
      console.log(`  Found tool header in ${file}, checking structure`);
      content = content.replace(toolHeaderRegex, (match, headerContent) => {
        // If force update is enabled or the structure doesn't match, replace it
        if (forceUpdate || !headerContent.includes('tool-title-wrapper')) {
          console.log(`  Restructuring header in ${file} to match DALL-E 3`);
          // Extract the tool title
          const titleMatch = headerContent.match(/<h1 class="tool-title">(.*?)<\/h1>/);
          const toolTitle = titleMatch ? titleMatch[1].trim() : '';
          console.log(`  Tool title: "${toolTitle}"`);

          // Extract the tool info div
          const infoMatch = headerContent.match(/<div class="tool-info">([\s\S]*?)<\/div>/);
          const toolInfo = infoMatch ? infoMatch[1].trim() : '';

          // Create the new structure
          const newHeader = `<div class="tool-header">
    <div class="tool-info">
        <div class="tool-title-wrapper">
            ${logoImgTag}
            <h1 class="tool-title">${toolTitle}</h1>
        </div>
        ${toolInfo.replace(/<h1 class="tool-title">.*?<\/h1>/, '')}
    </div>
</div>
<div class="tool-content">`;

          return newHeader;
        } else {
          console.log(`  File ${file} already has the correct structure`);
          return match;
        }
      });
    } else {
      console.log(`  No tool header found in ${file} or regex didn't match`);
    }
  }

  // If the content changed, write it back to the file
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    updatedCount++;
    console.log(`  Updated icon style and structure in ${file}`);
  } else {
    skippedCount++;
    console.log(`  No changes needed for ${file}`);
  }
});

console.log(`\nSummary:`);
console.log(`Updated ${updatedCount} out of ${files.length} tool pages`);
console.log(`Skipped ${skippedCount} tool pages (no changes needed)`);
console.log('All tool pages now use consistent icon sizes and structure matching the DALL-E 3 style.');
console.log('Process completed successfully!'); 