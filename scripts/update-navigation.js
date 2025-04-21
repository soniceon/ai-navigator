/**
 * update-navigation.js
 * 
 * 此脚本用于更新所有HTML页面的导航栏和页脚，确保它们使用一致的模板，
 * 并根据页面层级设置正确的相对路径链接。
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 读取模板文件
const headerTemplate = fs.readFileSync(path.join(__dirname, '../templates/header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(__dirname, '../templates/footer.html'), 'utf8');

// 提取header和footer的主要部分
const headerDom = cheerio.load(headerTemplate);
const footerDom = cheerio.load(footerTemplate);

const headerHtml = headerDom('header').toString();
const footerHtml = footerDom('footer').toString();
const headerStyle = headerDom('style').toString();
const footerStyle = footerDom('style').toString();
const headerScript = headerDom('script').toString();

// 定义要处理的目录
const directories = [
  {
    path: '.',
    baseUrl: './'
  },
  {
    path: 'pages',
    baseUrl: '../'
  },
  {
    path: 'pages/tools',
    baseUrl: '../../'
  }
];

// 处理单个HTML文件
function processHtmlFile(filePath, baseUrl) {
  console.log(`处理文件: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    // 备份原始文件
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.writeFileSync(path.join(backupDir, path.basename(filePath)), content);
    
    // 替换BASE_URL变量
    let updatedHeader = headerHtml.replace(/\$BASE_URL\$/g, baseUrl);
    let updatedFooter = footerHtml.replace(/\$BASE_URL\$/g, baseUrl);
    
    // 添加样式到head
    const styles = headerStyle + footerStyle;
    $('head').append(styles);
    
    // 替换header和footer
    $('header').replaceWith(updatedHeader);
    $('footer').replaceWith(updatedFooter);
    
    // 添加脚本到body末尾
    $('body').append(headerScript);
    
    // 保存更新后的文件
    fs.writeFileSync(filePath, $.html());
    
    console.log(`✅ 已更新: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ 处理文件 ${filePath} 时出错: ${error.message}`);
    return false;
  }
}

// 递归处理目录中的所有HTML文件
function processDirectory(dir, baseUrl) {
  console.log(`处理目录: ${dir}`);
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // 跳过node_modules, .git等目录
      if (item !== 'node_modules' && item !== '.git' && item !== 'backups') {
        processDirectory(itemPath, baseUrl + '../');
      }
    } else if (stat.isFile() && item.endsWith('.html')) {
      processHtmlFile(itemPath, baseUrl);
    }
  }
}

// 主函数
function main() {
  console.log('开始更新导航栏和页脚...');
  
  for (const dir of directories) {
    const dirPath = path.join(__dirname, '..', dir.path);
    processDirectory(dirPath, dir.baseUrl);
  }
  
  console.log('导航栏和页脚更新完成!');
}

// 执行主函数
main(); 