const fs = require('fs');
const path = require('path');

// 工具名称到颜色的映射
const TOOL_COLORS = {
  'default': '#6b21a8',
  'chatgpt': '#10a37f',
  'stable-diffusion': '#a259ff',
  'midjourney': '#0a7cff',
  'anthropic': '#d09a62',
  'claude': '#5436da',
  'dalle-3': '#ff4d4d',
  'gemini': '#1a73e8',
  'perplexity': '#5436da',
  'copilot': '#2ea043',
  'github-copilot': '#2ea043',
  'grammarly': '#15c39a',
  'jasper': '#fa6040',
  'notion-ai': '#000000',
  'replicate': '#1b05eb',
  'runwayml': '#1904de',
  'huggingface': '#ff5d5b',
  'elevenlabs': '#5236ff',
  'leonardo-ai': '#f08080',
  'figma-ai': '#1abcfe',
};

// 工具目录
const TOOLS_DIR = path.join(__dirname, '../pages/tools');

// 获取所有HTML文件
const files = fs.readdirSync(TOOLS_DIR).filter(file => file.endsWith('.html'));

// 处理每个文件
files.forEach(file => {
  const filePath = path.join(TOOLS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 提取工具名称（文件名去掉.html后缀）
  const toolName = file.replace('.html', '');
  
  // 选择颜色
  const color = TOOL_COLORS[toolName] || TOOL_COLORS['default'];
  
  // 获取显示文本（可以是首字母或自定义缩写）
  let displayText = toolName.split('-').map(part => part[0]).join('').toUpperCase();
  if (toolName === 'chatgpt') displayText = 'GPT';
  if (toolName === 'stable-diffusion') displayText = 'SD';
  if (toolName === 'anthropic') displayText = 'AC';
  if (toolName === 'dalle-3') displayText = 'DE3';
  
  // 替换图标
  let newContent = content.replace(
    /<img\s+src="[^"]*"[^>]*class="tool-logo"[^>]*>/g,
    `<div class="tool-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="${color}"/>
            <text x="50" y="50" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${displayText}</text>
        </svg>
    </div>`
  );
  
  // 修复页脚链接
  newContent = newContent.replace(
    /<a href="\/([^"]*)"([^>]*)>/g, 
    '<a href="../../$1"$2>'
  );
  
  // 将链接中的 "/pages/" 替换为 "../../pages/"
  newContent = newContent.replace(
    /<a href="..\/..\/([^"\/]*)"([^>]*)>/g, 
    '<a href="../../$1"$2>'
  );

  // 修复页脚样式
  newContent = newContent.replace(
    /<footer style="[^"]*">/g,
    '<footer>'
  );
  
  // 修复内部链接的格式
  newContent = newContent.replace(
    /<div style="[^"]*" class="footer-content">/g,
    '<div class="footer-content">'
  );
  
  // 保存文件
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated ${file}`);
});

console.log('All tool pages updated successfully!'); 