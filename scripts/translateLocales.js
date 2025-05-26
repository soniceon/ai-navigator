const fs = require('fs');
const path = require('path');
const { translate } = require('./baiduTranslate');
const glob = require('glob');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SRC_DIR = path.join(__dirname, '../src');
const SUPPORTED_LANGUAGES = ['zh', 'ko', 'ja', 'fr', 'de', 'es', 'ru'];

// === 自动备份语言包 ===
const BACKUP_DIR = path.join(__dirname, '../backup');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}
const backupName = `locales-backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
const backupPath = path.join(BACKUP_DIR, backupName);
if (!fs.existsSync(backupPath)) {
  fs.cpSync(LOCALES_DIR, backupPath, { recursive: true });
  console.log('已自动备份语言包到', backupPath);
}

// === 翻译缓存 ===
const CACHE_FILE = path.join(__dirname, 'translation-cache.json');
let translationCache = {};
try {
  if (fs.existsSync(CACHE_FILE)) {
    translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
} catch (e) {
  translationCache = {};
}
function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2), 'utf8');
}

async function translateLocales() {
  // ... 省略 ...
}

translateLocales().catch(console.error); 