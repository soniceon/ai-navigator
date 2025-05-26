const fs = require('fs');
const path = require('path');

const categories = require('../data/categories.json');
const localesDir = path.resolve(__dirname, '../../public/locales');
const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('common.json'));

let hasError = false;
categories.forEach(cat => {
  const key = `category_${cat.id}`;
  localeFiles.forEach(file => {
    const locale = file.split('/').pop().split('.')[0];
    const json = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));
    if (!json[key] || !json[key].trim()) {
      hasError = true;
      console.log(`[${locale}] 缺失或为空: ${key}`);
    }
  });
});
if (!hasError) console.log('所有分类名多语言都已补全且非空！'); 