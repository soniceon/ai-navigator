import { AiTool } from '../data/aiTools';
import { useTranslation } from 'next-i18next';
import { useLanguage } from '../contexts/LanguageContext';

export default function ToolCard({ tool }: { tool: AiTool }) {
  const { lang } = useLanguage();
  const { t } = useTranslation('common');
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as keyof typeof tool.name;
  return (
    <div className={
      `bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-start border border-gray-100 dark:border-gray-800 relative ${tool.featured ? 'ring-2 ring-purple-400' : ''}`
    }>
      {tool.featured && (
        <span className="absolute top-3 right-3 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full text-gray-900">★ Featured</span>
      )}
      <div className="text-3xl mb-2">{tool.icon}</div>
      <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{tool.name[langKey]}</div>
      <div className="text-xs text-purple-600 dark:text-purple-300 mb-2">{t(`type_${tool.type}`)}</div>
      <div className="text-gray-500 dark:text-gray-300 text-sm mb-3 line-clamp-2">{tool.desc[langKey]}</div>
      <div className="flex gap-2 text-xs text-gray-400 mb-2">
        <span>{t('rating')}: {tool.rating}</span>
        <span>{t('users')}: {tool.users}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-auto">
        {tool.tags.map(tag => {
          const key = 'tag_' + tag.toLowerCase().replace(/[^a-z0-9]/g, '');
          const localized = t(key) !== key ? t(key) : tag;
          return (
            <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded text-xs">{localized}</span>
          );
        })}
      </div>
    </div>
  );
} 