const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto');
const axios = require('axios');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SRC_DIR = path.join(__dirname, '../src');
const SUPPORTED_LANGUAGES = ['zh', 'ko', 'ja', 'fr', 'de', 'es', 'ru'];

// 术语表 - 确保翻译一致性
const TERMS = {
  'AI': {
    zh: 'AI',
    ko: 'AI',
    ja: 'AI',
    fr: 'IA',
    de: 'KI',
    es: 'IA',
    ru: 'ИИ'
  },
  'GPT': {
    zh: 'GPT',
    ko: 'GPT',
    ja: 'GPT',
    fr: 'GPT',
    de: 'GPT',
    es: 'GPT',
    ru: 'GPT'
  },
  'Chatbot': {
    zh: '聊天机器人',
    ko: '챗봇',
    ja: 'チャットボット',
    fr: 'Chatbot',
    de: 'Chatbot',
    es: 'Chatbot',
    ru: 'Чатбот'
  },
  'API': {
    zh: 'API',
    ko: 'API',
    ja: 'API',
    fr: 'API',
    de: 'API',
    es: 'API',
    ru: 'API'
  },
  'Dashboard': {
    zh: '仪表板',
    ko: '대시보드',
    ja: 'ダッシュボード',
    fr: 'Tableau de bord',
    de: 'Dashboard',
    es: 'Panel de control',
    ru: 'Панель управления'
  },
  'Plugin': {
    zh: '插件',
    ko: '플러그인',
    ja: 'プラグイン',
    fr: 'Plugin',
    de: 'Plugin',
    es: 'Plugin',
    ru: 'Плагин'
  }
};

// 质量检查规则
const QUALITY_RULES = {
  minLength: 2,
  maxLengthRatio: 3,
  specialChars: /[<>{}[\]\\]/g,
  formatPreservation: true,
  cssClassPattern: /^[a-zA-Z0-9\-_]+$/,
  placeholderPattern: /\{\{.*?\}\}/g,
  languageRules: {
    zh: {
      maxLengthRatio: 2.5,
      allowedChars: /[\u4e00-\u9fa5a-zA-Z0-9\s.,!?，。！？]/g
    },
    ja: {
      maxLengthRatio: 2.8,
      allowedChars: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uFF00-\uFFEFa-zA-Z0-9\s.,!?，。！？]/g
    },
    ko: {
      maxLengthRatio: 2.7,
      allowedChars: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FFa-zA-Z0-9\s.,!?，。！？]/g
    }
  }
};

// 添加缓存相关配置
const CACHE_DIR = path.join(__dirname, '../.i18n-cache');
const CACHE_VERSION = '1.0.0';

// 确保缓存目录存在
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// 生成缓存键
function generateCacheKey(namespace, lang) {
  const content = fs.readFileSync(path.join(LOCALES_DIR, lang, `${namespace}.json`), 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// 检查缓存
function checkCache(namespace, lang) {
  const cacheKey = generateCacheKey(namespace, lang);
  const cacheFile = path.join(CACHE_DIR, `${namespace}.${lang}.${cacheKey}.json`);
  
  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (cached.version === CACHE_VERSION) {
        return cached.data;
      }
    } catch (error) {
      console.log(`Cache invalid for ${namespace}.${lang}`);
    }
  }
  return null;
}

// 保存到缓存
function saveToCache(namespace, lang, data) {
  const cacheKey = generateCacheKey(namespace, lang);
  const cacheFile = path.join(CACHE_DIR, `${namespace}.${lang}.${cacheKey}.json`);
  
  fs.writeFileSync(cacheFile, JSON.stringify({
    version: CACHE_VERSION,
    data: data
  }));
}

// 查找代码中使用的翻译键
function findUsedTranslationKeys() {
  const usedKeys = new Set();
  const srcFiles = glob.sync('**/*.{js,jsx,ts,tsx}', {
    cwd: SRC_DIR,
    ignore: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/build/**', '**/dist/**']
  });

  srcFiles.forEach(file => {
    const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
    const regexps = [
      /t\(['"`]([^'"`\)]+)['"`]\)/g,  // t('key')
      /<Trans[^>]+i18nKey=["']([^"']+)["']/g  // <Trans i18nKey="key"/>
    ];
    
    regexps.forEach(regex => {
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (match[1] && /^[a-zA-Z0-9_\-.]+$/.test(match[1])) {
          usedKeys.add(match[1]);
        }
      }
    });
  });

  return usedKeys;
}

// 添加翻译质量评分系统
const QUALITY_SCORES = {
  too_short: -2,
  too_long: -1,
  special_chars: -3,
  invalid_chars: -2,
  css_class_modified: -3,
  placeholder_mismatch: -3,
  term_inconsistency: -2
};

function calculateQualityScore(issues) {
  let score = 100;
  issues.forEach(issue => {
    score += QUALITY_SCORES[issue.reason] || 0;
  });
  return Math.max(0, Math.min(100, score));
}

// 修改检查翻译质量函数
function checkTranslationQuality(original, translated, lang) {
  const issues = [];
  
  // 获取语言特定规则
  const langRules = QUALITY_RULES.languageRules[lang] || {};
  
  // 检查长度
  if (translated.length < QUALITY_RULES.minLength) {
    issues.push({ reason: 'too_short' });
  }
  
  const maxRatio = langRules.maxLengthRatio || QUALITY_RULES.maxLengthRatio;
  if (translated.length > original.length * maxRatio) {
    issues.push({ reason: 'too_long' });
  }

  // 检查特殊字符
  if (QUALITY_RULES.specialChars.test(translated)) {
    issues.push({ reason: 'special_chars' });
  }

  // 检查语言特定字符
  if (langRules.allowedChars && !langRules.allowedChars.test(translated)) {
    issues.push({ reason: 'invalid_chars' });
  }

  // 检查CSS类名
  if (QUALITY_RULES.cssClassPattern.test(original)) {
    if (translated !== original) {
      issues.push({ reason: 'css_class_modified' });
    }
  }

  // 检查占位符
  const originalPlaceholders = original.match(QUALITY_RULES.placeholderPattern) || [];
  const translatedPlaceholders = translated.match(QUALITY_RULES.placeholderPattern) || [];
  if (originalPlaceholders.length !== translatedPlaceholders.length) {
    issues.push({ reason: 'placeholder_mismatch' });
  }

  // 检查术语一致性
  for (const [term, translations] of Object.entries(TERMS)) {
    if (original.includes(term) && !translated.includes(translations[lang])) {
      issues.push({ reason: 'term_inconsistency' });
    }
  }

  const score = calculateQualityScore(issues);
  return {
    valid: issues.length === 0,
    score,
    issues
  };
}

// 清理未使用的键
function cleanUnusedKeys(namespace, data, usedKeys) {
  const cleaned = {};
  let removedCount = 0;

  for (const [key, value] of Object.entries(data)) {
    const fullKey = `${namespace}.${key}`;
    
    if (usedKeys.has(fullKey) || key.includes('key_')) {
      if (typeof value === 'object' && value !== null) {
        const nestedResult = cleanUnusedKeys(fullKey, value, usedKeys);
        cleaned[key] = nestedResult.data;
        removedCount += nestedResult.removedCount;
      } else {
        cleaned[key] = value;
      }
    } else {
      removedCount++;
      console.log(`Removing unused key: ${fullKey}`);
    }
  }

  return { data: cleaned, removedCount };
}

// 检查翻译质量
function checkTranslations(namespace, enData, langData, lang) {
  const issues = [];
  let checkedCount = 0;

  for (const [key, enValue] of Object.entries(enData)) {
    const langValue = langData[key];
    if (!langValue) continue;

    if (typeof enValue === 'object' && typeof langValue === 'object') {
      const nestedIssues = checkTranslations(`${namespace}.${key}`, enValue, langValue, lang);
      issues.push(...nestedIssues);
    } else if (typeof enValue === 'string' && typeof langValue === 'string') {
      const quality = checkTranslationQuality(enValue, langValue, lang);
      if (!quality.valid) {
        issues.push({
          key: `${namespace}.${key}`,
          original: enValue,
          translated: langValue,
          issues: quality.issues,
          score: quality.score
        });
      }
    }
    checkedCount++;
  }

  return issues;
}

// 检查翻译覆盖率
function checkTranslationCoverage(enData, langData, namespace) {
  const coverage = {
    total: 0,
    translated: 0,
    missing: [],
    partial: []
  };

  function checkObject(enObj, langObj, path = '') {
    for (const [key, value] of Object.entries(enObj)) {
      const currentPath = path ? `${path}.${key}` : key;
      coverage.total++;

      if (typeof value === 'object' && value !== null) {
        if (!langObj[key] || typeof langObj[key] !== 'object') {
          coverage.missing.push(currentPath);
        } else {
          checkObject(value, langObj[key], currentPath);
        }
      } else {
        if (!langObj[key]) {
          coverage.missing.push(currentPath);
        } else if (typeof langObj[key] === 'string' && langObj[key].trim() === '') {
          coverage.partial.push(currentPath);
        } else {
          coverage.translated++;
        }
      }
    }
  }

  checkObject(enData, langData);
  
  return {
    namespace,
    coverage: (coverage.translated / coverage.total) * 100,
    total: coverage.total,
    translated: coverage.translated,
    missing: coverage.missing,
    partial: coverage.partial
  };
}

// 添加百度翻译API配置
const BAIDU_APP_ID = process.env.BAIDU_TRANSLATE_APP_ID;
const BAIDU_SECRET_KEY = process.env.BAIDU_TRANSLATE_SECRET_KEY;
const BAIDU_API_URL = 'https://fanyi-api.baidu.com/api/trans/vip/translate';

// 生成百度翻译API签名
function generateBaiduSign(text, salt) {
  const str = BAIDU_APP_ID + text + salt + BAIDU_SECRET_KEY;
  return crypto.createHash('md5').update(str).digest('hex');
}

// 修改自动翻译函数
async function autoTranslate(text, targetLang) {
  try {
    const salt = Date.now();
    const sign = generateBaiduSign(text, salt);
    
    const response = await axios.post(BAIDU_API_URL, null, {
      params: {
        q: text,
        from: 'en',
        to: targetLang,
        appid: BAIDU_APP_ID,
        salt: salt,
        sign: sign
      }
    });

    if (response.data && response.data.trans_result && response.data.trans_result[0]) {
      return response.data.trans_result[0].dst;
    }
    return null;
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    return null;
  }
}

// 修改批量翻译函数
async function batchTranslate(missingKeys, enData, targetLang) {
  const translations = {};
  const batchSize = 5; // 百度API建议每批不超过5个
  
  for (let i = 0; i < missingKeys.length; i += batchSize) {
    const batch = missingKeys.slice(i, i + batchSize);
    const promises = batch.map(async key => {
      const value = key.split('.').reduce((obj, k) => obj[k], enData);
      if (typeof value === 'string') {
        const translation = await autoTranslate(value, targetLang);
        if (translation) {
          let current = translations;
          const parts = key.split('.');
          for (let j = 0; j < parts.length - 1; j++) {
            current[parts[j]] = current[parts[j]] || {};
            current = current[parts[j]];
          }
          current[parts[parts.length - 1]] = translation;
        }
      }
    });
    
    await Promise.all(promises);
    // 添加延迟以避免API限制
    await new Promise(resolve => setTimeout(resolve, 1100)); // 百度API限制每秒不超过1次
  }
  
  return translations;
}

// 修改主函数，添加覆盖率检查
async function optimizeI18n() {
  console.log('Starting i18n optimization...\n');

  // 1. 查找使用的翻译键
  console.log('1. Finding used translation keys...');
  const usedKeys = findUsedTranslationKeys();
  console.log(`Found ${usedKeys.size} used keys\n`);

  // 2. 读取英文语言包
  console.log('2. Reading English language files...');
  const enDir = path.join(LOCALES_DIR, 'en');
  const namespaceFiles = fs.readdirSync(enDir)
    .filter(f => f.endsWith('.json'));

  // 3. 处理每个语言
  for (const lang of SUPPORTED_LANGUAGES) {
    console.log(`\nProcessing ${lang} language...`);
    const langDir = path.join(LOCALES_DIR, lang);
    
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    let totalRemoved = 0;
    let totalIssues = 0;
    let coverageReport = [];

    for (const file of namespaceFiles) {
      const namespace = file.replace('.json', '');
      console.log(`\nProcessing namespace: ${namespace}`);
      
      // 检查缓存
      const cached = checkCache(namespace, lang);
      if (cached) {
        console.log(`Using cached data for ${namespace}.${lang}`);
        continue;
      }
      
      const enData = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf8'));
      const localePath = path.join(langDir, file);
      
      let langData = {};
      try {
        langData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
      } catch (error) {
        console.log(`Creating new language file: ${localePath}`);
      }

      // 清理未使用的键
      const cleanResult = cleanUnusedKeys(namespace, langData, usedKeys);
      totalRemoved += cleanResult.removedCount;

      // 检查翻译质量
      const issues = checkTranslations(namespace, enData, cleanResult.data, lang);
      totalIssues += issues.length;

      // 输出问题和质量评分
      if (issues.length > 0) {
        console.log(`\nTranslation issues in ${namespace}:`);
        let totalScore = 0;
        issues.forEach(issue => {
          console.log(`- ${issue.key}:`);
          console.log(`  Original: ${issue.original}`);
          console.log(`  Translated: ${issue.translated}`);
          console.log(`  Issues: ${issue.issues.map(i => i.reason).join(', ')}`);
          console.log(`  Quality Score: ${issue.score}`);
          totalScore += issue.score;
        });
        console.log(`\nAverage Quality Score: ${(totalScore / issues.length).toFixed(2)}`);
      }

      // 检查翻译覆盖率
      const coverage = checkTranslationCoverage(enData, cleanResult.data, namespace);
      coverageReport.push(coverage);

      // 自动翻译缺失的键
      if (coverage.missing.length > 0 && process.env.ENABLE_AUTO_TRANSLATE === 'true') {
        console.log(`\nAuto-translating ${coverage.missing.length} missing keys for ${namespace}...`);
        const translations = await batchTranslate(coverage.missing, enData, lang);
        
        // 合并翻译结果
        Object.assign(cleanResult.data, translations);
        
        // 重新检查覆盖率
        const newCoverage = checkTranslationCoverage(enData, cleanResult.data, namespace);
        coverageReport[coverageReport.length - 1] = newCoverage;
      }

      // 保存优化后的文件
      fs.writeFileSync(
        localePath,
        JSON.stringify(cleanResult.data, null, 2),
        'utf8'
      );

      // 保存到缓存
      saveToCache(namespace, lang, cleanResult.data);
    }

    // 输出覆盖率报告
    console.log(`\n===> ${lang} language coverage report:`);
    coverageReport.forEach(report => {
      console.log(`\nNamespace: ${report.namespace}`);
      console.log(`Coverage: ${report.coverage.toFixed(2)}%`);
      console.log(`Total keys: ${report.total}`);
      console.log(`Translated: ${report.translated}`);
      if (report.missing.length > 0) {
        console.log('\nMissing translations:');
        report.missing.forEach(key => console.log(`- ${key}`));
      }
      if (report.partial.length > 0) {
        console.log('\nPartial translations:');
        report.partial.forEach(key => console.log(`- ${key}`));
      }
    });

    console.log(`\n===> ${lang} language optimization complete:`);
    console.log(`- Removed ${totalRemoved} unused keys`);
    console.log(`- Found ${totalIssues} translation issues`);
  }

  console.log('\nI18n optimization complete!');
}

module.exports = { optimizeI18n }; 