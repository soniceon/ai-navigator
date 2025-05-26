const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const config = {
  localesDir: path.resolve(process.cwd(), 'public/locales'),
  srcDir: path.resolve(process.cwd(), 'src'),
  defaultLocale: 'en',
  requiredLocales: ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'],
  ignorePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/out/**',
    '**/build/**',
    '**/dist/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/checkI18n.js',
    '**/checkCategoryI18n.js',
    '**/checkI18nKeys.js'
  ]
};

// 工具函数
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function getAllTranslationKeys(json) {
  const keys = new Set();
  function extractKeys(obj, prefix = '') {
    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractKeys(obj[key], newKey);
      } else {
        keys.add(newKey);
      }
    }
  }
  extractKeys(json);
  return keys;
}

function findTranslationKeysInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = new Set();
  
  // 匹配 t('key') 或 t("key") 模式
  const tFunctionRegex = /t\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = tFunctionRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  // 匹配 useTranslation('namespace') 模式
  const namespaceRegex = /useTranslation\(['"]([^'"]+)['"]\)/g;
  while ((match = namespaceRegex.exec(content)) !== null) {
    keys.add(`namespace:${match[1]}`);
  }
  
  return keys;
}

// 主检查函数
async function checkI18n() {
  console.log('开始检查国际化...\n');
  
  // 1. 检查语言包目录
  console.log('1. 检查语言包目录...');
  const localeDirs = fs.readdirSync(config.localesDir)
    .filter(f => fs.statSync(path.join(config.localesDir, f)).isDirectory());
  
  if (localeDirs.length === 0) {
    console.error('错误: 未找到语言包目录');
    return;
  }
  
  // 2. 检查必需的语言包
  console.log('\n2. 检查必需的语言包...');
  const missingLocales = config.requiredLocales.filter(locale => 
    !localeDirs.includes(locale)
  );
  
  if (missingLocales.length > 0) {
    console.error('错误: 缺少以下语言包目录:', missingLocales.join(', '));
  }
  
  // 3. 收集所有翻译键
  console.log('\n3. 收集翻译键...');
  const defaultLocaleDir = path.join(config.localesDir, config.defaultLocale);
  if (!fs.existsSync(defaultLocaleDir)) {
    console.error('错误: 未找到默认语言包目录');
    return;
  }
  
  const defaultLocaleFiles = fs.readdirSync(defaultLocaleDir)
    .filter(f => f.endsWith('.json'));
  
  if (defaultLocaleFiles.length === 0) {
    console.error('错误: 默认语言包目录中没有JSON文件');
    return;
  }
  
  const defaultTranslations = {};
  defaultLocaleFiles.forEach(file => {
    const namespace = file.replace('.json', '');
    const translations = readJsonFile(path.join(defaultLocaleDir, file));
    if (translations) {
      defaultTranslations[namespace] = translations;
    }
  });
  
  const allKeys = new Set();
  Object.entries(defaultTranslations).forEach(([namespace, translations]) => {
    const keys = getAllTranslationKeys(translations);
    keys.forEach(key => allKeys.add(`${namespace}.${key}`));
  });
  
  // 4. 检查其他语言包的翻译
  console.log('\n4. 检查其他语言包的翻译...');
  const translationIssues = {};
  const autoFixableIssues = new Set();
  const manualFixIssues = new Set();
  
  localeDirs.forEach(locale => {
    if (locale === config.defaultLocale) return;
    
    const localeDir = path.join(config.localesDir, locale);
    const localeFiles = fs.readdirSync(localeDir)
      .filter(f => f.endsWith('.json'));
    
    const localeTranslations = {};
    localeFiles.forEach(file => {
      const namespace = file.replace('.json', '');
      const translations = readJsonFile(path.join(localeDir, file));
      if (translations) {
        localeTranslations[namespace] = translations;
      }
    });
    
    const localeKeys = new Set();
    Object.entries(localeTranslations).forEach(([namespace, translations]) => {
      const keys = getAllTranslationKeys(translations);
      keys.forEach(key => localeKeys.add(`${namespace}.${key}`));
    });
    
    const missingKeys = [...allKeys].filter(key => !localeKeys.has(key));
    const extraKeys = [...localeKeys].filter(key => !allKeys.has(key));
    
    if (missingKeys.length > 0 || extraKeys.length > 0) {
      translationIssues[locale] = {
        missing: missingKeys,
        extra: extraKeys
      };
      
      // 分类问题
      missingKeys.forEach(key => {
        if (key.includes('key_') || key.includes('common.')) {
          autoFixableIssues.add(`${locale}.${key}`);
        } else {
          manualFixIssues.add(`${locale}.${key}`);
        }
      });
    }
  });
  
  // 5. 检查代码中的翻译使用
  console.log('\n5. 检查代码中的翻译使用...');
  const srcFiles = glob.sync('**/*.{js,jsx,ts,tsx}', {
    cwd: config.srcDir,
    ignore: config.ignorePatterns
  });
  
  const codeTranslationKeys = new Set();
  srcFiles.forEach(file => {
    const filePath = path.join(config.srcDir, file);
    const keys = findTranslationKeysInFile(filePath);
    keys.forEach(key => codeTranslationKeys.add(key));
  });
  
  // 6. 检查未使用的翻译键
  const unusedKeys = [...allKeys].filter(key => !codeTranslationKeys.has(key));
  
  // 7. 检查翻译质量
  console.log('\n7. 检查翻译质量...');
  const qualityIssues = {};
  
  localeDirs.forEach(locale => {
    const localeDir = path.join(config.localesDir, locale);
    const localeFiles = fs.readdirSync(localeDir)
      .filter(f => f.endsWith('.json'));
    
    const issues = [];
    localeFiles.forEach(file => {
      const namespace = file.replace('.json', '');
      const translations = readJsonFile(path.join(localeDir, file));
      if (!translations) return;
      
      function checkQuality(obj, prefix = '') {
        for (const key in obj) {
          const value = obj[key];
          const fullKey = prefix ? `${prefix}.${key}` : key;
          
          if (typeof value === 'string') {
            // 检查空翻译
            if (!value.trim()) {
              issues.push({
                namespace,
                key: fullKey,
                type: 'empty',
                message: '翻译为空'
              });
              autoFixableIssues.add(`${locale}.${namespace}.${fullKey}`);
            }
            
            // 检查占位符
            const placeholders = value.match(/\{\{.*?\}\}/g) || [];
            const defaultPlaceholders = defaultTranslations[namespace]?.[fullKey]?.match(/\{\{.*?\}\}/g) || [];
            
            if (placeholders.length !== defaultPlaceholders.length) {
              issues.push({
                namespace,
                key: fullKey,
                type: 'placeholder',
                message: '占位符数量不匹配'
              });
              manualFixIssues.add(`${locale}.${namespace}.${fullKey}`);
            }
          } else if (typeof value === 'object' && value !== null) {
            checkQuality(value, fullKey);
          }
        }
      }
      
      checkQuality(translations);
    });
    
    if (issues.length > 0) {
      qualityIssues[locale] = issues;
    }
  });
  
  // 8. 输出详细报告
  console.log('\n=== 国际化检查报告 ===');
  
  if (missingLocales.length > 0) {
    console.log('\n缺少的语言包:');
    missingLocales.forEach(locale => console.log(`- ${locale}`));
  }
  
  if (Object.keys(translationIssues).length > 0) {
    console.log('\n翻译问题:');
    Object.entries(translationIssues).forEach(([locale, issues]) => {
      console.log(`\n[${locale}]:`);
      if (issues.missing.length > 0) {
        console.log('  缺失的翻译键:');
        issues.missing.forEach(key => console.log(`  - ${key}`));
      }
      if (issues.extra.length > 0) {
        console.log('  多余的翻译键:');
        issues.extra.forEach(key => console.log(`  - ${key}`));
      }
    });
  }
  
  if (unusedKeys.length > 0) {
    console.log('\n未使用的翻译键:');
    unusedKeys.forEach(key => console.log(`- ${key}`));
  }
  
  if (Object.keys(qualityIssues).length > 0) {
    console.log('\n翻译质量问题:');
    Object.entries(qualityIssues).forEach(([locale, issues]) => {
      console.log(`\n[${locale}]:`);
      issues.forEach(issue => {
        console.log(`  - ${issue.namespace}.${issue.key}: ${issue.message}`);
      });
    });
  }
  
  // 9. 输出可自动修复和需要手动修复的问题
  console.log('\n=== 问题分类 ===');
  console.log('\n可自动修复的问题:');
  autoFixableIssues.forEach(issue => console.log(`- ${issue}`));
  
  console.log('\n需要手动修复的问题:');
  manualFixIssues.forEach(issue => console.log(`- ${issue}`));
  
  // 10. 总结
  console.log('\n=== 检查完成 ===');
  const hasIssues = 
    missingLocales.length > 0 ||
    Object.keys(translationIssues).length > 0 ||
    unusedKeys.length > 0 ||
    Object.keys(qualityIssues).length > 0;
    
  if (hasIssues) {
    console.log('\n发现以下问题需要处理:');
    if (missingLocales.length > 0) console.log('- 缺少必需的语言包');
    if (Object.keys(translationIssues).length > 0) console.log('- 存在翻译不一致');
    if (unusedKeys.length > 0) console.log('- 存在未使用的翻译键');
    if (Object.keys(qualityIssues).length > 0) console.log('- 存在翻译质量问题');
    
    console.log(`\n总计: ${autoFixableIssues.size} 个问题可自动修复`);
    console.log(`总计: ${manualFixIssues.size} 个问题需要手动修复`);
  } else {
    console.log('\n恭喜！未发现国际化问题。');
  }
}

// 运行检查
checkI18n().catch(console.error); 