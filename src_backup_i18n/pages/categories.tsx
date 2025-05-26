import { useState } from 'react';
import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const categories = [
  { type: 'chatbot', icon: '💬' },
  { type: 'image', icon: '🖼️' },
  { type: 'coding', icon: '💻' },
  { type: 'productivity', icon: '📝' },
  { type: 'design', icon: '🎨' },
  { type: 'writing', icon: '✍️' },
  { type: 'media', icon: '🎬' },
  { type: 'marketing', icon: '📢' },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { lang } = useLanguage();
  const { t } = useTranslation('common');
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en');

  const filteredTools = selectedCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.type === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto w-full px-4">
      <h1 className="text-3xl font-bold mb-6 mt-8">{t('ai_tool_categories')}</h1>
      <div className="space-y-16">
        {categories.map(cat => {
          const tools = aiTools.filter(t => t.type === cat.type);
          return (
            <section key={cat.type} id={cat.type} className="mb-12">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300">
                <span className="text-xl">{cat.icon}</span>
                {t(`category_${cat.type}`)}
              </h2>
              {tools.length === 0 ? (
                <div className="col-span-4 text-center text-gray-400">{t('no_category_tools')}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  {tools.map(tool => (
                    <div key={tool.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col items-start border border-gray-100 dark:border-gray-800">
                      <span className="text-3xl mb-2">{tool.icon}</span>
                      <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{tool.name[langKey]}</div>
                      <div className="text-xs text-purple-600 dark:text-purple-300 mb-2">{t(`category_${cat.type}`)}</div>
                      <div className="text-gray-500 dark:text-gray-300 text-sm mb-3 line-clamp-2">{tool.desc[langKey]}</div>
                      <div className="flex gap-2 text-xs text-gray-400 dark:text-gray-400 mb-2">
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
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}; 