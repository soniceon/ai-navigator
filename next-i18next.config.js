/**
 * @type {import('next-i18next').UserConfig}
 */
const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined'
    ? path.resolve('./public/locales')
    : '/public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
};