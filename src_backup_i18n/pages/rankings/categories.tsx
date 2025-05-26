import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';
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
type Tool = typeof aiTools[number];
export default function CategoryRanking() {
  const { lang } = useLanguage();
  const { t, i18n } = useTranslation('common');
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('category_ranking')}</h1>
      {categories.map(cat => {
        const tools = aiTools.filter((t: Tool) => t.type === cat.type);
        if (!tools.length) return null;
        return (
          <div key={cat.type} className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <span>{cat.icon}</span>
              <span>{t(`category_${cat.type}`)}</span>
              <span className="text-xs text-gray-400">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.map((tool: Tool, idx: number) => (
                <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <span>{tool.icon}</span>
                    <span>{tool.name[lang] || tool.name.en}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{tool.desc[lang] || tool.desc.en}</div>
                  <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 