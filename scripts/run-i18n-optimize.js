require('dotenv').config();
const { optimizeI18n } = require('./i18n-optimize');

// 检查环境变量
if (!process.env.BAIDU_TRANSLATE_APP_ID || !process.env.BAIDU_TRANSLATE_SECRET_KEY) {
  console.error('Error: BAIDU_TRANSLATE_APP_ID and BAIDU_TRANSLATE_SECRET_KEY must be set in .env file');
  process.exit(1);
}

// 运行优化
console.log('Starting i18n optimization...');
optimizeI18n()
  .then(() => {
    console.log('i18n optimization completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during i18n optimization:', error);
    process.exit(1);
  }); 