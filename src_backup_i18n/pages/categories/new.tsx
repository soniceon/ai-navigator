import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';
const titles = { zh: '最新推出', en: 'New Arrivals', ja: '新着', ko: '최신 출시', de: 'Neuheiten', fr: 'Nouveautés', es: 'Novedades', ru: 'Новинки' };
type LangKey = keyof typeof titles;
export default function NewArrivals() {
  const { lang } = useLanguage();
  const { t } = useTranslation('common');
  const langKey: LangKey = (Object.keys(titles).includes(lang) ? lang : 'en') as LangKey;
  // 取最新10个AI工具
  const latest = [...aiTools].slice(-10).reverse();
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('new_arrivals')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {latest.map((tool, idx) => (
          <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span>{tool.icon}</span>
              <span>{tool.name[langKey] || tool.name.en}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">{tool.desc[langKey] || tool.desc.en}</div>
            <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 