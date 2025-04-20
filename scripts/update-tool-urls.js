const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 工具映射: 文件名到正确的URL
const toolUrlMap = {
  'adobe-firefly.html': 'https://firefly.adobe.com/',
  'anthropic-claude.html': 'https://claude.ai/',
  'anthropic.html': 'https://www.anthropic.com/',
  'beautiful-ai.html': 'https://www.beautiful.ai/',
  'canva-ai.html': 'https://www.canva.com/ai-tools/',
  'character-ai.html': 'https://character.ai/',
  'chatgpt.html': 'https://chat.openai.com/',
  'claude-2.html': 'https://claude.ai/',
  'claude.html': 'https://claude.ai/',
  'copilot.html': 'https://copilot.microsoft.com/',
  'copy-ai.html': 'https://www.copy.ai/',
  'd-id.html': 'https://www.d-id.com/',
  'dall-e.html': 'https://openai.com/dall-e-3',
  'datadog.html': 'https://www.datadog.com/',
  'deepcode.html': 'https://www.deepcode.ai/',
  'descript.html': 'https://www.descript.com/',
  'elevenlabs.html': 'https://elevenlabs.io/',
  'figma-ai.html': 'https://www.figma.com/ai/',
  'fireflies-ai.html': 'https://fireflies.ai/',
  'gemini.html': 'https://gemini.google.com/',
  'gitguardian.html': 'https://www.gitguardian.com/',
  'github-copilot.html': 'https://github.com/features/copilot',
  'grammarly-ai.html': 'https://www.grammarly.com/',
  'grammarly.html': 'https://www.grammarly.com/',
  'huggingface.html': 'https://huggingface.co/',
  'jasper.html': 'https://www.jasper.ai/',
  'jenni-ai.html': 'https://jenni.ai/',
  'leonardo-ai.html': 'https://leonardo.ai/',
  'luma-ai.html': 'https://lumalabs.ai/',
  'midjourney.html': 'https://www.midjourney.com/',
  'notion-ai.html': 'https://www.notion.so/product/ai',
  'perplexity-ai.html': 'https://www.perplexity.ai/',
  'perplexity.html': 'https://www.perplexity.ai/',
  'replicate.html': 'https://replicate.com/',
  'runway.html': 'https://runwayml.com/',
  'stability-ai.html': 'https://stability.ai/',
  'stable-diffusion.html': 'https://stability.ai/stable-diffusion',
  'synthesia.html': 'https://www.synthesia.io/',
  'tabnine.html': 'https://www.tabnine.com/',
  'tome-ai.html': 'https://tome.app/'
};

// 要跳过的特殊文件
const skipFiles = ['all-tools.html', 'ranking.html'];

// 工具目录
const toolsDir = path.join(__dirname, '..', 'pages', 'tools');

// 检查目录是否存在
if (!fs.existsSync(toolsDir)) {
  console.error(`工具目录不存在: ${toolsDir}`);
  process.exit(1);
}

// 获取所有HTML文件
const files = fs.readdirSync(toolsDir)
  .filter(file => file.endsWith('.html') && !skipFiles.includes(file));

console.log(`开始更新工具URL...\n工具目录: ${toolsDir}`);
console.log(`找到 ${files.length} 个工具页面需要检查\n`);

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

// 处理每个文件
files.forEach((file, index) => {
  console.log(`处理 ${index + 1}/${files.length}: ${file}`);
  
  // 如果文件没有在映射中，则跳过
  if (!toolUrlMap[file]) {
    console.log(`  ⚠️ 跳过: 在URL映射中找不到 "${file}"`);
    skippedCount++;
    return;
  }
  
  const filePath = path.join(toolsDir, file);
  const correctUrl = toolUrlMap[file];
  
  try {
    // 读取HTML文件
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    
    // 找到所有URL，并进行更新
    let urlsUpdated = false;
    
    // 1. 更新"Visit Website"按钮链接
    $('.primary-btn').each(function() {
      const btnText = $(this).text().trim();
      if (btnText.includes('Visit Website')) {
        const oldUrl = $(this).attr('href');
        $(this).attr('href', correctUrl);
        if (oldUrl !== correctUrl) {
          console.log(`  ✅ 已更新"Visit Website"按钮URL:`);
          console.log(`     旧URL: ${oldUrl}`);
          console.log(`     新URL: ${correctUrl}`);
          urlsUpdated = true;
        }
      }
    });
    
    // 2. 更新工具网站链接（如果有）
    $('.tool-website a').each(function() {
      const oldUrl = $(this).attr('href');
      $(this).attr('href', correctUrl);
      if (oldUrl !== correctUrl && !urlsUpdated) {
        console.log(`  ✅ 已更新工具网站链接URL:`);
        console.log(`     旧URL: ${oldUrl}`);
        console.log(`     新URL: ${correctUrl}`);
        urlsUpdated = true;
      }
    });
    
    // 3. 更新快速信息卡中的Website部分
    $('.info-item').each(function() {
      const itemText = $(this).text().trim();
      if (itemText.includes('Website:')) {
        // 可能只需要更新显示文本，因为这部分通常不是链接
        const websiteSpan = $(this).find('span');
        if (websiteSpan.length > 0) {
          const domain = new URL(correctUrl).hostname;
          websiteSpan.text(domain);
          urlsUpdated = true;
        }
      }
    });
    
    // 4. 更新meta标签中的URL（如果有的话）
    $('meta[property="og:url"]').attr('content', correctUrl);
    
    // 5. 更新社交分享链接
    $('a[href*="sharer"]').each(function() {
      const href = $(this).attr('href');
      if (href) {
        // 提取原始网址，并替换为新网址
        const match = href.match(/[?&]u(?:rl)?=([^&]+)/);
        if (match) {
          const oldShareUrl = decodeURIComponent(match[1]);
          const newHref = href.replace(oldShareUrl, correctUrl);
          $(this).attr('href', newHref);
          urlsUpdated = true;
        }
      }
    });
    
    // 保存文件
    fs.writeFileSync(filePath, $.html(), 'utf8');
    
    if (urlsUpdated) {
      updatedCount++;
    } else {
      console.log(`  ℹ️ URL已经是正确的: ${correctUrl}`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`  ❌ 处理 "${file}" 时出错: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n=== 工具URL更新摘要 ===`);
console.log(`检查的文件总数: ${files.length}`);
console.log(`更新的URL数量: ${updatedCount}`);
console.log(`跳过的文件数量: ${skippedCount}`);
console.log(`错误的文件数量: ${errorCount}`);

console.log(`\n完成! 已更新 ${updatedCount} 个工具的URL。`); 