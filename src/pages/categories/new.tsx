import { aiTools } from '@/data/aiTools';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const titles = { zh: '最新推出', en: 'New Arrivals', ja: '新着', ko: '최신 출시', de: 'Neuheiten', fr: 'Nouveautés', es: 'Novedades', ru: 'Новинки' };
type LangKey = keyof typeof titles;
export default function NewArrivals() {
  const { t, ready } = useTranslation('common');
  const { locale } = useRouter();
  const langKey: LangKey = (Object.keys(titles).includes(locale || '') ? (locale as LangKey) : 'en');
  if (!ready) return null; // 语言包未加载时不渲染，防止 hydration mismatch
  // 取最新10个AI工具
  const latest = [...aiTools].slice(-10).reverse();
  return (
    <div key={locale} className="py-8 max-w-6xl mx-auto">
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 